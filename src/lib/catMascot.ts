export type MascotState = 'idle' | 'watching' | 'petting';

export type CatScrollStep = 0 | 1 | 2 | 3 | 4;
export type CatFacing = 'left' | 'right';
export type CatScrollDirection = -1 | 0 | 1;
export type CatPetInteractionState = 'idle' | 'bunting' | 'recovering';
export type CatPetHeight = 'low' | 'mid' | 'high';

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ViewportLike {
  width: number;
  height: number;
}

export interface MascotPointer {
  x: number;
  y: number;
  active: boolean;
}

export interface CatLookPose {
  bodyYaw: number;
  headYaw: number;
  headPitch: number;
  tailBias: number;
  bodyRoll: number;
  frontLegLift: number;
  backLegLift: number;
  shoulderShift: number;
  rearStand: number;
}

export interface CatCompassPose {
  active: boolean;
  facing: CatFacing;
  focus: number;
  rootYaw: number;
  chestYaw: number;
  headYaw: number;
  headPitch: number;
  counterTailYaw: number;
  shoulderDrop: number;
}

export interface CatScrollPose {
  step: CatScrollStep;
  progress: number;
  panelX: number;
  panelY: number;
  scale: number;
  bodyPitch: number;
  bodyRoll: number;
  crouch: number;
  frontCrouch: number;
  airDive: number;
  frontReach: number;
  backPush: number;
  tailLift: number;
  lean: number;
  stretch: number;
  headBob: number;
  tailFlick: number;
  landingSettle: number;
  microHead: number;
  microTail: number;
  asymmetry: number;
  travelX: number;
  travelY: number;
  turnYaw: number;
  launchPower: number;
  landingGrip: number;
  idlePaw: number;
  facing: CatFacing;
}

export interface CatPlatformRect {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CatViewport {
  width: number;
  height: number;
  catWidth: number;
  catHeight: number;
}

export interface CatPlatformPose extends CatScrollPose {
  screenX: number;
  screenY: number;
  platformId: string;
  fromPlatformId: string;
  toPlatformId: string;
  phase: number;
  jump: number;
  directionTilt: number;
}

export interface CatPetPose {
  state: CatPetInteractionState;
  progress: number;
  intensity: number;
  side: CatFacing;
  height: CatPetHeight;
  sideSign: number;
  headYaw: number;
  headPitch: number;
  headRoll: number;
  bodyRoll: number;
  bodyPitch: number;
  bodyShift: number;
  bodyArch: number;
  tailLift: number;
  tailFlick: number;
  frontBrace: number;
  frontKnead: number;
  backPlant: number;
  rearStand: number;
}

export interface CatMascotAsset {
  path: string;
  sourceUrl: string;
  author: string;
  license: string;
  bytes: number;
  triangles: number;
  requiredExtensions: string[];
}

export interface CatHuntPose {
  state: 'idle' | 'watching' | 'stalk' | 'laser' | 'prePounce';
  pointerSpeed: number;
  stalkIntensity: number;
  headSnap: number;
  bodyCrouch: number;
  tailTwitch: number;
  frontBrace: number;
  pounceReadiness: number;
}

const assetBasePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function withAssetBase(path: string): string {
  return `${assetBasePath}${path}`;
}

export const CAT_MASCOT_ASSETS = {
  ghost: {
    path: withAssetBase('/models/cat/radeq-ginger-ghost.glb'),
    sourceUrl: 'local://radeq-ginger-ghost',
    author: 'Radeq.cz generated asset pipeline',
    license: 'Project-owned local generated asset',
    bytes: 1_200_000,
    triangles: 12_000,
    requiredExtensions: [] as string[],
  },
  quaternius: {
    path: withAssetBase('/models/cat/quaternius-cat.glb'),
    sourceUrl: 'https://poly.pizza/m/qKICY6xla2',
    author: 'Quaternius',
    license: 'CC0-1.0',
    bytes: 229_676,
    triangles: 2_448,
    requiredExtensions: [] as string[],
  },
} as const satisfies Record<string, CatMascotAsset>;

export const CAT_MASCOT_ASSET = CAT_MASCOT_ASSETS.ghost;

export function resolveCatMascotAsset(search = ''): CatMascotAsset {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  return params.get('cat') === 'quaternius' ? CAT_MASCOT_ASSETS.quaternius : CAT_MASCOT_ASSETS.ghost;
}

export function normalizeMascotPointer(rect: RectLike, clientX: number, clientY: number): MascotPointer {
  if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0, active: false };

