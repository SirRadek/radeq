import { mkdir, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

globalThis.FileReader = class {
  result = null;
  onloadend = null;

  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.({ target: this });
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      const base64 = Buffer.from(buffer).toString('base64');
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${base64}`;
      this.onloadend?.({ target: this });
    });
  }
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '../public/models/cat/radeq-ginger-ghost.glb');

const ginger = new THREE.MeshStandardMaterial({ color: 0xc86720, roughness: 0.72, metalness: 0.02 });
const gingerLight = new THREE.MeshStandardMaterial({ color: 0xe89842, roughness: 0.76, metalness: 0.01 });
const gingerDark = new THREE.MeshStandardMaterial({ color: 0x7f3d14, roughness: 0.82, metalness: 0.01 });
const cream = new THREE.MeshStandardMaterial({ color: 0xf0b56d, roughness: 0.78, metalness: 0.01 });
const eye = new THREE.MeshStandardMaterial({ color: 0x16100d, roughness: 0.28, metalness: 0.08 });
const nose = new THREE.MeshStandardMaterial({ color: 0x8a3323, roughness: 0.58, metalness: 0.01 });
const whisker = new THREE.MeshStandardMaterial({ color: 0xf7dcc4, roughness: 0.48, metalness: 0.02 });
const catchLight = new THREE.MeshStandardMaterial({ color: 0xfff6df, roughness: 0.18, metalness: 0.02 });

const scene = new THREE.Scene();
scene.name = 'RadeqGingerGhostScene';

const catRoot = group('CatRoot');
const center = group('Center_Of_Mass', [0, 0, 0]);
const hips = group('Hips', [-0.24, -0.04, 0]);
const spine01 = group('Spine_01', [0.16, 0.04, 0]);
const spine02 = group('Spine_02', [0.22, 0.05, 0]);
const spine03 = group('Spine_03', [0.24, 0.04, 0]);
const neck = group('Neck', [0.22, 0.08, 0]);
const head = group('Head', [0.22, 0.03, 0]);

scene.add(catRoot);
catRoot.add(center);
center.add(hips);
hips.add(spine01);
spine01.add(spine02);
spine02.add(spine03);
spine03.add(neck);
neck.add(head);

spine02.add(capsule('BodyVolume', [0.02, 0.01, 0], 0.23, 0.64, ginger, [0, 0, Math.PI / 2], [1.05, 0.98, 1.08]));
spine02.add(ellipsoid('BellyPatch', [0.05, -0.16, 0.05], [0.44, 0.095, 0.19], cream));
spine03.add(ellipsoid('ChestVolume', [0.05, 0.02, 0], [0.38, 0.31, 0.27], gingerLight));
hips.add(ellipsoid('HipVolume', [-0.02, -0.02, 0], [0.43, 0.29, 0.26], ginger));
head.add(ellipsoid('HeadVolume', [0, 0, 0], [0.32, 0.25, 0.24], gingerLight));
head.add(ellipsoid('Cheek_L', [0.13, -0.035, 0.13], [0.12, 0.085, 0.075], cream));
head.add(ellipsoid('Cheek_R', [0.13, -0.035, -0.13], [0.12, 0.085, 0.075], cream));
head.add(ellipsoid('Muzzle', [0.22, -0.045, 0], [0.135, 0.085, 0.12], cream));
head.add(ellipsoid('Nose', [0.335, -0.025, 0], [0.036, 0.026, 0.045], nose));
head.add(ellipsoid('MouthMark', [0.27, -0.09, 0], [0.035, 0.012, 0.04], nose));
head.add(ellipsoid('Eye_L', [0.18, 0.09, 0.13], [0.056, 0.066, 0.036], eye));
head.add(ellipsoid('Eye_R', [0.18, 0.09, -0.13], [0.056, 0.066, 0.036], eye));
head.add(ellipsoid('EyeCatch_L', [0.197, 0.112, 0.156], [0.014, 0.016, 0.01], catchLight));
head.add(ellipsoid('EyeCatch_R', [0.197, 0.112, -0.156], [0.014, 0.016, 0.01], catchLight));
head.add(ear('Ear_L', [-0.03, 0.245, 0.15], 0.22));
head.add(ear('Ear_R', [-0.03, 0.245, -0.15], -0.22));
addWhiskers(head, 'L', 1);
addWhiskers(head, 'R', -1);

addStripe(head, 'FaceStripe_01', [0.04, 0.17, 0], [0.022, 0.09, 0.2]);
addStripe(head, 'FaceStripe_02', [-0.07, 0.16, 0.04], [0.018, 0.075, 0.12]);
addStripe(spine02, 'BodyStripe_01', [-0.18, 0.205, 0.03], [0.022, 0.12, 0.24]);
addStripe(spine02, 'BodyStripe_02', [0.02, 0.215, 0.03], [0.022, 0.13, 0.25]);
addStripe(spine02, 'BodyStripe_03', [0.2, 0.19, 0.03], [0.02, 0.11, 0.21]);
addStripe(spine03, 'ShoulderStripe_01', [0.1, 0.18, 0.03], [0.02, 0.1, 0.2]);

const tailBase = group('Tail_01', [-0.44, 0.11, 0], [0, 0, 0.36]);
hips.add(tailBase);
let tailParent = tailBase;
for (let index = 1; index <= 5; index += 1) {
  const segment = index === 1 ? tailBase : group(`Tail_0${index}`, [-0.16, 0.045, 0], [0, 0, 0.08]);
  const radius = 0.06 - index * 0.004;
  segment.add(capsule(`Tail_0${index}_Volume`, [0, 0, 0], radius, 0.19, ginger, [0, 0, Math.PI / 2]));
  segment.add(capsule(`TailStripe_0${index}`, [-0.02, 0.005, 0], radius * 1.04, 0.032, gingerDark, [0, 0, Math.PI / 2]));
  if (index > 1) {
    tailParent.add(segment);
    tailParent = segment;
  }
}

addLeg(spine03, 'FrontLeg_L', [0.12, -0.22, 0.14], 1, 0.02);
addLeg(spine03, 'FrontLeg_R', [0.12, -0.22, -0.14], -1, 0.02);
addLeg(hips, 'BackLeg_L', [-0.08, -0.215, 0.14], 1, -0.03);
addLeg(hips, 'BackLeg_R', [-0.08, -0.215, -0.14], -1, -0.03);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, { binary: true });
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, Buffer.from(glb));
console.log(`Generated public/models/cat/radeq-ginger-ghost.glb (${Buffer.byteLength(Buffer.from(glb))} bytes)`);

function group(name, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Group();
  object.name = name;
  object.position.set(...position);
  object.rotation.set(...rotation);
  return object;
}

function ellipsoid(name, position, scale, material) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  return mesh;
}

function capsule(name, position, radius, length, material, rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, 14), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  return mesh;
}

function ear(name, position, zLean) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.27, 4), gingerDark);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(0.22, zLean, Math.PI / 4);
  mesh.scale.set(0.92, 1, 0.76);
  return mesh;
}

function addStripe(parent, name, position, scale) {
  const stripe = ellipsoid(name, position, scale, gingerDark);
  stripe.rotation.z = Math.PI / 2;
  parent.add(stripe);
}

function addWhiskers(parent, sideName, side) {
  for (let index = 1; index <= 3; index += 1) {
    const y = -0.02 - (index - 2) * 0.035;
    const z = side * (0.155 + index * 0.006);
    const whiskerLine = capsule(`Whisker_${sideName}_0${index}`, [0.31, y, z], 0.0045, 0.3, whisker, [
      0,
      side * (0.08 + index * 0.015),
      Math.PI / 2 + (index - 2) * 0.08,
    ]);
    parent.add(whiskerLine);
  }
}

function addLeg(parent, prefix, position, side, forwardBias) {
  const pawName = prefix.replace('Leg', 'Paw');
  const upper = group(`${prefix}_Upper`, position, [0.08, 0, side * 0.04]);
  const lower = group(`${prefix}_Lower`, [forwardBias, -0.18, 0], [0.1, 0, side * 0.015]);
  const paw = group(pawName, [0.065, -0.16, 0.015 * side], [0, 0, side * 0.06]);
  upper.add(capsule(`${prefix}_UpperVolume`, [0, -0.075, 0], 0.06, 0.17, ginger, [0, 0, 0]));
  lower.add(capsule(`${prefix}_LowerVolume`, [0, -0.075, 0], 0.05, 0.155, gingerLight, [0, 0, 0]));
  paw.add(ellipsoid(`${pawName}Volume`, [0.055, -0.018, 0], [0.12, 0.048, 0.07], cream));
  paw.add(ellipsoid(`${pawName}_Toes`, [0.145, -0.025, 0], [0.04, 0.018, 0.076], nose));
  lower.add(paw);
  upper.add(lower);
  parent.add(upper);
}
