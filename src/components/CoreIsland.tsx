import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Material, Object3D, Texture } from 'three';

import {
  CAT_MASCOT_ASSET,
  getCatAttentionFacing,
  getCatCompassPose,
  getCatHuntPose,
  getCatLookPose,
  getCatPetPose,
  getCatPlatformPose,
  getCatRenderFacingTransform,
  getCatScrollPose,
  normalizeMascotPointerFromViewport,
  pickMascotAnimation,
  resolveCatMascotAsset,
  type CatPlatformRect,
  type MascotPointer,
  type MascotState,
} from '../lib/catMascot';
import { resolveCatRig } from '../lib/catRig';

interface CoreIslandCopy {
  enableLabel: string;
  loadingLabel: string;
  failedLabel: string;
  reducedMotionLabel: string;
}

interface Props {
  copy: CoreIslandCopy;
}

type RenderState = MascotState | 'loading' | 'failed';

export default function CoreIsland({ copy }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotionBlocked, setReducedMotionBlocked] = useState(false);
  const [reducedMotionPreferred, setReducedMotionPreferred] = useState(false);
  const [mascotState, setMascotState] = useState<RenderState>('idle');
  const [hydrated, setHydrated] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHydrated(true);
    setPortalTarget(document.body);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotionPreferred(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotionBlocked || !mountRef.current || failed) return;

    let disposed = false;
    let cleanup = () => {};

    async function setup() {
      setLoading(true);
      setMascotState('loading');

      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
        if (disposed || !mountRef.current) return;

        const host = mountRef.current;
        const mascotAsset = resolveCatMascotAsset(window.location.search);
        host.dataset.mascotState = 'loading';
        host.dataset.modelSource = mascotAsset.sourceUrl;
        host.dataset.modelLicense = mascotAsset.license;
        host.dataset.catTexture = 'procedural-tabby-v1';
        host.replaceChildren();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0.38, 4.9);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.04;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.45));
        host.appendChild(renderer.domElement);

        const facingGroup = new THREE.Group();
        scene.add(facingGroup);

        const rig = new THREE.Group();
        rig.rotation.set(0.08, -0.48, 0.01);
        facingGroup.add(rig);

        scene.add(new THREE.HemisphereLight('#fff8e6', '#773814', 1.9));
        const keyLight = new THREE.DirectionalLight('#fff2d2', 2.8);
        keyLight.position.set(-3, 4, 5);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight('#7fe8ff', 0.75);
        rimLight.position.set(3.5, 2.2, -3);
        scene.add(rimLight);

        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(mascotAsset.path);
        if (disposed) return;

        const model = gltf.scene;
        const furTexture = createTabbyFurTexture(THREE);
        warmCatMaterials(model, THREE, furTexture);
        fitModelToPanel(model, rig, THREE);
        const modelBaseScale = model.scale.clone();

        const rigParts = resolveCatRig(model);
        host.dataset.catRigVersion = rigParts.version;
        host.dataset.catRigQuality = rigParts.quality;
        host.dataset.catRigMissing = rigParts.missing.join(',');
        const head = rigParts.head;
        const body = rigParts.body;
        const tail = rigParts.tail;
        const tailSegments = rigParts.tailSegments.length > 0 ? rigParts.tailSegments : tail ? [tail] : [];
        const frontLeftLeg = rigParts.legs.frontLeft;
        const frontRightLeg = rigParts.legs.frontRight;
        const backLeftLeg = rigParts.legs.backLeft;
        const backRightLeg = rigParts.legs.backRight;
        const earLeft = rigParts.ears.left;
        const earRight = rigParts.ears.right;
        const mixer = gltf.animations.length > 0 ? new THREE.AnimationMixer(model) : null;
        const animationNames = gltf.animations.map((clip) => clip.name);
        const clipsByName = new Map(gltf.animations.map((clip) => [clip.name, clip]));
        const idleClip = clipsByName.get(pickMascotAnimation(animationNames, 'idle'));

        if (mixer && idleClip) {
          const idleAction = mixer.clipAction(idleClip);
          idleAction.timeScale = 0.42;
          idleAction.play();
        }

        if ('compileAsync' in renderer) {
          await renderer.compileAsync(model, camera, scene);
          if (disposed) return;
        }

        let frame = 0;
        let currentMode: RenderState = 'loading';
        let pointer: MascotPointer = { x: 0, y: 0, active: false };
        let previousPointer: MascotPointer = pointer;
        let pointerSpeed = 0;
        let pettingStartedAt = -2;
        let pettingInfluence = 0;
        let pettingPointer: MascotPointer = { x: 0, y: 0, active: false };
        let lastFrameTime = performance.now();
        let elapsedTime = 0;
        let panelVisible = true;
        let documentVisible = !document.hidden;
        let scrollY = window.scrollY;
        let viewportWidth = window.innerWidth;
        let viewportHeight = window.innerHeight;
        let documentHeight = document.documentElement.scrollHeight;
        let previousScrollY = scrollY;
        let scrollDirection: -1 | 0 | 1 = 1;
        let lastScrollInputAt = -1000;
        let catPlatforms: CatPlatformRect[] = [];
        const baseRigRotation = new THREE.Euler(0.08, -0.48, 0.01);
        const rigTarget = new THREE.Vector3(0, 0, 0);
        const rigScaleTarget = new THREE.Vector3(1, 1, 1);
        const modelTarget = new THREE.Vector3(0, -0.18, 0);
        const modelScaleTarget = modelBaseScale.clone();
        const baseTransforms = new Map<Object3D, { x: number; y: number; z: number }>();
        for (const part of [
          body,
          head,
          ...tailSegments,
          earLeft,
          earRight,
          frontLeftLeg,
          frontRightLeg,
          backLeftLeg,
          backRightLeg,
        ]) {
          if (part) baseTransforms.set(part, { x: part.rotation.x, y: part.rotation.y, z: part.rotation.z });
        }

        function setMode(nextMode: RenderState) {
          if (currentMode === nextMode) return;
          currentMode = nextMode;
          host.dataset.mascotState = nextMode;
          setMascotState(nextMode);
        }

        function size() {
          const rect = host.getBoundingClientRect();
          const width = Math.max(rect.width, 1);
          const height = Math.max(rect.height, 1);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }

        function render() {
          renderer.render(scene, camera);
        }

        function shouldAnimate() {
          return panelVisible && documentVisible;
        }

        function readScrollMetrics() {
          const nextScrollY = window.scrollY;
          if (nextScrollY > previousScrollY + 1) {
            scrollDirection = 1;
          } else if (nextScrollY < previousScrollY - 1) {
            scrollDirection = -1;
          }
          previousScrollY = nextScrollY;
          scrollY = nextScrollY;
          viewportWidth = window.innerWidth;
          viewportHeight = window.innerHeight;
          documentHeight = document.documentElement.scrollHeight;
        }

        function readCatPlatforms() {
          catPlatforms = Array.from(document.querySelectorAll<HTMLElement>('[data-cat-platform]')).map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              id: element.dataset.catPlatform || element.id || element.className || 'platform',
              left: rect.left,
              top: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height,
            };
          });
          host.dataset.platformCount = String(catPlatforms.length);
        }

        function scheduleFrame() {
          if (!frame && shouldAnimate()) {
            lastFrameTime = performance.now();
            frame = window.requestAnimationFrame(tick);
          }
        }

        function updatePointerFromEvent(event: PointerEvent) {
          previousPointer = pointer;
          pointer = normalizeMascotPointerFromViewport(
            host.getBoundingClientRect(),
            { width: viewportWidth, height: viewportHeight },
            event.clientX,
            event.clientY,
          );
          const pointerDx = pointer.x - previousPointer.x;
          const pointerDy = pointer.y - previousPointer.y;
          pointerSpeed = pointer.active && previousPointer.active ? Math.min(Math.hypot(pointerDx, pointerDy) * 3.8, 2) : 0;
          host.dataset.pointerX = pointer.x.toFixed(3);
          host.dataset.pointerY = pointer.y.toFixed(3);
          host.dataset.pointerMode = 'viewport';
          host.dataset.pointerActive = pointer.active ? 'true' : 'false';
          if (pointer.active && currentMode !== 'petting') setMode('watching');
          scheduleFrame();
        }

        function onPointerMove(event: PointerEvent) {
          if (event.pointerType === 'touch') return;
          updatePointerFromEvent(event);
        }

        function onPointerExit() {
          pointer = { x: 0, y: 0, active: false };
          host.dataset.pointerActive = 'false';
          if (currentMode !== 'petting') setMode('idle');
          scheduleFrame();
        }

        function onPointerDown(event: PointerEvent) {
          updatePointerFromEvent(event);
          pettingPointer = pointer;
          const pettingAge = elapsedTime - pettingStartedAt;
          pettingStartedAt = pettingAge >= 1.2 ? elapsedTime : Math.max(pettingStartedAt, elapsedTime - 0.36);
          pettingInfluence = Math.min(1, Math.max(pettingInfluence, 0.52) + 0.36);
          setMode('petting');
          scheduleFrame();
        }

        function onScroll() {
          lastScrollInputAt = performance.now();
          readScrollMetrics();
          readCatPlatforms();
          scheduleFrame();
        }

        function onWindowResize() {
          readScrollMetrics();
          readCatPlatforms();
          size();
          render();
          scheduleFrame();
        }

        function tick() {
          frame = 0;
          if (disposed) return;
          if (!shouldAnimate()) return;

          const now = performance.now();
          const delta = Math.min((now - lastFrameTime) / 1000, 0.034);
          lastFrameTime = now;
          elapsedTime += delta;
          if (mixer) mixer.update(delta);

          const activeScene = document.documentElement.dataset.motionScene ?? 'top';
          const sceneCuriosity = activeScene.includes('matrix')
            ? 0.08
            : activeScene.includes('terminal')
              ? -0.05
              : activeScene.includes('demo') || activeScene.includes('handoff')
                ? 0.04
                : 0;
          host.dataset.catScene = activeScene;

          const pose = getCatLookPose(pointer);
          const compassPose = getCatCompassPose(pointer);
          pointerSpeed += (0 - pointerSpeed) * 0.08;
          const huntPose = getCatHuntPose(pointer, pointerSpeed, elapsedTime);
          const petPose = getCatPetPose(elapsedTime - pettingStartedAt, pettingInfluence, pettingPointer);
          const pettingActive = petPose.state !== 'idle';
          if (!pettingActive) {
            pettingInfluence = 0;
            if (currentMode === 'petting') setMode(pointer.active ? 'watching' : 'idle');
          }
          const platformPose = getCatPlatformPose(
            scrollY,
            {
              width: viewportWidth,
              height: viewportHeight,
              catWidth: host.clientWidth,
              catHeight: host.clientHeight,
            },
            catPlatforms,
            elapsedTime,
            scrollDirection,
          );
          const scrollPose =
            platformPose ?? getCatScrollPose(scrollY, viewportHeight, documentHeight, elapsedTime);
          const rearStand = pettingActive ? 0 : pose.rearStand;
          const screenRangeY = Math.max(viewportHeight - host.clientHeight - 120, 0);
          const scrollMotionActive = now - lastScrollInputAt < 520;
          const pointerFacingActive = compassPose.active && compassPose.focus >= 0.12 && !scrollMotionActive;
          const catFacing = pointerFacingActive
            ? compassPose.facing
            : getCatAttentionFacing(pointer, scrollPose.facing, scrollMotionActive);
          const facingSource = pointerFacingActive ? 'pointer' : 'motion';

          host.dataset.scrollStep = String(scrollPose.step);
          host.dataset.catLean = scrollPose.lean.toFixed(3);
          host.dataset.catStretch = scrollPose.stretch.toFixed(3);
          host.dataset.catFrontCrouch = scrollPose.frontCrouch.toFixed(3);
          host.dataset.catAirDive = scrollPose.airDive.toFixed(3);
          host.dataset.catRearStand = rearStand.toFixed(3);
          host.dataset.catHeadBob = scrollPose.headBob.toFixed(3);
          host.dataset.catTailFlick = scrollPose.tailFlick.toFixed(3);
          host.dataset.catLandingSettle = scrollPose.landingSettle.toFixed(3);
          host.dataset.catAsymmetry = scrollPose.asymmetry.toFixed(3);
          host.dataset.catTravelX = scrollPose.travelX.toFixed(3);
          host.dataset.catTravelY = scrollPose.travelY.toFixed(3);
          host.dataset.catTurnYaw = scrollPose.turnYaw.toFixed(3);
          host.dataset.catLaunchPower = scrollPose.launchPower.toFixed(3);
          host.dataset.catLandingGrip = scrollPose.landingGrip.toFixed(3);
          host.dataset.catIdlePaw = scrollPose.idlePaw.toFixed(3);
          host.dataset.catFacing = catFacing;
          host.dataset.catFacingSource = facingSource;
          host.dataset.catCompassYaw = compassPose.rootYaw.toFixed(3);
          host.dataset.catCompassFocus = compassPose.focus.toFixed(3);
          host.dataset.catCompassPitch = compassPose.headPitch.toFixed(3);
          host.dataset.catHuntState = huntPose.state;
          host.dataset.catPointerSpeed = huntPose.pointerSpeed.toFixed(3);
          host.dataset.catStalkIntensity = huntPose.stalkIntensity.toFixed(3);
          host.dataset.catPounceReadiness = huntPose.pounceReadiness.toFixed(3);
          host.dataset.catInteractionState = petPose.state;
          host.dataset.catIntensity = petPose.intensity.toFixed(3);
          host.dataset.catPetSide = petPose.side;
          host.dataset.catPetHeight = petPose.height;
          host.dataset.catPetProgress = petPose.progress.toFixed(3);

          if (platformPose) {
            host.dataset.catMotion = 'platform';
            host.dataset.platformId = platformPose.platformId;
            host.dataset.jumpPhase = platformPose.phase.toFixed(3);
            host.dataset.catDirectionTilt = platformPose.directionTilt.toFixed(3);
            host.style.setProperty('--cat-screen-x', `${platformPose.screenX}px`);
            host.style.setProperty('--cat-screen-y', `${platformPose.screenY}px`);
          } else {
            host.dataset.catMotion = 'scroll';
            const fallbackX = viewportWidth - host.clientWidth - 16 + scrollPose.panelX * -72;
            const fallbackY = Math.min(
              Math.max(78, viewportHeight * 0.11) + scrollPose.panelY * screenRangeY,
              viewportHeight * 0.36,
            );
            host.style.setProperty('--cat-screen-x', `${fallbackX}px`);
            host.style.setProperty('--cat-screen-y', `${fallbackY}px`);
          }

          const microWeight = currentMode === 'idle' ? 1 : 0.42;
          const idleWeight = Math.max(
            0,
            1 -
              scrollPose.stretch * 2.4 -
              scrollPose.crouch * 1.4 -
              scrollPose.backPush * 1.6 -
              scrollPose.landingGrip * 0.9,
          );
          const climbIntent = Math.max(-scrollPose.travelY, 0);
          const dropIntent = Math.max(scrollPose.travelY, 0);
          const diveReach = Math.max(scrollPose.airDive, 0);
          const climbReach = Math.max(-scrollPose.airDive, 0);
          const pawPreview = scrollPose.asymmetry + scrollPose.idlePaw * idleWeight;
          const balanceTilt = scrollPose.travelX * (scrollPose.stretch * 0.18 + scrollPose.landingGrip * -0.08);
          const renderFacing = getCatRenderFacingTransform(catFacing);
          const facingMultiplier = renderFacing.yawMultiplier;
          const lookYaw =
            (compassPose.headYaw + pose.headYaw * 0.18 + (platformPose?.directionTilt ?? 0) * 0.45 + sceneCuriosity) *
            facingMultiplier;
          const bodyTurnYaw =
            scrollPose.turnYaw * facingMultiplier +
            compassPose.rootYaw * facingMultiplier +
            pose.bodyYaw * 0.24 * facingMultiplier;
          const petLocalYaw = petPose.headYaw * facingMultiplier;
          const petLocalRoll = petPose.headRoll * facingMultiplier;
          const petLocalBodyRoll = petPose.bodyRoll * facingMultiplier;
          const petLeftBrace = petPose.side === 'left' ? petPose.frontBrace : petPose.frontBrace * 0.46;
          const petRightBrace = petPose.side === 'right' ? petPose.frontBrace : petPose.frontBrace * 0.46;
          const petLeftKnead = petPose.side === 'right' ? petPose.frontKnead : petPose.frontKnead * 0.35;
          const petRightKnead = petPose.side === 'left' ? petPose.frontKnead : petPose.frontKnead * 0.35;
          const huntCrouch = huntPose.bodyCrouch * (pettingActive ? 0.2 : 1);
          const huntBrace = huntPose.frontBrace * (pettingActive ? 0.25 : 1);
          const huntTail = huntPose.tailTwitch * (pettingActive ? 0.35 : 1);

          facingGroup.scale.x = renderFacing.scaleX;

          rigTarget.set(
            pose.shoulderShift +
              scrollPose.bodyRoll * 0.45 +
              scrollPose.travelX * scrollPose.stretch * 0.04 +
              petPose.bodyShift,
            -scrollPose.crouch * 0.18 -
              scrollPose.frontCrouch * 0.045 -
              scrollPose.landingGrip * 0.045 -
              compassPose.shoulderDrop -
              huntCrouch * 0.06 -
              petPose.frontBrace * 0.035 +
              rearStand * 0.13,
            0,
          );
          rig.position.lerp(rigTarget, 0.075);
          rig.rotation.x +=
            (baseRigRotation.x +
              scrollPose.bodyPitch +
              scrollPose.lean * 0.12 +
              scrollPose.stretch * 0.16 -
              climbIntent * scrollPose.launchPower * 0.08 +
              scrollPose.airDive * 0.16 +
              dropIntent * scrollPose.landingGrip * 0.08 -
              huntCrouch * 0.16 -
              petPose.bodyPitch * 0.4 -
              petPose.bodyArch * 0.12 -
              rearStand * 0.34 -
              rig.rotation.x) *
            0.08;
          rig.rotation.y += (baseRigRotation.y + bodyTurnYaw + petLocalYaw * 0.16 - rig.rotation.y) * 0.12;
          rig.rotation.z +=
            (baseRigRotation.z + pose.bodyRoll + scrollPose.bodyRoll + balanceTilt + petLocalBodyRoll - rig.rotation.z) * 0.08;
          const targetScale = scrollPose.scale;
          rigScaleTarget.set(targetScale, targetScale, targetScale);
          rig.scale.lerp(rigScaleTarget, 0.08);
          modelTarget.set(
            0,
            -0.18 +
              Math.sin(elapsedTime * 1.35) * 0.025 * (0.35 + idleWeight * 0.65) -
              scrollPose.crouch * 0.08 -
              scrollPose.frontCrouch * 0.045 -
              scrollPose.landingGrip * 0.045 +
              petPose.bodyArch * 0.025 -
              petPose.frontBrace * 0.035 +
              rearStand * 0.2,
            0,
          );
          model.position.lerp(modelTarget, 0.12);
          modelScaleTarget.set(
            modelBaseScale.x * (1 - scrollPose.stretch * 0.035 + scrollPose.landingGrip * 0.018),
            modelBaseScale.y *
              (1 +
                scrollPose.stretch * 0.045 -
                scrollPose.crouch * 0.035 -
                scrollPose.landingGrip * 0.025 +
                petPose.bodyArch * 0.04 -
                petPose.frontBrace * 0.015 +
                rearStand * 0.1),
            modelBaseScale.z *
              (1 +
                scrollPose.stretch * 0.12 +
                scrollPose.launchPower * climbIntent * 0.045 +
                petPose.bodyArch * 0.025),
          );
          model.scale.lerp(modelScaleTarget, 0.12);

          const bodyBase = body ? baseTransforms.get(body) : null;
          if (body) {
            body.rotation.z +=
              ((bodyBase?.z ?? 0) +
                Math.sin(elapsedTime * 1.1) * 0.018 +
                pose.bodyRoll * 0.28 +
                scrollPose.bodyRoll * 0.35 -
                balanceTilt * 0.36 -
                petLocalBodyRoll * 0.75 -
                body.rotation.z) *
              0.14;
            body.rotation.x +=
              ((bodyBase?.x ?? 0) +
                scrollPose.crouch * 0.45 +
                scrollPose.frontCrouch * 0.32 +
                scrollPose.airDive * 0.42 +
                scrollPose.lean * 0.22 +
                scrollPose.stretch * 0.28 -
                scrollPose.launchPower * climbIntent * 0.12 +
                scrollPose.landingGrip * dropIntent * 0.16 -
                huntCrouch * 0.75 -
                petPose.bodyPitch * 0.5 +
                petPose.bodyArch * 0.85 -
                rearStand * 0.55 -
                body.rotation.x) *
              0.14;
            body.rotation.y +=
              ((bodyBase?.y ?? 0) +
                compassPose.chestYaw * facingMultiplier * 0.52 -
                scrollPose.turnYaw * facingMultiplier * 0.14 +
                petLocalYaw * 0.12 -
                body.rotation.y) *
              0.12;
          }
          const headBase = head ? baseTransforms.get(head) : null;
          if (head) {
            head.rotation.y +=
              ((headBase?.y ?? 0) +
                lookYaw * (0.78 + huntPose.headSnap * 0.16) +
                petLocalYaw * 0.82 -
                head.rotation.y) *
              (0.18 + huntPose.headSnap * 0.04);
            head.rotation.x +=
              ((headBase?.x ?? 0) +
                pose.headPitch * 0.56 +
                compassPose.headPitch * 0.65 +
                huntCrouch * 0.18 -
                petPose.headPitch -
                scrollPose.bodyPitch * 0.24 -
                scrollPose.stretch * 0.18 +
                scrollPose.headBob * 0.45 +
                scrollPose.microHead * microWeight +
                diveReach * 0.28 -
                climbReach * 0.22 +
                dropIntent * scrollPose.landingGrip * 0.18 -
                climbIntent * scrollPose.launchPower * 0.12 +
                rearStand * 0.36 -
                head.rotation.x) *
              0.18;
            head.rotation.z += ((headBase?.z ?? 0) + petLocalRoll - head.rotation.z) * 0.18;
          }
          for (const [tailIndex, tailPart] of tailSegments.entries()) {
            const tailBase = baseTransforms.get(tailPart);
            const tailPhase = tailIndex * 0.55;
            const tailWeight = Math.max(0.45, 1 - tailIndex * 0.1);
            tailPart.rotation.z +=
              ((tailBase?.z ?? 0) +
                Math.sin(elapsedTime * 2.6 + tailPhase) * 0.11 * tailWeight +
                pose.tailBias * tailWeight +
                scrollPose.tailLift * tailWeight +
                scrollPose.tailFlick * 0.48 +
                scrollPose.microTail * microWeight +
                sceneCuriosity * 0.3 +
                dropIntent * scrollPose.landingGrip * 0.24 +
                climbIntent * scrollPose.launchPower * 0.16 +
                huntTail * Math.sin(elapsedTime * 8.5 + tailPhase) * 0.36 +
                compassPose.counterTailYaw * facingMultiplier * (0.65 - tailIndex * 0.06) +
                petPose.tailLift * 0.7 +
                petPose.tailFlick * petPose.sideSign * facingMultiplier * 0.42 +
                rearStand * 0.42 -
                tailPart.rotation.z) *
              0.16;
            tailPart.rotation.x += ((tailBase?.x ?? 0) + petPose.tailLift * 0.22 + huntTail * 0.08 - tailPart.rotation.x) * 0.14;
          }
          const frontLeftBase = frontLeftLeg ? baseTransforms.get(frontLeftLeg) : null;
          if (frontLeftLeg) {
            frontLeftLeg.rotation.x +=
              ((frontLeftBase?.x ?? 0) +
                pose.frontLegLift * 0.55 +
                scrollPose.frontCrouch * 0.46 -
                diveReach * 0.62 +
                climbReach * 0.22 -
                scrollPose.frontReach -
                pawPreview * 0.28 -
                scrollPose.landingGrip * 0.18 -
                huntBrace * 0.28 -
                petLeftBrace * 0.3 +
                petLeftKnead * 0.16 -
                rearStand * 0.75 -
                frontLeftLeg.rotation.x) *
              0.18;
            frontLeftLeg.rotation.z +=
              ((frontLeftBase?.z ?? 0) +
                pose.shoulderShift * 0.65 -
                petPose.bodyShift * 0.32 +
                petLeftKnead * 0.22 +
                rearStand * 0.24 -
                frontLeftLeg.rotation.z) *
              0.18;
          }
          const frontRightBase = frontRightLeg ? baseTransforms.get(frontRightLeg) : null;
          if (frontRightLeg) {
            frontRightLeg.rotation.x +=
              ((frontRightBase?.x ?? 0) -
                pose.frontLegLift * 0.38 -
                scrollPose.frontCrouch * 0.4 -
                diveReach * 0.54 +
                climbReach * 0.2 -
                scrollPose.frontReach * 0.72 +
                pawPreview * 0.24 -
                scrollPose.landingGrip * 0.12 -
                huntBrace * 0.22 -
                petRightBrace * 0.3 +
                petRightKnead * 0.16 -
                rearStand * 0.68 -
                frontRightLeg.rotation.x) *
              0.18;
            frontRightLeg.rotation.z +=
              ((frontRightBase?.z ?? 0) +
                pose.shoulderShift * 0.42 -
                petPose.bodyShift * 0.24 -
                petRightKnead * 0.22 -
                rearStand * 0.2 -
                frontRightLeg.rotation.z) *
              0.18;
          }
          const backLeftBase = backLeftLeg ? baseTransforms.get(backLeftLeg) : null;
          if (backLeftLeg) {
            backLeftLeg.rotation.x +=
              ((backLeftBase?.x ?? 0) -
                pose.backLegLift * 0.4 +
                scrollPose.backPush +
                scrollPose.crouch * 0.16 +
                climbReach * 0.32 -
                diveReach * 0.1 +
                pawPreview * 0.2 +
                scrollPose.launchPower * 0.08 +
                petPose.frontBrace * 0.08 +
                rearStand * 0.48 -
                backLeftLeg.rotation.x) *
              0.18;
          }
          const backRightBase = backRightLeg ? baseTransforms.get(backRightLeg) : null;
          if (backRightLeg) {
            backRightLeg.rotation.x +=
              ((backRightBase?.x ?? 0) +
                pose.backLegLift * 0.5 +
                scrollPose.backPush * 0.72 +
                scrollPose.crouch * 0.12 -
                climbReach * 0.28 -
                diveReach * 0.08 -
                pawPreview * 0.26 +
                scrollPose.launchPower * 0.06 +
                petPose.frontBrace * 0.06 +
                rearStand * 0.42 -
                backRightLeg.rotation.x) *
              0.18;
          }

          render();
          frame = window.requestAnimationFrame(tick);
        }

        const observer = new ResizeObserver(() => {
          size();
          render();
        });
        observer.observe(host);
        const visibilityObserver = new IntersectionObserver((entries) => {
          panelVisible = entries.some((entry) => entry.isIntersecting);
          if (panelVisible) {
            render();
            scheduleFrame();
          }
        });
        visibilityObserver.observe(host);
        const onDocumentVisibility = () => {
          documentVisible = !document.hidden;
          if (documentVisible) scheduleFrame();
        };
        document.addEventListener('visibilitychange', onDocumentVisibility);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onPointerExit);
        window.addEventListener('blur', onPointerExit);
        host.addEventListener('pointerdown', onPointerDown);

        let cleaned = false;
        cleanup = () => {
          if (cleaned) return;
          cleaned = true;
          observer.disconnect();
          visibilityObserver.disconnect();
          document.removeEventListener('visibilitychange', onDocumentVisibility);
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onWindowResize);
          window.removeEventListener('pointermove', onPointerMove);
          document.documentElement.removeEventListener('pointerleave', onPointerExit);
          window.removeEventListener('blur', onPointerExit);
          host.removeEventListener('pointerdown', onPointerDown);
          if (frame) window.cancelAnimationFrame(frame);
          mixer?.stopAllAction();
          disposeObject3D(scene);
          renderer.dispose();
          renderer.domElement.remove();
        };

        size();
        readScrollMetrics();
        readCatPlatforms();
        render();
        setMode('idle');
        setLoading(false);
        scheduleFrame();
      } catch (error) {
        cleanup();
        if (!disposed) {
          if (mountRef.current) {
            mountRef.current.dataset.mascotError = error instanceof Error ? error.message : 'unknown setup error';
          }
          setFailed(true);
          setLoading(false);
          setMascotState('failed');
        }
      }
    }

    void setup();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [enabled, failed, reducedMotionBlocked]);

  function enableCore() {
    setFailed(false);
    if (reducedMotionPreferred || prefersReducedMotion()) {
      setEnabled(true);
      setLoading(false);
      setReducedMotionBlocked(true);
      return;
    }

    setReducedMotionBlocked(false);
    setMascotState('loading');
    setEnabled(true);
  }

  const mascotCanvas =
    enabled && !reducedMotionBlocked ? (
      <div
        ref={mountRef}
        className="core-canvas core-canvas--roaming"
        aria-hidden="true"
        data-mascot-state={mascotState}
        data-model-source={CAT_MASCOT_ASSET.sourceUrl}
        data-model-license={CAT_MASCOT_ASSET.license}
        data-cat-texture="procedural-tabby-v1"
        data-cat-facing="left"
        data-cat-facing-source="motion"
        data-cat-compass-yaw="0.000"
        data-cat-compass-focus="0.000"
        data-cat-compass-pitch="0.000"
        data-cat-rig-version=""
        data-cat-rig-quality=""
        data-cat-rig-missing=""
        data-cat-hunt-state="idle"
        data-cat-pointer-speed="0.000"
        data-cat-stalk-intensity="0.000"
        data-cat-pounce-readiness="0.000"
        data-cat-interaction-state="idle"
        data-cat-intensity="0"
        data-cat-pet-side="right"
        data-cat-pet-height="mid"
        data-cat-pet-progress="1"
      />
    ) : null;

  return (
    <div className={`core-enhancement${enabled && !reducedMotionBlocked ? ' is-roaming' : ''}`}>
      {mascotCanvas && portalTarget ? createPortal(mascotCanvas, portalTarget) : mascotCanvas}
      {!enabled ? (
        <button type="button" className="core-enable" onClick={enableCore} disabled={!hydrated}>
          {copy.enableLabel}
        </button>
      ) : reducedMotionBlocked ? (
        <p className="core-load-state">{copy.reducedMotionLabel}</p>
      ) : loading ? (
        <p className="core-load-state">{copy.loadingLabel}</p>
      ) : failed ? (
        <p className="core-load-state">{copy.failedLabel}</p>
      ) : null}
    </div>
  );
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fitModelToPanel(model: Object3D, rig: Object3D, THREE: typeof import('three')) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z, 1);

  model.position.sub(center);
  model.position.y -= 0.18;
  model.scale.setScalar(2.15 / maxAxis);
  rig.add(model);
}

