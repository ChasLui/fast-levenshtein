/*
 * TypeScript implementation wrapper for Levenshtein distance with optional Intl.Collator
 * Replaces fastest-levenshtein with an internal Myers bit-parallel implementation for the
 * non-collator path.
 */

export interface LevenshteinOptions {
  useCollator?: boolean;
}

export interface LevenshteinAPI {
  get(str1: string, str2: string, options?: LevenshteinOptions): number;
}

let collator: Intl.Collator | null = null;
try {
  // Guarded access in case Intl is not available in the environment
  if (
    typeof Intl !== "undefined" &&
    typeof (Intl as any).Collator !== "undefined"
  ) {
    collator = new Intl.Collator("generic", { sensitivity: "base" });
  }
} catch (_err) {
  // Collator initialization can fail in some environments; fallback to non-collator path
}

// Reusable buffers
const previousRow: number[] = [];
const stringTwoCharCodes: number[] = [];

// Myers bit-parallel implementation (fast non-collator path)
const peq = new Uint32Array(0x10000);
let phcCache: Int32Array<ArrayBufferLike> = new Int32Array(0);
let mhcCache: Int32Array<ArrayBufferLike> = new Int32Array(0);
let codeACache: Uint16Array<ArrayBufferLike> = new Uint16Array(0);
let codeBCache: Uint16Array<ArrayBufferLike> = new Uint16Array(0);
let dpRowCacheA: Uint16Array<ArrayBufferLike> = new Uint16Array(0);
let dpRowCacheB: Uint16Array<ArrayBufferLike> = new Uint16Array(0);

// Fixed-length buffer helpers to reduce reallocations (power-of-two growth)
const nextPowerOfTwo = (n: number): number => {
  let v = n - 1;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v + 1;
};

const ensureI32Capacity = (
  buf: Int32Array<ArrayBufferLike>,
  needed: number
): Int32Array<ArrayBufferLike> => {
  if (buf.length >= needed) return buf;
  return new Int32Array(nextPowerOfTwo(needed));
};

const ensureU16Capacity = (
  buf: Uint16Array<ArrayBufferLike>,
  needed: number
): Uint16Array<ArrayBufferLike> => {
  if (buf.length >= needed) return buf;
  return new Uint16Array(nextPowerOfTwo(needed));
};

const prepareCharCodes = (
  a: string,
  b: string
): {
  aCodes: Uint16Array<ArrayBufferLike>;
  bCodes: Uint16Array<ArrayBufferLike>;
} => {
  codeACache = ensureU16Capacity(codeACache, a.length);
  codeBCache = ensureU16Capacity(codeBCache, b.length);
  for (let i = 0; i < a.length; i++) codeACache[i] = a.charCodeAt(i);
  for (let i = 0; i < b.length; i++) codeBCache[i] = b.charCodeAt(i);
  return { aCodes: codeACache, bCodes: codeBCache };
};