  const x = ((clientX - rect.left) / rect.width) * 2 - 1;
  const y = ((clientY - rect.top) / rect.height) * 2 - 1;
  return {
    x: clamp(roundToZero(x), -1, 1),
    y: clamp(roundToZero(y), -1, 1),
    active: true,
  };
}

export function normalizeMascotPointerFromViewport(
  rect: RectLike,
  viewport: ViewportLike,
  clientX: number,
  clientY: number,
): MascotPointer {
  if (rect.width <= 0 || rect.height <= 0 || viewport.width <= 0 || viewport.height <= 0) {
    return { x: 0, y: 0, active: false };
  }

  const centerX = rect.left + rect.width * 0.5;
  const centerY = rect.top + rect.height * 0.45;
  const horizontalRange = Math.max(viewport.width * 0.42, rect.width * 1.8, 1);
  const verticalRange = Math.max(viewport.height * 0.38, rect.height * 1.55, 1);
  const x = (clientX - centerX) / horizontalRange;
  const y = (clientY - centerY) / verticalRange;

  return {
    x: clamp(roundToZero(x), -1, 1),
    y: clamp(roundToZero(y), -1, 1),
    active: true,
  };
}

export function getCatLookPose(pointer: MascotPointer): CatLookPose {
  if (!pointer.active) {
    return {
      bodyYaw: 0,
      headYaw: 0,
      headPitch: 0,
      tailBias: 0,
      bodyRoll: 0,
      frontLegLift: 0,
      backLegLift: 0,
      shoulderShift: 0,
      rearStand: 0,
    };
  }

  const x = clamp(pointer.x, -1, 1);
  const y = clamp(pointer.y, -1, 1);
  const attention = Math.min(Math.abs(x) + Math.abs(y) * 0.45, 1);
  const rearStand = clamp((-y - 0.28) / 0.62, 0, 1) * (0.45 + attention * 0.55);
  return {
    bodyYaw: x * 0.24,
    headYaw: x * 0.68,
    headPitch: y * 0.3,
    tailBias: x * 0.12,
    bodyRoll: x * -0.09,
    frontLegLift: attention * 0.2,
    backLegLift: attention * 0.16,
    shoulderShift: x * 0.08,
    rearStand,
  };
}

export function getCatCompassPose(pointer: MascotPointer): CatCompassPose {
  if (!pointer.active) return createZeroCatCompassPose('left');

  const x = clamp(pointer.x, -1, 1);
  const y = clamp(pointer.y, -1, 1);
  const lateral = Math.abs(x);
  const vertical = Math.abs(y);
  const focus = round3(clamp(lateral * 0.78 + vertical * 0.26, 0, 1));
  const yaw = Math.atan2(lateral, 0.82);

  return {
    active: true,
    facing: x >= 0 ? 'right' : 'left',
    focus,
    rootYaw: round3(clamp(yaw * 0.62, 0, 0.48) * focus),
    chestYaw: round3(clamp(yaw * 0.86, 0, 0.68) * (0.42 + focus * 0.58)),
    headYaw: round3(clamp(yaw * 1.18, 0, 0.92) * (0.46 + focus * 0.54)),
    headPitch: round3(clamp(y * 0.42, -0.34, 0.34) * (0.35 + focus * 0.65)),
    counterTailYaw: round3(clamp(yaw * -0.38, -0.34, 0) * (0.4 + focus * 0.6)),
    shoulderDrop: round3(focus * 0.055 + clamp(-y, 0, 1) * 0.035),
  };
}

