# Contribute to fast-levenshtein

This guide guidelines for those wishing to contribute to fast-levenshtein.

## Contributor license agreement

By submitting code as an individual or as an entity you agree that your code is [licensed the same as fast-levenshtein](https://github.com/chaslui/fast-levenshtein/blob/master/LICENSE.md).

## Issues and pull requests

Issues and merge requests should be in English and contain appropriate language for audiences of all ages.

We will only accept a merge requests which meets the following criteria:

* Includes proper tests and all tests pass (unless it contains a test exposing a bug in existing code)
* Can be merged without problems (if not please use: `git rebase master`)
* Does not break any existing functionality
* Fixes one specific issue or implements one specific feature (do not combine things, send separate merge requests if needed)
* Keeps the code base clean and well structured
* Contains functionality we think other users will benefit from too
* Doesn't add unnessecary configuration options since they complicate future changes

## Build, test and benchmark

Please verify locally before opening a PR:

```bash
npm install
npm run build
npm test
npm run benchmark
```

For performance‑sensitive changes, include before/after benchmark numbers and a short rationale of the approach (e.g., buffer reuse, algorithmic tweak).