// Small-string DP fast path (very small inputs can be faster than setting up bitmasks)
const dpDistanceSmall = (a: string, b: string): number => {
  const n = a.length;
  const m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;
  dpRowCacheA = ensureU16Capacity(dpRowCacheA, m + 1);
  dpRowCacheB = ensureU16Capacity(dpRowCacheB, m + 1);
  let prev = dpRowCacheA;
  let curr = dpRowCacheB;
  for (let j = 0; j <= m; j++) prev[j] = j;
  for (let i = 1; i <= n; i++) {
    curr[0] = i;
    const ai = a.charCodeAt(i - 1);
    for (let j = 1; j <= m; j++) {
      const cost = ai === b.charCodeAt(j - 1) ? 0 : 1;
      // substitution, insertion, deletion
      let best = prev[j - 1] + cost;
      const ins = curr[j - 1] + 1;
      if (ins < best) best = ins;
      const del = prev[j] + 1;
      if (del < best) best = del;
      curr[j] = best;
    }
    // swap row buffers (O(1))
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return prev[m];
};

const myers32 = (a: string, b: string): number => {
  const n = a.length;
  const m = b.length;
  const last = 1 << (n - 1);
  let pv = -1;
  let mv = 0;
  let score = n;
  let i = n;
  const { aCodes, bCodes } = prepareCharCodes(a, b);
  while (i--) peq[aCodes[i]] |= 1 << i;
  for (i = 0; i < m; i++) {
    let eq = peq[bCodes[i]];
    const xv = eq | mv;
    eq |= ((eq & pv) + pv) ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;
    if (mv & last) score++;
    if (pv & last) score--;
    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }
  i = n;
  while (i--) peq[aCodes[i]] = 0;
  return score;
};

const myersX = (b: string, a: string): number => {
  const n = a.length;
  const m = b.length;
  const hsize = (n + 31) >>> 5;
  const vsize = (m + 31) >>> 5;
  phcCache = ensureI32Capacity(phcCache, hsize);
  mhcCache = ensureI32Capacity(mhcCache, hsize);
  const phc = phcCache;
  const mhc = mhcCache;
  phc.fill(-1, 0, hsize);
  mhc.fill(0, 0, hsize);
  let j = 0;
  const { aCodes, bCodes } = prepareCharCodes(a, b);
  for (; j < vsize - 1; j++) {
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const vlen = Math.min(start + 32, m);
    for (let k = start; k < vlen; k++) {
      peq[bCodes[k]] |= 1 << (k & 31);
    }
    for (let i = 0; i < n; i++) {
      const eq = peq[aCodes[i]];
      const block = i >>> 5;
      const shift = i & 31;
      const pb = (phc[block] >>> shift) & 1;
      const mb = (mhc[block] >>> shift) & 1;
      const xv = eq | mv;
      const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;
      if (((ph >>> 31) ^ pb) & 1) phc[block] ^= 1 << shift;
      if (((mh >>> 31) ^ mb) & 1) mhc[block] ^= 1 << shift;
      ph = (ph << 1) | pb;
      mh = (mh << 1) | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }
    for (let k = start; k < vlen; k++) peq[bCodes[k]] = 0;
  }
  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const vlen = Math.min(start + 32, m);
  for (let k = start; k < vlen; k++) {
    peq[bCodes[k]] |= 1 << (k & 31);
  }
  let score = m;
  for (let i = 0; i < n; i++) {
    const eq = peq[aCodes[i]];
    const block = i >>> 5;
    const shift = i & 31;
    const pb = (phc[block] >>> shift) & 1;
    const mb = (mhc[block] >>> shift) & 1;
    const xv = eq | mv;
    const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;
    score += (ph >>> (m - 1)) & 1;
    score -= (mh >>> (m - 1)) & 1;
    if (((ph >>> 31) ^ pb) & 1) phc[block] ^= 1 << shift;
    if (((mh >>> 31) ^ mb) & 1) mhc[block] ^= 1 << shift;
    ph = (ph << 1) | pb;
    mh = (mh << 1) | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }
  for (let k = start; k < vlen; k++) {
    peq[bCodes[k]] = 0;
  }
  return score;
};

const fastDistance = (a: string, b: string): number => {
  if (a === b) return 0;
  // Ensure a is the longer string
  if (a.length < b.length) {
    const tmp = b;
    b = a;
    a = tmp;
  }
  if (b.length === 0) return a.length;
  // Trim common prefix
  let start = 0;
  const minLen = b.length;
  while (start < minLen && a.charCodeAt(start) === b.charCodeAt(start)) {
    start++;
  }
  if (start > 0) {
    a = a.slice(start);
    b = b.slice(start);
  }
  if (a.length === 0) return b.length; // both were equal, but handled above
  if (b.length === 0) return a.length;
  // Trim common suffix
  let aEnd = a.length - 1;
  let bEnd = b.length - 1;
  while (bEnd >= 0 && a.charCodeAt(aEnd) === b.charCodeAt(bEnd)) {
    aEnd--;
    bEnd--;
  }
  if (bEnd < 0) return aEnd + 1;
  if (aEnd < a.length - 1) {
    a = a.slice(0, aEnd + 1);
    b = b.slice(0, bEnd + 1);
  }
  // Re-ensure a is the longer string after trimming
  if (a.length < b.length) {
    const tmp = b;
    b = a;
    a = tmp;
  }
  // Very small inputs: classic DP can be faster than bit-parallel setup
  if (a.length <= 20) return dpDistanceSmall(a, b);
  if (a.length <= 32) return myers32(a, b);
  return myersX(a, b);
};

const Levenshtein: LevenshteinAPI = {
  get(str1: string, str2: string, options?: LevenshteinOptions): number {
    // Fast path: no options, or collator unavailable/disabled
    if (!options || !options.useCollator || !collator) {
      return fastDistance(str1, str2);
    }

    // Collator-enabled DP path
    {
      const str1Length = str1.length;
      const str2Length = str2.length;

      if (str1Length === 0) return str2Length;
      if (str2Length === 0) return str1Length;

      let currentColumn: number;
      let nextColumn: number = 0;
      let i: number;
      let j: number;
      let temp: number;

      for (i = 0; i < str2Length; ++i) {
        previousRow[i] = i;
        stringTwoCharCodes[i] = str2.charCodeAt(i);
      }
      previousRow[str2Length] = str2Length;

      for (i = 0; i < str1Length; ++i) {
        nextColumn = i + 1;

        for (j = 0; j < str2Length; ++j) {
          currentColumn = nextColumn;

          const areEqual =
            collator.compare(
              str1.charAt(i),
              String.fromCharCode(stringTwoCharCodes[j])
            ) === 0;

          nextColumn = previousRow[j] + (areEqual ? 0 : 1); // substitution

          temp = currentColumn + 1; // insertion
          if (nextColumn > temp) {
            nextColumn = temp;
          }

          temp = previousRow[j + 1] + 1; // deletion
          if (nextColumn > temp) {
            nextColumn = temp;
          }

          previousRow[j] = currentColumn;
        }

        previousRow[j] = nextColumn;
      }
      return nextColumn;
    }
  },
};

export default Levenshtein;