export function getCatHuntPose(pointer: MascotPointer, pointerSpeed: number, elapsedTime = 0): CatHuntPose {
  if (!pointer.active) {
    return {
      state: 'idle',
      pointerSpeed: 0,
      stalkIntensity: 0,
      headSnap: 0,
      bodyCrouch: 0,
      tailTwitch: 0,
      frontBrace: 0,
      pounceReadiness: 0,
    };
  }

  const speed = clamp(pointerSpeed, 0, 2);
  const attention = clamp(Math.abs(pointer.x) * 0.72 + Math.abs(pointer.y) * 0.28, 0, 1);
  const stalkIntensity = clamp(attention * 0.45 + speed * 0.38, 0, 1);
  const stillPulse = speed < 0.12 ? (Math.sin(elapsedTime * 7.5) + 1) * 0.5 : 0;
  const pounceReadiness = clamp(stalkIntensity * 0.55 + stillPulse * attention * 0.35, 0, 1);
  const state =
    speed > 0.9 ? 'laser' : pounceReadiness > 0.45 ? 'prePounce' : stalkIntensity > 0.28 ? 'stalk' : 'watching';

  return {
    state,
    pointerSpeed: round3(speed),
    stalkIntensity: round3(stalkIntensity),
    headSnap: round3(clamp(speed * 0.55 + attention * 0.28, 0, 1)),
    bodyCrouch: round3(stalkIntensity * 0.32),
    tailTwitch: round3(stalkIntensity * 0.18 + speed * 0.22 + stillPulse * 0.08),
    frontBrace: round3(stalkIntensity * 0.34 + pounceReadiness * 0.18),
    pounceReadiness: round3(pounceReadiness),
  };
}

export function getCatPetPose(elapsedSeconds: number, influence: number, pointer: MascotPointer): CatPetPose {
  const sideSign = pointer.x < 0 ? -1 : 1;
  const side: CatFacing = sideSign < 0 ? 'left' : 'right';
  const y = pointer.active ? clamp(pointer.y, -1, 1) : 0;
  const height: CatPetHeight = y < -0.25 ? 'high' : y > 0.35 ? 'low' : 'mid';
  const zero = createZeroCatPetPose(side, height, sideSign);
  const clampedInfluence = clamp(influence, 0, 1);

  if (elapsedSeconds >= 1.2 || clampedInfluence <= 0) return zero;

  const progress = clamp(elapsedSeconds / 1.2, 0, 1);
  const envelope =
    elapsedSeconds < 0.16
      ? easeOutCubic(elapsedSeconds / 0.16)
      : elapsedSeconds < 0.55
        ? 1
        : 1 - easeInOutCubic((elapsedSeconds - 0.55) / 0.65);
  const pet = clampedInfluence * clamp(envelope, 0, 1);

  if (pet <= 0.001) return { ...zero, progress: 1 };

  const sideStrength = pointer.active ? Math.abs(clamp(pointer.x, -1, 1)) : 0.35;
  const highBias = clamp((-y - 0.15) / 0.85, 0, 1);
  const lowBias = clamp((y - 0.15) / 0.85, 0, 1);
  const pressPulse = bell(progress, 0.28, 0.24);
  const tailWave = Math.max(0, Math.sin(progress * Math.PI * 4.7));
  const kneadWave = Math.max(0, Math.sin(progress * Math.PI * 8.4));

  return {
    state: elapsedSeconds < 0.55 ? 'bunting' : 'recovering',
    progress,
    intensity: round3(pet),
    side,
    height,
    sideSign,
    headYaw: sideSign * pet * (0.24 + sideStrength * 0.26 + pressPulse * 0.08),
    headPitch: pet * (-highBias * 0.18 + lowBias * 0.06 + 0.02 - pressPulse * 0.04),
    headRoll: -sideSign * pet * (0.1 + highBias * 0.12 + pressPulse * 0.04),
    bodyRoll: -sideSign * pet * (0.045 + sideStrength * 0.045),
    bodyPitch: pet * (0.04 + lowBias * 0.05 - highBias * 0.02),
    bodyShift: sideSign * pet * (0.045 + sideStrength * 0.035),
    bodyArch: pet * (0.08 + lowBias * 0.14 + pressPulse * 0.04),
    tailLift: pet * (0.42 + lowBias * 0.12 + highBias * 0.08),
    tailFlick: pet * (0.14 + tailWave * 0.18),
    frontBrace: pet * (0.24 + highBias * 0.16 + pressPulse * 0.08),
    frontKnead: pet * (0.05 + kneadWave * 0.11),
    backPlant: round3(1 - pet * 0.08),
    rearStand: 0,
  };
}

