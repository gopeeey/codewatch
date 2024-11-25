import {
  gt as sGt,
  gte as sGte,
  intersects as sIntersects,
  lt as sLt,
  lte as sLte,
  satisfies,
  valid,
} from "semver";

export function intersects(ranges: string[]): boolean {
  let val = true;

  for (let i = 0; i < ranges.length - 1; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (!sIntersects(ranges[i], ranges[j])) {
        val = false;
        break;
      }
    }
    if (!val) break;
  }

  return val;
}

export function extractSign(version: string): string {
  if (version.startsWith("^") || version.startsWith("~")) {
    return version.slice(0, 1);
  }
  return "";
}

function removeSign(version: string): string {
  if (version.startsWith("^") || version.startsWith("~")) {
    return version.substring(1);
  }
  return version;
}

export function maxVersion(version: string): string {
  const versions = version.split(".");
  let sign = extractSign(version);
  versions[0] = removeSign(versions[0]);

  switch (sign) {
    case "^":
      versions[1] = "9999";
      versions[2] = "9999";
      break;
    case "~":
      versions[2] = "9999";
      break;
    default:
      break;
  }

  return versions.join(".");
}

export function gt(v1: string, v2: string): boolean {
  v1 = removeSign(v1);
  v2 = removeSign(v2);
  return sGt(v1, v2);
}

export function lt(v1: string, v2: string): boolean {
  v1 = removeSign(v1);
  v2 = removeSign(v2);
  return sLt(v1, v2);
}

export function lte(v1: string, v2: string): boolean {
  v1 = removeSign(v1);
  v2 = removeSign(v2);
  return sLte(v1, v2);
}

export function gte(v1: string, v2: string): boolean {
  v1 = removeSign(v1);
  v2 = removeSign(v2);
  return sGte(v1, v2);
}

export function contains(range: string, version: string): boolean {
  return satisfies(version, range);
}

export function validSemver(version: string): boolean {
  version = removeSign(version);
  return Boolean(valid(version));
}
