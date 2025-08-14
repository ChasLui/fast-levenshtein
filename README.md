# fast-levenshtein - Levenshtein algorithm in Javascript

[![CI](https://github.com/ChasLui/fast-levenshtein/actions/workflows/ci.yml/badge.svg)](https://github.com/ChasLui/fast-levenshtein/actions/workflows/ci.yml)
[![NPM module](https://badge.fury.io/js/fast-levenshtein.png)](https://badge.fury.io/js/fast-levenshtein)
[![NPM downloads](https://img.shields.io/npm/dm/fast-levenshtein.svg?maxAge=2592000)](https://www.npmjs.com/package/fast-levenshtein)
[![Follow on Twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow&maxAge=2592000)](https://twitter.com/hiddentao)

A Javascript implementation of the [Levenshtein algorithm](http://en.wikipedia.org/wiki/Levenshtein_distance) with locale-specific collator support. The core is an internal Myers bit‑parallel implementation (no external runtime dependency), with small‑string DP fast path and typed‑array buffer reuse.

## Features

* Works in node.js and in the browser.
* Locale-sensitive string comparisons if needed.
* Comprehensive test suite.

## Installation

```bash
npm install fast-levenshtein
```
**CDN**

The latest version is now also always available at https://npm-cdn.com/pkg/fast-levenshtein/ 

## Examples

**Default usage**

```javascript
const levenshtein = require('fast-levenshtein');

const distance = levenshtein.get('back', 'book');   // 2
const distance = levenshtein.get('我愛你', '我叫你');   // 1
```

**Locale-sensitive string comparisons**

It supports using [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) for locale-sensitive  string comparisons:

```javascript
const levenshtein = require('fast-levenshtein');

levenshtein.get('mikailovitch', 'Mikhaïlovitch', { useCollator: true});
// 1
```

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

## Contributing

If you wish to submit a pull request please update and/or create new tests for any changes you make and ensure the grunt build passes.

See [CONTRIBUTING.md](https://github.com/chaslui/fast-levenshtein/blob/master/CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE.md](https://github.com/chaslui/fast-levenshtein/blob/master/LICENSE.md)