function warmCatMaterials(root: Object3D, THREE: typeof import('three'), furTexture: Texture | null) {
  root.traverse((node) => {
    const mesh = node as Object3D & {
      isMesh?: boolean;
      frustumCulled?: boolean;
      material?: Material | Material[];
    };
    if (!mesh.isMesh || !mesh.material) return;

    mesh.frustumCulled = false;
    for (const material of toMaterials(mesh.material)) {
      const label = `${mesh.name} ${mesh.parent?.name ?? ''} ${material.name ?? ''}`.toLowerCase();
      const isEye = /eye|pupil/.test(label);
      const isNose = /nose|mouth|whisker/.test(label);
      const isStripe = /stripe/.test(label);
      const isCream = /muzzle|belly|cheek|paw|toe|chin/.test(label);
      const tuned = material as Material & {
        color?: { set: (color: string) => void };
        roughness?: number;
        metalness?: number;
        map?: Texture | null;
      };

      if (isEye) {
        if (tuned.color) tuned.color.set('#160f08');
        if (typeof tuned.roughness === 'number') tuned.roughness = 0.36;
        if (typeof tuned.metalness === 'number') tuned.metalness = 0.01;
      } else if (isNose) {
        if (tuned.color) tuned.color.set('#7a371f');
        if (typeof tuned.roughness === 'number') tuned.roughness = 0.68;
        if (typeof tuned.metalness === 'number') tuned.metalness = 0;
      } else if (isStripe) {
        if (tuned.color) tuned.color.set('#7f3d14');
        if (typeof tuned.roughness === 'number') tuned.roughness = 0.9;
        if (typeof tuned.metalness === 'number') tuned.metalness = 0;
      } else if (isCream) {
        if (tuned.color) tuned.color.set('#ffd08a');
        if (typeof tuned.roughness === 'number') tuned.roughness = 0.84;
        if (typeof tuned.metalness === 'number') tuned.metalness = 0;
      } else {
        if (tuned.color) tuned.color.set('#f0a24f');
        if (typeof tuned.roughness === 'number') tuned.roughness = 0.9;
        if (typeof tuned.metalness === 'number') tuned.metalness = 0;
        if (furTexture) tuned.map = furTexture;
      }

      if (tuned.map) tuned.map.colorSpace = THREE.SRGBColorSpace;
      tuned.needsUpdate = true;
    }
  });
}