export function getCatAttentionFacing(
  pointer: MascotPointer,
  motionFacing: CatFacing,
  scrollMotionActive: boolean,
): CatFacing {
  if (scrollMotionActive || !pointer.active || Math.abs(pointer.x) < 0.12) return motionFacing;
  return pointer.x > 0 ? 'right' : 'left';
}

export function getCatRenderFacingTransform(facing: CatFacing): { scaleX: 1 | -1; yawMultiplier: 1 | -1 } {
  return facing === 'right' ? { scaleX: 1, yawMultiplier: 1 } : { scaleX: -1, yawMultiplier: -1 };
}

export function getCatScrollPose(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
  elapsedTime = 0,
): CatScrollPose {
  const pageScroll = Math.max(documentHeight - viewportHeight, 1);
  const descentScroll = Math.max(viewportHeight * 2.85, 1);
  const maxScroll = Math.min(pageScroll, descentScroll);
  const progress = clamp(scrollY / maxScroll, 0, 1);
  const step = quantizeScrollStep(progress);
  const phase = clamp((progress - step * 0.2) / 0.2, 0, 1);
  const dropProgress = phase < 0.18 ? 0 : phase > 0.88 ? 1 : easeInQuad((phase - 0.18) / 0.7);
  const crouchPulse = bell(phase, 0.12, 0.12);
  const pushPulse = bell(phase, 0.24, 0.16);
  const airPulse = phase > 0.18 && phase < 0.88 ? Math.sin(dropProgress * Math.PI) : 0;
  const landPulse = bell(phase, 0.9, 0.12);
  const settlePulse = bell(phase, 0.98, 0.08);
  const leanPulse = bell(phase, 0.14, 0.16);
  const stretchPulse = bell(phase, 0.52, 0.34);

  const anchors = [
    { x: 0.06, y: 0.02, scale: 1, pitch: 0.02, roll: 0 },
    { x: 0.03, y: 0.2, scale: 0.98, pitch: -0.08, roll: -0.025 },
    { x: 0.06, y: 0.39, scale: 0.95, pitch: -0.09, roll: 0.02 },
    { x: 0.02, y: 0.58, scale: 0.92, pitch: -0.07, roll: -0.018 },
    { x: 0.04, y: 0.78, scale: 0.88, pitch: -0.04, roll: 0.012 },
  ];
  const from = anchors[step];
  const to = anchors[Math.min(step + 1, anchors.length - 1)];
  const downArc = airPulse * 0.026;
  const travelX = clamp((to.x - from.x) * 8, -1, 1);
  const travelY = clamp((to.y - from.y) * 4, -1, 1);
  const dropIntent = clamp(travelY, 0, 1);
  const airDive = airPulse * dropIntent;
  const turnYaw = travelX * airPulse * 0.34 + travelX * pushPulse * 0.12;
  const idleMask = 1 - clamp(crouchPulse + pushPulse + airPulse + landPulse + settlePulse, 0, 1);

  return {
    step,
    progress,
    panelX: lerp(from.x, to.x, dropProgress),
    panelY: lerp(from.y, to.y, dropProgress) - downArc,
    scale: lerp(from.scale, to.scale, dropProgress) - landPulse * 0.018,
    bodyPitch:
      lerp(from.pitch, to.pitch, dropProgress) +
      crouchPulse * 0.16 -
      pushPulse * 0.1 +
      airDive * 0.24 +
      settlePulse * 0.05,
    bodyRoll: lerp(from.roll, to.roll, dropProgress),
    crouch: crouchPulse * 0.24 + landPulse * 0.16 + settlePulse * 0.08,
    frontCrouch: crouchPulse * 0.36 + pushPulse * 0.14 + landPulse * 0.06,
    airDive,
    frontReach: airPulse * (0.28 + dropIntent * 0.26) + landPulse * 0.08,
    backPush: pushPulse * 0.3,
    tailLift: 0.1 + progress * 0.1 + airPulse * 0.16,
    lean: leanPulse * 0.32 - landPulse * 0.1,
    stretch: stretchPulse * 0.34 + pushPulse * 0.1,
    headBob: landPulse * 0.24 + crouchPulse * 0.08 + settlePulse * 0.12,
    tailFlick: landPulse * 0.2 + pushPulse * 0.08 + settlePulse * 0.15,
    landingSettle: settlePulse,
    microHead: Math.sin(elapsedTime * 0.82) * 0.04 + Math.sin(elapsedTime * 1.6) * 0.02,
    microTail: Math.sin(elapsedTime * 1.15) * 0.08 + Math.sin(elapsedTime * 2.4) * 0.04,
    asymmetry: Math.sin(phase * Math.PI) * 0.12,
    travelX,
    travelY,
    turnYaw,
    launchPower: pushPulse,
    landingGrip: clamp(landPulse + settlePulse * 0.65, 0, 1),
    idlePaw: Math.sin(elapsedTime * 1.35 + step) * 0.12 * idleMask,
    facing: getFacingFromTravelX(travelX),
  };
}

