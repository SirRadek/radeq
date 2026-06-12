import { describe, expect, it } from 'vitest';

import {
  CAT_MASCOT_ASSET,
  CAT_MASCOT_ASSETS,
  getCatPlatformPose,
  getCatAttentionFacing,
  getCatCompassPose,
  getCatHuntPose,
  getCatLookPose,
  getCatPetPose,
  getCatRenderFacingTransform,
  getCatScrollPose,
  normalizeMascotPointer,
  normalizeMascotPointerFromViewport,
  pickMascotAnimation,
  quantizeScrollStep,
  resolveCatMascotAsset,
} from '../src/lib/catMascot';

describe('cat mascot controls', () => {
  it('keeps the selected GLB within the static-site asset budget', () => {
    expect(CAT_MASCOT_ASSET.path).toBe('/models/cat/radeq-ginger-ghost.glb');
    expect(CAT_MASCOT_ASSET.license).toBe('Project-owned local generated asset');
    expect(CAT_MASCOT_ASSET.provenance).toBe('project-owned-generated');
    expect(CAT_MASCOT_ASSET.loadingStrategy).toBe('user-activated-progressive-enhancement');
    expect(CAT_MASCOT_ASSET.seoRole).toBe('decorative-helper');
    expect(CAT_MASCOT_ASSET.bytes).toBe(775_080);
    expect(CAT_MASCOT_ASSET.bytes).toBeLessThanOrEqual(CAT_MASCOT_ASSET.budgetBytes);
    expect(CAT_MASCOT_ASSET.triangles).toBeLessThanOrEqual(CAT_MASCOT_ASSET.budgetTriangles);
    expect(CAT_MASCOT_ASSET.requiredExtensions).toEqual([]);
    expect(CAT_MASCOT_ASSETS.quaternius.path).toBe('/models/cat/quaternius-cat.glb');
    expect(CAT_MASCOT_ASSETS.quaternius.provenance).toBe('third-party-cc0');
    expect(CAT_MASCOT_ASSETS.quaternius.bytes).toBeLessThanOrEqual(CAT_MASCOT_ASSETS.quaternius.budgetBytes);
    expect(resolveCatMascotAsset('?cat=quaternius').path).toBe('/models/cat/quaternius-cat.glb');
    expect(resolveCatMascotAsset('?cat=ghost').path).toBe('/models/cat/radeq-ginger-ghost.glb');
  });

  it('normalizes pointer coordinates from the panel center and clamps edges', () => {
    const rect = { left: 10, top: 20, width: 200, height: 100 };

    expect(normalizeMascotPointer(rect, 110, 70)).toEqual({ x: 0, y: 0, active: true });
    expect(normalizeMascotPointer(rect, 310, -80)).toEqual({ x: 1, y: -1, active: true });
    expect(normalizeMascotPointer({ ...rect, width: 0 }, 110, 70)).toEqual({ x: 0, y: 0, active: false });
  });

  it('tracks pointer direction from the cat center across the full viewport', () => {
    const rect = { left: 620, top: 120, width: 140, height: 170 };
    const viewport = { width: 1200, height: 800 };

    const farLeft = normalizeMascotPointerFromViewport(rect, viewport, 40, 200);
    const farRight = normalizeMascotPointerFromViewport(rect, viewport, 1140, 200);
    const high = normalizeMascotPointerFromViewport(rect, viewport, 690, 20);

    expect(farLeft.active).toBe(true);
    expect(farLeft.x).toBeLessThan(-0.9);
    expect(farRight.x).toBeGreaterThan(0.7);
    expect(high.y).toBeLessThan(-0.4);
  });

  it('caps head and body rotations so pointer tracking stays believable', () => {
    const pose = getCatLookPose({ x: 3, y: -4, active: true });

    expect(Math.abs(pose.bodyYaw)).toBeLessThanOrEqual(0.24);
    expect(Math.abs(pose.headYaw)).toBeLessThanOrEqual(0.68);
    expect(Math.abs(pose.headPitch)).toBeLessThanOrEqual(0.3);
    expect(Math.abs(pose.tailBias)).toBeLessThanOrEqual(0.12);
    expect(Math.abs(pose.bodyRoll)).toBeLessThanOrEqual(0.09);
    expect(Math.abs(pose.frontLegLift)).toBeLessThanOrEqual(0.2);
    expect(Math.abs(pose.backLegLift)).toBeLessThanOrEqual(0.16);
    expect(Math.abs(pose.shoulderShift)).toBeLessThanOrEqual(0.08);
    expect(pose.rearStand).toBeLessThanOrEqual(1);
  });

  it('adds subtle full-body motion when the cat follows a pointer', () => {
    const pose = getCatLookPose({ x: 0.8, y: -0.35, active: true });

    expect(Math.abs(pose.bodyRoll)).toBeGreaterThan(0.01);
    expect(Math.abs(pose.frontLegLift)).toBeGreaterThan(0.04);
    expect(Math.abs(pose.backLegLift)).toBeGreaterThan(0.03);
    expect(Math.abs(pose.shoulderShift)).toBeGreaterThan(0.01);
  });

  it('turns fast pointer motion into a playful predator hunt pose', () => {
    const calm = getCatHuntPose({ x: 0.2, y: 0.1, active: true }, 0.04, 4.2);
    const laser = getCatHuntPose({ x: 0.9, y: -0.25, active: true }, 1.8, 4.2);

    expect(calm.state).toBe('watching');
    expect(laser.state).toBe('laser');
    expect(laser.stalkIntensity).toBeGreaterThan(calm.stalkIntensity);
    expect(laser.headSnap).toBeGreaterThan(0.4);
    expect(laser.tailTwitch).toBeGreaterThan(0.2);
    expect(laser.frontBrace).toBeGreaterThan(0.2);
    expect(laser.pounceReadiness).toBeGreaterThan(0.2);
  });

  it('raises onto the back legs when the pointer is high above the cat', () => {
    const highPointer = getCatLookPose({ x: 0.1, y: -0.95, active: true });
    const lowPointer = getCatLookPose({ x: 0.1, y: 0.7, active: true });

    expect(highPointer.rearStand).toBeGreaterThan(0.5);
    expect(lowPointer.rearStand).toBe(0);
  });

  it('selects idle and petting clips from Quaternius animation names', () => {
    const clips = [
      'AnimalArmature|AnimalArmature|AnimalArmature|Idle',
      'AnimalArmature|AnimalArmature|AnimalArmature|Headbutt',
      'AnimalArmature|AnimalArmature|AnimalArmature|Walk',
    ];

    expect(pickMascotAnimation(clips, 'idle')).toContain('Idle');
    expect(pickMascotAnimation(clips, 'petting')).toContain('Headbutt');
    expect(pickMascotAnimation(['Walk'], 'idle')).toBe('Walk');
  });

  it('turns page scroll into staged descent poses', () => {
    expect(quantizeScrollStep(0)).toBe(0);
    expect(quantizeScrollStep(0.21)).toBe(1);
    expect(quantizeScrollStep(0.99)).toBe(4);

    const top = getCatScrollPose(0, 1000, 5000, 10.5);
    const crouch = getCatScrollPose(95, 1000, 5000, 10.5);
    const air = getCatScrollPose(300, 1000, 5000, 10.5);
    const landing = getCatScrollPose(560, 1000, 5000, 10.5);
    const lower = getCatScrollPose(2800, 1000, 5000, 10.5);

    expect(top.step).toBe(0);
    expect(crouch.crouch).toBeGreaterThan(top.crouch);
    expect(air.frontReach).toBeGreaterThan(top.frontReach);
    expect(crouch.lean).toBeGreaterThan(top.lean);
    expect(crouch.frontCrouch).toBeGreaterThan(top.frontCrouch);
    expect(air.stretch).toBeGreaterThan(top.stretch);
    expect(air.airDive).toBeGreaterThan(0);
    expect(Math.abs(air.panelX)).toBeLessThan(0.1);
    expect(top.panelY).toBeLessThan(lower.panelY);
    expect(lower.scale).toBeLessThan(top.scale);
    expect(lower.tailLift).toBeGreaterThan(top.tailLift);
    expect(lower.progress).toBeGreaterThan(0.65);

    // New fields
    expect(landing.landingSettle).toBeGreaterThan(0);
    expect(Math.abs(top.microHead)).toBeGreaterThan(0);
    expect(Math.abs(top.microTail)).toBeGreaterThan(0);
    expect(air.asymmetry).toBeGreaterThan(0);
    expect(air.travelY).toBeGreaterThan(0);
    expect(Math.abs(air.travelX)).toBeGreaterThan(0);
    expect(crouch.launchPower).toBeGreaterThan(top.launchPower);
    expect(landing.landingGrip).toBeGreaterThan(0);
    expect(Math.abs(top.idlePaw)).toBeGreaterThan(0);
  });

  it('maps page platforms into a jump arc target', () => {
    const platforms = [
      { id: 'hero-actions', left: 20, top: 220, width: 620, height: 60 },
      { id: 'matrix-workbench', left: 20, top: 860, width: 620, height: 80 },
      { id: 'demo-card', left: 20, top: 1500, width: 300, height: 120 },
    ];
    const viewport = { width: 800, height: 600, catWidth: 120, catHeight: 140 };

    const top = getCatPlatformPose(0, viewport, platforms, 5.2);
    const launch = getCatPlatformPose(140, viewport, platforms, 5.2);
    const midJump = getCatPlatformPose(360, viewport, platforms, 5.2);
    const nearLanding = getCatPlatformPose(610, viewport, platforms, 5.2);
    const lower = getCatPlatformPose(640, viewport, platforms, 5.2);

    expect(top).not.toBeNull();
    expect(launch).not.toBeNull();
    expect(midJump).not.toBeNull();
    expect(nearLanding).not.toBeNull();
    expect(lower).not.toBeNull();
    expect(top?.fromPlatformId).toBe('hero-actions');
    expect(midJump?.jump).toBeGreaterThan(30);
    expect(midJump?.phase).toBeGreaterThan(0);
    expect(midJump?.phase).toBeLessThan(1);
    expect(midJump?.jump).toBeGreaterThan(lower!.jump);
    expect(midJump?.stretch).toBeGreaterThan(0.2);
    expect(midJump?.airDive).toBeGreaterThan(0);
    expect(top?.lean).toBeGreaterThan(0.05);
    expect(top?.frontCrouch).toBeGreaterThan(midJump!.frontCrouch);
    expect(nearLanding?.headBob).toBeGreaterThan(0.05);
    expect(lower?.platformId).toBe('matrix-workbench');
    expect(top?.screenY).toBeLessThanOrEqual(viewport.height * 0.36);
    expect(midJump?.screenY).toBeLessThanOrEqual(viewport.height * 0.36);
    expect(lower?.screenY).toBeLessThanOrEqual(viewport.height * 0.36);
    expect(lower?.screenX).toBeGreaterThanOrEqual(14);
    expect(lower?.screenX).toBeLessThanOrEqual(viewport.width - viewport.catWidth - 14);

    // New fields
    expect(nearLanding?.landingSettle).toBeGreaterThan(0);
    expect(midJump?.asymmetry).toBeGreaterThan(0);
    expect(Math.abs(midJump?.directionTilt ?? 0)).toBeGreaterThan(0);
    expect(midJump?.travelY).toBeGreaterThan(0);
    expect(Math.abs(midJump?.travelX ?? 0)).toBeGreaterThan(0);
    expect(Math.abs(midJump?.turnYaw ?? 0)).toBeGreaterThan(0.1);
    expect(launch?.launchPower).toBeGreaterThan(0);
    expect(nearLanding?.landingGrip).toBeGreaterThan(0);
    expect(Math.abs(top?.idlePaw ?? 0)).toBeGreaterThan(0);
  });

  it('marks rightward platform jumps so the renderer can mirror the cat', () => {
    const platforms = [
      { id: 'left-rail', left: 20, top: 100, width: 220, height: 56 },
      { id: 'right-rail', left: 520, top: 520, width: 220, height: 56 },
    ];
    const viewport = { width: 900, height: 640, catWidth: 120, catHeight: 140 };

    const midJump = getCatPlatformPose(180, viewport, platforms, 2.4);

    expect(midJump?.travelX).toBeGreaterThan(0);
    expect(midJump?.facing).toBe('right');
  });

  it('moves platform roaming into a lower safe rail on mobile viewports', () => {
    const platforms = [
      { id: 'hero-copy', left: 16, top: 130, width: 350, height: 80 },
      { id: 'hero-actions', left: 16, top: 360, width: 350, height: 56 },
      { id: 'service-card', left: 16, top: 780, width: 350, height: 160 },
    ];
    const viewport = { width: 390, height: 844, catWidth: 96, catHeight: 112 };

    const top = getCatPlatformPose(0, viewport, platforms, 5.2);
    const mid = getCatPlatformPose(250, viewport, platforms, 5.2);

    expect(top).not.toBeNull();
    expect(mid).not.toBeNull();
    expect(top?.screenY).toBeGreaterThanOrEqual(viewport.height * 0.54);
    expect(mid?.screenY).toBeGreaterThanOrEqual(viewport.height * 0.54);
    expect(top?.screenY).toBeLessThanOrEqual(viewport.height - viewport.catHeight - 14);
    expect(mid?.screenY).toBeLessThanOrEqual(viewport.height - viewport.catHeight - 14);
    expect(top?.screenX).toBeGreaterThanOrEqual(14);
    expect(top?.screenX).toBeLessThanOrEqual(viewport.width - viewport.catWidth - 14);
  });

  it('lets the resting cat face the pointer after scroll motion stops', () => {
    expect(getCatAttentionFacing({ x: -0.8, y: 0, active: true }, 'right', false)).toBe('left');
    expect(getCatAttentionFacing({ x: 0.8, y: 0, active: true }, 'left', false)).toBe('right');
    expect(getCatAttentionFacing({ x: -0.8, y: 0, active: true }, 'right', true)).toBe('right');
    expect(getCatAttentionFacing({ x: 0.04, y: 0, active: true }, 'left', false)).toBe('left');
    expect(getCatAttentionFacing({ x: 0.8, y: 0, active: false }, 'left', false)).toBe('left');
  });

  it('creates a whole-body compass pose toward the active pointer', () => {
    const right = getCatCompassPose({ x: 0.92, y: -0.35, active: true });
    const left = getCatCompassPose({ x: -0.92, y: 0.22, active: true });
    const idle = getCatCompassPose({ x: 0, y: 0, active: false });

    expect(right.facing).toBe('right');
    expect(left.facing).toBe('left');
    expect(right.focus).toBeGreaterThan(0.65);
    expect(right.rootYaw).toBeGreaterThan(0.32);
    expect(right.chestYaw).toBeGreaterThan(right.rootYaw);
    expect(right.headYaw).toBeGreaterThan(right.chestYaw);
    expect(right.headPitch).toBeLessThan(0);
    expect(left.rootYaw).toBeCloseTo(right.rootYaw, 1);
    expect(idle.rootYaw).toBe(0);
    expect(idle.focus).toBe(0);
  });

  it('keeps the custom cat render facing aligned with pointer-facing intent', () => {
    expect(getCatRenderFacingTransform('right')).toEqual({ scaleX: 1, yawMultiplier: 1 });
    expect(getCatRenderFacingTransform('left')).toEqual({ scaleX: -1, yawMultiplier: -1 });
  });

  it('reverses the airborne pose when the user scrolls back upward between platforms', () => {
    const platforms = [
      { id: 'upper-rail', left: 20, top: 100, width: 220, height: 56 },
      { id: 'lower-rail', left: 520, top: 520, width: 220, height: 56 },
    ];
    const viewport = { width: 900, height: 640, catWidth: 120, catHeight: 140 };

    const downJump = getCatPlatformPose(180, viewport, platforms, 2.4, 1);
    const upJump = getCatPlatformPose(180, viewport, platforms, 2.4, -1);

    expect(downJump?.travelY).toBeGreaterThan(0);
    expect(downJump?.airDive).toBeGreaterThan(0);
    expect(upJump?.travelY).toBeLessThan(0);
    expect(upJump?.airDive).toBeLessThan(0);
    expect(Math.sign(upJump!.turnYaw)).not.toBe(Math.sign(downJump!.turnYaw));
    expect(upJump!.frontReach).toBeLessThan(downJump!.frontReach);
    expect(upJump!.backPush).toBeGreaterThan(downJump!.backPush);
  });

  it('turns a click into a grounded cheek-bunt petting pose instead of a rear-stand pop', () => {
    const pose = getCatPetPose(0.22, 1.4, { x: -0.75, y: -0.55, active: true });

    expect(pose.state).toBe('bunting');
    expect(pose.intensity).toBe(1);
    expect(pose.side).toBe('left');
    expect(pose.height).toBe('high');
    expect(pose.bodyShift).toBeLessThan(0);
    expect(pose.headYaw).toBeLessThan(-0.2);
    expect(Math.abs(pose.headRoll)).toBeGreaterThan(0.08);
    expect(pose.tailLift).toBeGreaterThan(0.45);
    expect(pose.tailFlick).toBeGreaterThan(0.15);
    expect(pose.frontBrace).toBeGreaterThan(0.2);
    expect(pose.backPlant).toBeGreaterThan(0.85);
    expect(pose.rearStand).toBe(0);
  });

  it('eases repeated petting influence back to idle without resetting into a pop', () => {
    const press = getCatPetPose(0.36, 0.72, { x: 0.62, y: 0.7, active: true });
    const release = getCatPetPose(0.92, 0.72, { x: 0.62, y: 0.7, active: true });
    const idle = getCatPetPose(1.4, 0.72, { x: 0.62, y: 0.7, active: true });

    expect(press.state).toBe('bunting');
    expect(press.side).toBe('right');
    expect(press.height).toBe('low');
    expect(press.bodyArch).toBeGreaterThan(press.headPitch);
    expect(press.frontKnead).toBeGreaterThan(0.05);
    expect(release.state).toBe('recovering');
    expect(release.intensity).toBeLessThan(press.intensity);
    expect(release.tailLift).toBeGreaterThan(0);
    expect(idle.state).toBe('idle');
    expect(idle.intensity).toBe(0);
    expect(idle.tailLift).toBe(0);
  });
});