function createTabbyFurTexture(THREE: typeof import('three')): Texture | null {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const base = ctx.createLinearGradient(0, 0, 512, 512);
  base.addColorStop(0, '#f2b35d');
  base.addColorStop(0.42, '#dc8137');
  base.addColorStop(0.72, '#b85f24');
  base.addColorStop(1, '#f4b263');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);

  const belly = ctx.createRadialGradient(292, 310, 18, 292, 310, 188);
  belly.addColorStop(0, 'rgba(255, 204, 124, 0.78)');
  belly.addColorStop(0.48, 'rgba(240, 166, 76, 0.36)');
  belly.addColorStop(1, 'rgba(240, 166, 76, 0)');
  ctx.fillStyle = belly;
  ctx.fillRect(0, 0, 512, 512);

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let i = 0; i < 13; i += 1) {
    const x = 26 + i * 40 + seededUnit(i * 3.17) * 18;
    const wobble = seededUnit(i * 9.41) * 44 - 22;
    ctx.strokeStyle = 'rgba(98, 46, 15, 0.36)';
    ctx.lineWidth = 7 + seededUnit(i * 4.73) * 7;
    ctx.beginPath();
    ctx.moveTo(x, -24);
    ctx.bezierCurveTo(x - 32, 112, x + 44 + wobble, 238, x - 8, 536);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 183, 89, 0.19)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x + 9, -12);
    ctx.bezierCurveTo(x - 14, 132, x + 54 + wobble, 252, x + 12, 522);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(75, 35, 13, 0.38)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(202, 86);
  ctx.lineTo(224, 130);
  ctx.lineTo(256, 92);
  ctx.lineTo(288, 132);
  ctx.lineTo(312, 84);
  ctx.stroke();

  for (let i = 0; i < 1200; i += 1) {
    const x = seededUnit(i * 5.39) * 512;
    const y = seededUnit(i * 7.17 + 4) * 512;
    const length = 3 + seededUnit(i * 11.93) * 11;
    const alpha = 0.07 + seededUnit(i * 13.23) * 0.1;
    ctx.strokeStyle = i % 3 === 0 ? `rgba(255, 222, 157, ${alpha})` : `rgba(88, 43, 15, ${alpha})`;
    ctx.lineWidth = 0.7 + seededUnit(i * 2.11) * 1.1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + seededUnit(i * 17.2) * 4 - 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.85, 1.2);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function seededUnit(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function disposeObject3D(root: Object3D) {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((node) => {
    const renderable = node as Object3D & {
      geometry?: { dispose: () => void };
      material?: Material | Material[];
    };
    renderable.geometry?.dispose();

    if (!renderable.material) return;
    for (const material of toMaterials(renderable.material)) {
      materials.add(material);
      collectTextures(material, textures);
    }
  });

  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
}

function collectTextures(material: Material, textures: Set<Texture>) {
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && 'isTexture' in value && value.isTexture) {
      textures.add(value as Texture);
    }
  }
}

function toMaterials(material: Material | Material[]): Material[] {
  return Array.isArray(material) ? material : [material];
}