export function getCatPlatformPose(
  scrollY: number,
  viewport: CatViewport,
  platforms: CatPlatformRect[],
  elapsedTime = 0,
  scrollDirection: CatScrollDirection = 1,
): CatPlatformPose | null {
  const usablePlatforms = platforms
    .filter((platform) => platform.width >= 80 && platform.height >= 18)
    .sort((a, b) => a.top - b.top);
  if (usablePlatforms.length === 0) return null;

  const scanY = scrollY + viewport.height * 0.38;
  const lastIndex = usablePlatforms.length - 1;
  let fromIndex = 0;
  let toIndex = Math.min(1, lastIndex);

  if (scanY >= usablePlatforms[lastIndex].top) {
    fromIndex = Math.max(lastIndex - 1, 0);
    toIndex = lastIndex;
  } else {
    for (let index = 0; index < lastIndex; index += 1) {
      const current = usablePlatforms[index];
      const next = usablePlatforms[index + 1];
      if (scanY >= current.top && scanY < next.top) {
        fromIndex = index;
        toIndex = index + 1;
        break;
      }
    }
  }

  const fromPlatform = usablePlatforms[fromIndex];
  const toPlatform = usablePlatforms[toIndex];
  const span = Math.max(toPlatform.top - fromPlatform.top, viewport.height * 0.25);
  const phase = fromPlatform === toPlatform ? 0 : clamp((scanY - fromPlatform.top) / span, 0, 1);
  const eased = easeInOutCubic(phase);
  const fromTarget = getPlatformTarget(fromPlatform, fromIndex, scrollY, viewport);
  const toTarget = getPlatformTarget(toPlatform, toIndex, scrollY, viewport);
  const rawTravelX = toTarget.x - fromTarget.x;
  const rawTravelY = toTarget.y - fromTarget.y;
  const travelDirection = scrollDirection < 0 ? -1 : 1;
  const travelX = clamp((rawTravelX * travelDirection) / Math.max(viewport.width * 0.3, 1), -1, 1);
  const travelY = clamp((rawTravelY * travelDirection) / Math.max(viewport.height * 0.42, 1), -1, 1);
  const dropIntent = clamp(travelY, 0, 1);
  const climbIntent = clamp(-travelY, 0, 1);
  const lateralIntent = Math.abs(travelX);
  const jumpEnergy = 1 + climbIntent * 0.28 - dropIntent * 0.12 + lateralIntent * 0.08;
  const jump = Math.sin(eased * Math.PI) * clamp(Math.abs(rawTravelY) * 0.42, 34, 92) * jumpEnergy;
  const airPulse = phase > 0.16 && phase < 0.88 ? Math.sin(eased * Math.PI) : 0;
  const anticipationPulse = bell(phase, 0.08, 0.12);
  const pushPulse = bell(phase, 0.22, 0.16);
  const flightStretch = bell(phase, 0.5, 0.34);
  const landPulse = bell(phase, 0.92, 0.12);
  const settlePulse = bell(phase, 0.98, 0.08);
  const airDive = airPulse * (dropIntent - climbIntent);
  const turnYaw = travelX * (0.28 + airPulse * 0.44) + airDive * travelX * 0.16;
  const progress = lastIndex === 0 ? 0 : (fromIndex + phase) / lastIndex;
  const idleMask = 1 - clamp(anticipationPulse + pushPulse + airPulse + landPulse + settlePulse, 0, 1);

  return {
    step: Math.min(fromIndex, 4) as CatScrollStep,
    progress,
    panelX: lerp(fromTarget.x, toTarget.x, eased) / Math.max(viewport.width, 1) - 0.5,
    panelY: progress,
    screenX: lerp(fromTarget.x, toTarget.x, eased),
    screenY: lerp(fromTarget.y, toTarget.y, eased) - jump,
    scale: lerp(1, 0.9, progress) - landPulse * 0.018,
    bodyPitch:
      anticipationPulse * 0.18 -
      pushPulse * (0.13 + climbIntent * 0.08) +
      airDive * (0.28 + lateralIntent * 0.04) +
      landPulse * (0.1 + dropIntent * 0.1) +
      settlePulse * 0.06,
    bodyRoll: Math.sin(progress * Math.PI * 2) * 0.035 + travelX * airPulse * 0.034 - travelX * landPulse * 0.018,
    crouch: anticipationPulse * 0.32 + landPulse * 0.22 + settlePulse * 0.1,
    frontCrouch: anticipationPulse * 0.44 + pushPulse * 0.18 + landPulse * 0.06,
    airDive,
    frontReach: airPulse * (0.3 + dropIntent * 0.34 - climbIntent * 0.08) + landPulse * 0.08,
    backPush: pushPulse * (0.32 + climbIntent * 0.16) + airPulse * climbIntent * 0.16,
    tailLift: 0.1 + progress * 0.08 + airPulse * (0.18 + dropIntent * 0.1),
    lean: anticipationPulse * 0.4 + pushPulse * 0.18 - landPulse * (0.1 + dropIntent * 0.08),
    stretch: flightStretch * (0.38 + lateralIntent * 0.1 + climbIntent * 0.08) + pushPulse * 0.12,
    headBob: landPulse * (0.24 + dropIntent * 0.18) + anticipationPulse * 0.1 + settlePulse * 0.15,
    tailFlick: landPulse * (0.24 + dropIntent * 0.2) + pushPulse * 0.1 + airPulse * 0.06 + settlePulse * 0.2,
    platformId: phase < 0.5 ? fromPlatform.id : toPlatform.id,
    fromPlatformId: fromPlatform.id,
    toPlatformId: toPlatform.id,
    phase,
    jump,
    landingSettle: settlePulse,
    microHead: Math.sin(elapsedTime * 0.75) * 0.03 + Math.sin(elapsedTime * 1.4) * 0.015,
    microTail: Math.sin(elapsedTime * 1.05) * 0.07 + Math.sin(elapsedTime * 2.2) * 0.035,
    asymmetry: Math.sin(phase * Math.PI) * 0.15 + travelX * airPulse * 0.06,
    travelX,
    travelY,
    turnYaw,
    launchPower: pushPulse,
    landingGrip: clamp(landPulse + settlePulse * 0.7, 0, 1),
    idlePaw: Math.sin(elapsedTime * 1.3 + fromIndex) * 0.12 * idleMask,
    directionTilt: travelX * airPulse * 0.85,
    facing: getFacingFromTravelX(travelX),
  };
}

