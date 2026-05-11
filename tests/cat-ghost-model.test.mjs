import { readFile } from 'node:fs/promises';
import { stat } from 'node:fs/promises';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';

async function loadGhostCat() {
  const data = await readFile('public/models/cat/radeq-ginger-ghost.glb');
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, '', resolve, reject);
  });
}

function worldPosition(root, name) {
  const object = root.getObjectByName(name);
  expect(object, `${name} should exist in the generated cat rig`).toBeTruthy();
  const position = new Vector3();
  object.getWorldPosition(position);
  return position;
}

describe('generated ghost cat model', () => {
  it('stays inside the static overlay asset budget', async () => {
    const model = await stat('public/models/cat/radeq-ginger-ghost.glb');

    expect(model.size).toBeLessThanOrEqual(1_200_000);
  });

  it('keeps the head connected to the chest instead of drifting a full head ahead', async () => {
    const gltf = await loadGhostCat();

    const head = worldPosition(gltf.scene, 'Head');
    const chest = worldPosition(gltf.scene, 'Spine_03');
    const muzzle = worldPosition(gltf.scene, 'Muzzle');

    expect(head.x).toBeGreaterThan(chest.x);
    expect(head.x - chest.x).toBeLessThan(0.62);
    expect(head.y - chest.y).toBeLessThan(0.28);
    expect(muzzle.x).toBeGreaterThan(head.x);
    expect(muzzle.x - head.x).toBeLessThan(0.28);
  });

  it('includes small-scale cat landmarks beyond the base body volumes', async () => {
    const gltf = await loadGhostCat();
    const requiredLandmarks = [
      'Nose',
      'Cheek_L',
      'Whisker_L_01',
      'Whisker_R_01',
      'BellyPatch',
      'TailStripe_03',
      'FrontPaw_L_Toes',
      'EyeCatch_L',
    ];

    for (const name of requiredLandmarks) {
      expect(gltf.scene.getObjectByName(name), `${name} should exist`).toBeTruthy();
    }
  });
});
