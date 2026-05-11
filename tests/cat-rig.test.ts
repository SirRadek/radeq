import { Object3D } from 'three';
import { describe, expect, it } from 'vitest';

import { resolveCatRig } from '../src/lib/catRig';

function node(name: string, children: Object3D[] = []) {
  const object = new Object3D();
  object.name = name;
  for (const child of children) object.add(child);
  return object;
}

describe('cat rig resolver', () => {
  it('resolves the custom rig contract', () => {
    const root = node('CatRoot', [
      node('Center_Of_Mass', [
        node('Hips'),
        node('Spine_02'),
        node('Head'),
        node('Ear_L'),
        node('Ear_R'),
        node('Tail_01'),
        node('Tail_02'),
        node('Tail_03'),
        node('FrontLeg_L_Upper'),
        node('FrontLeg_R_Upper'),
        node('BackLeg_L_Upper'),
        node('BackLeg_R_Upper'),
      ]),
    ]);

    const rig = resolveCatRig(root);

    expect(rig.version).toBe('custom-contract-v1');
    expect(rig.quality).toBe('contract');
    expect(rig.head?.name).toBe('Head');
    expect(rig.body?.name).toBe('Spine_02');
    expect(rig.tailSegments.map((part) => part.name)).toEqual(['Tail_01', 'Tail_02', 'Tail_03']);
    expect(rig.ears.left?.name).toBe('Ear_L');
    expect(rig.legs.frontLeft?.name).toBe('FrontLeg_L_Upper');
    expect(rig.missing).not.toContain('Head');
  });

  it('keeps the legacy Quaternius model working', () => {
    const root = node('Scene', [
      node('Body'),
      node('Head'),
      node('Tail'),
      node('FrontLeg.L'),
      node('FrontLeg.R'),
      node('BackLeg.L'),
      node('BackLeg.R'),
    ]);

    const rig = resolveCatRig(root);

    expect(rig.version).toBe('legacy-quaternius-v1');
    expect(rig.quality).toBe('legacy');
    expect(rig.body?.name).toBe('Body');
    expect(rig.tailSegments.map((part) => part.name)).toEqual(['Tail']);
    expect(rig.legs.frontRight?.name).toBe('FrontLeg.R');
  });
});
