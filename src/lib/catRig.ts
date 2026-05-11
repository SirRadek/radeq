import type { Object3D } from 'three';

export type CatRigQuality = 'contract' | 'legacy' | 'partial';

export interface CatRigParts {
  version: 'custom-contract-v1' | 'legacy-quaternius-v1' | 'partial-v1';
  quality: CatRigQuality;
  body: Object3D | null;
  head: Object3D | null;
  tail: Object3D | null;
  tailSegments: Object3D[];
  ears: {
    left: Object3D | null;
    right: Object3D | null;
  };
  legs: {
    frontLeft: Object3D | null;
    frontRight: Object3D | null;
    backLeft: Object3D | null;
    backRight: Object3D | null;
  };
  missing: string[];
}

export function resolveCatRig(root: Object3D): CatRigParts {
  const contract = {
    body: findFirst(root, ['Spine_02', 'Spine_03', 'Center_Of_Mass']),
    head: findFirst(root, ['Head']),
    tailSegments: ['Tail_01', 'Tail_02', 'Tail_03', 'Tail_04', 'Tail_05']
      .map((name) => root.getObjectByName(name))
      .filter((part): part is Object3D => Boolean(part)),
    ears: {
      left: findFirst(root, ['Ear_L']),
      right: findFirst(root, ['Ear_R']),
    },
    legs: {
      frontLeft: findFirst(root, ['FrontLeg_L_Upper', 'FrontPaw_L']),
      frontRight: findFirst(root, ['FrontLeg_R_Upper', 'FrontPaw_R']),
      backLeft: findFirst(root, ['BackLeg_L_Upper', 'BackPaw_L']),
      backRight: findFirst(root, ['BackLeg_R_Upper', 'BackPaw_R']),
    },
  };

  const legacy = {
    body: findFirst(root, ['Body']),
    head: findFirst(root, ['Head']),
    tailSegments: [findFirst(root, ['Tail'])].filter((part): part is Object3D => Boolean(part)),
    ears: {
      left: null,
      right: null,
    },
    legs: {
      frontLeft: findFirst(root, ['FrontLeg.L']),
      frontRight: findFirst(root, ['FrontLeg.R']),
      backLeft: findFirst(root, ['BackLeg.L']),
      backRight: findFirst(root, ['BackLeg.R']),
    },
  };

  const useContract = Boolean(contract.body && contract.head && contract.tailSegments.length >= 2);
  const parts = useContract ? contract : legacy;
  const missing = collectMissing(parts);

  return {
    version: useContract ? 'custom-contract-v1' : missing.length < 4 ? 'legacy-quaternius-v1' : 'partial-v1',
    quality: useContract ? 'contract' : missing.length < 4 ? 'legacy' : 'partial',
    body: parts.body,
    head: parts.head,
    tail: parts.tailSegments[0] ?? null,
    tailSegments: parts.tailSegments,
    ears: parts.ears,
    legs: parts.legs,
    missing,
  };
}

function findFirst(root: Object3D, names: string[]): Object3D | null {
  for (const name of names) {
    const part = root.getObjectByName(name);
    if (part) return part;
  }

  return null;
}

function collectMissing(parts: {
  body: Object3D | null;
  head: Object3D | null;
  tailSegments: Object3D[];
  legs: CatRigParts['legs'];
}) {
  const missing: string[] = [];
  if (!parts.body) missing.push('Body');
  if (!parts.head) missing.push('Head');
  if (parts.tailSegments.length === 0) missing.push('Tail');
  if (!parts.legs.frontLeft) missing.push('FrontLeft');
  if (!parts.legs.frontRight) missing.push('FrontRight');
  if (!parts.legs.backLeft) missing.push('BackLeft');
  if (!parts.legs.backRight) missing.push('BackRight');
  return missing;
}