export function quantizeScrollStep(progress: number): CatScrollStep {
  const clamped = clamp(progress, 0, 0.999);
  return Math.min(Math.floor(clamped / 0.2), 4) as CatScrollStep;
}

export function pickMascotAnimation(animationNames: string[], state: MascotState): string {
  const preferred =
    state === 'petting'
      ? ['headbutt', 'yes', 'idle']
      : state === 'watching'
        ? ['idle', 'walk']
        : ['idle', 'walk'];

  for (const key of preferred) {
    const clip = animationNames.find((name) => name.toLowerCase().includes(key));
    if (clip) return clip;
  }

  return animationNames[0] ?? '';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function getPlatformTarget(platform: CatPlatformRect, index: number, scrollY: number, viewport: CatViewport) {
  const safe = 14;
  const rightLanding = platform.left + platform.width - viewport.catWidth * 0.78;
  const centerLanding = platform.left + platform.width * 0.62 - viewport.catWidth * 0.5;
  const desiredX = index % 2 === 0 ? rightLanding : centerLanding;
  const platformY = platform.top - scrollY - viewport.catHeight * 0.72;
  const upperLaneMax = Math.max(safe, viewport.height * 0.36);
  const desiredY = Math.min(platformY, upperLaneMax);

  return {
    x: clamp(desiredX, safe, Math.max(safe, viewport.width - viewport.catWidth - safe)),
    y: clamp(desiredY, safe, upperLaneMax),
  };
}

function getFacingFromTravelX(travelX: number): CatFacing {
  return travelX > 0.025 ? 'right' : 'left';
}

function easeInOutCubic(value: number): number {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutCubic(value: number): number {
  const clamped = clamp(value, 0, 1);
  return 1 - Math.pow(1 - clamped, 3);
}

function easeInQuad(value: number): number {
  const clamped = clamp(value, 0, 1);
  return clamped * clamped;
}

function bell(value: number, center: number, radius: number): number {
  return Math.max(1 - Math.abs(value - center) / radius, 0);
}

function roundToZero(value: number): number {
  return Math.abs(value) < 1e-10 ? 0 : value;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function createZeroCatCompassPose(facing: CatFacing): CatCompassPose {
  return {
    active: false,
    facing,
    focus: 0,
    rootYaw: 0,
    chestYaw: 0,
    headYaw: 0,
    headPitch: 0,
    counterTailYaw: 0,
    shoulderDrop: 0,
  };
}

function createZeroCatPetPose(side: CatFacing, height: CatPetHeight, sideSign: number): CatPetPose {
  return {
    state: 'idle',
    progress: 1,
    intensity: 0,
    side,
    height,
    sideSign,
    headYaw: 0,
    headPitch: 0,
    headRoll: 0,
    bodyRoll: 0,
    bodyPitch: 0,
    bodyShift: 0,
    bodyArch: 0,
    tailLift: 0,
    tailFlick: 0,
    frontBrace: 0,
    frontKnead: 0,
    backPlant: 1,
    rearStand: 0,
  };
}
