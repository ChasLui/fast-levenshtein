# ts-levenshtein - Levenshtein algorithm in TypeScript

[![CI](https://github.com/ChasLui/ts-levenshtein/actions/workflows/ci.yml/badge.svg)](https://github.com/ChasLui/ts-levenshtein/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ts-levenshtein.svg)](https://www.npmjs.com/package/ts-levenshtein)
[![npm downloads](https://img.shields.io/npm/dm/ts-levenshtein.svg)](https://www.npmjs.com/package/ts-levenshtein)
[![Follow on Twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow&maxAge=2592000)](https://twitter.com/chaslui1)

English | [简体中文](README.zh-CN.md) | [العربية](README.ar-SA.md)

A TypeScript implementation of the [Levenshtein algorithm](http://en.wikipedia.org/wiki/Levenshtein_distance) with locale-specific collator support. The core is an internal Myers bit‑parallel implementation (no external runtime dependency), with small‑string DP fast path and typed‑array buffer reuse.

## Features

- Works in node.js and in the browser.
- Locale-sensitive string comparisons if needed.
- Comprehensive test suite.

## Installation

```bash
npm install ts-levenshtein
```

**CDN**

You can load either the global IIFE build or ESM via esm.sh.

- IIFE (global `TSLevenshtein`):
  - jsDelivr: `https://cdn.jsdelivr.net/npm/ts-levenshtein/dist/index.global.js`
  - unpkg: `https://unpkg.com/ts-levenshtein/dist/index.global.js`
- ESM (esm.sh):
  - `https://esm.sh/ts-levenshtein`

## Examples

**Default usage (Node.js)**

```javascript
// CommonJS (npm)
const levenshtein = require("ts-levenshtein").default;
console.log(levenshtein.get("back", "book")); // 2
console.log(levenshtein.get("我愛你", "我叫你")); // 1

// or ESM
// import levenshtein from 'ts-levenshtein'
// console.log(levenshtein.get('back', 'book'))
```

**Browser via CDN (IIFE)**

```html
<script src="https://cdn.jsdelivr.net/npm/ts-levenshtein/dist/index.global.js"></script>
<script>
  // Global name: TSLevenshtein
  const d1 = TSLevenshtein.default.get('kitten', 'sitting');
  const d2 = TSLevenshtein.default.get('我愛你', '我叫你');
  console.log(d1, d2);
  // If you prefer unpkg:
  // <script src="https://unpkg.com/ts-levenshtein/dist/index.global.js"></script>
  // Note: CDN availability depends on publishing to npmjs.

  // Optional: ESM via CDN loaders may vary by toolchain.
</script>
```

**Browser via CDN (ESM with esm.sh)**

```html
<script type="module">
  import levenshtein from 'https://esm.sh/ts-levenshtein?bundle';
  console.log(levenshtein.get('kitten', 'sitting'));
  console.log(levenshtein.get('我愛你', '我叫你'));
  // Tip: `?bundle` helps ensure a single file for browsers
  // Deno: import levenshtein from 'https://esm.sh/ts-levenshtein'
</script>
```

**Locale-sensitive string comparisons**

It supports using [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) for locale-sensitive string comparisons:

```javascript
// CommonJS (npm)
const levenshtein = require("ts-levenshtein").default;
levenshtein.get("mikailovitch", "Mikhaïlovitch", { useCollator: true });
// 1

// or ESM
// import levenshtein from 'ts-levenshtein'
// levenshtein.get('mikailovitch', 'Mikhaïlovitch', { useCollator: true })
```

## Module formats and tooling

- **CJS**: `dist/index.cjs`
- **ESM**: `dist/index.mjs`
- **UMD**: `dist/index.umd.js`
- **IIFE (global)**: `dist/index.global.js` (global `TSLevenshtein`)
- **TypeScript types**: `dist/index.d.ts` (exposed via "types" field)
- **Source maps**: available for all builds

## Building and Testing

To build the code and run the tests:

```bash
npm install
npm run build
npm test
```

## Performance

Internals:

- Myers bit‑parallel algorithm for the non‑collator path (≤32 uses 32‑bit variant, longer strings use blocked variant)
- Small‑string (≤20) classic DP fast path
- Common prefix/suffix trimming
- Typed arrays (`Uint16Array`/`Int32Array`) and fixed‑capacity buffer reuse to minimize allocations

Run the included benchmark:

```bash
npm run benchmark
```

Results vary by machine/Node version; expect competitive performance while keeping correctness and zero external deps.

### Benchmark

Sample run (lower is faster):

Environment: Apple M4 MacBook, Node.js 22

| Rank | Implementation            | Time (ms) | Relative to fastest | Status |
|------|---------------------------|-----------:|---------------------:|--------|
| 1    | ts-levenshtein            | 0.71       | 0.00%               | ok     |
| 2    | levenshtein-edit-distance | 1.82       | 156.34%             | ok     |
| 3    | levenshtein               | 2.57       | 261.97%             | ok     |
| 4    | levenshtein-component     | 3.18       | 347.89%             | ok     |
| 5    | levenshtein-deltas        | 4.04       | 469.01%             | ok     |
| 6    | natural                   | 14.41      | 1929.58%            | ok     |

## Contributing

If you wish to submit a pull request, please update and/or create new tests for any changes you make and ensure the build and tests pass locally (`npm run build`, `npm test`).

See [CONTRIBUTING.md](https://github.com/chaslui/ts-levenshtein/blob/master/CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE.md](https://github.com/chaslui/ts-levenshtein/blob/master/LICENSE.md)
