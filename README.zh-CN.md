# ts-levenshtein - 用 TypeScript 实现的 Levenshtein 距离

[![CI](https://github.com/ChasLui/ts-levenshtein/actions/workflows/ci.yml/badge.svg)](https://github.com/ChasLui/ts-levenshtein/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ts-levenshtein.svg)](https://www.npmjs.com/package/ts-levenshtein)
[![npm downloads](https://img.shields.io/npm/dm/ts-levenshtein.svg)](https://www.npmjs.com/package/ts-levenshtein)
[![Follow on Twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow&maxAge=2592000)](https://twitter.com/chaslui1)

[English](README.md) | **简体中文** | [العربية](README.ar-SA.md)

一个支持区域化比较（Intl.Collator）的 [Levenshtein 距离](http://en.wikipedia.org/wiki/Levenshtein_distance) TypeScript 实现。核心为内部的 Myers 位并行算法（无外部运行时依赖），并包含小字符串 DP 快路径与复用的 TypedArray 缓冲区。

## 特性

- 同时支持 Node.js 与浏览器运行环境
- 可选的本地化字符串比较（Intl.Collator）
- 完整的测试用例

## 安装

```bash
npm install ts-levenshtein
```

**CDN**

可以按需选择全局 IIFE 构建或通过 esm.sh 引入 ESM：

- IIFE（全局 `TSLevenshtein`）
  - jsDelivr: `https://cdn.jsdelivr.net/npm/ts-levenshtein/dist/index.global.js`
  - unpkg: `https://unpkg.com/ts-levenshtein/dist/index.global.js`
- ESM（esm.sh）
  - `https://esm.sh/ts-levenshtein`

## 示例

**Node.js（默认用法）**

```javascript
// CommonJS（npm）
const levenshtein = require("ts-levenshtein").default;
console.log(levenshtein.get("back", "book")); // 2
console.log(levenshtein.get("我愛你", "我叫你")); // 1

// 或 ESM
// import levenshtein from 'ts-levenshtein'
// console.log(levenshtein.get('back', 'book'))
```

**浏览器（CDN IIFE）**

```html
<script src="https://cdn.jsdelivr.net/npm/ts-levenshtein/dist/index.global.js"></script>
<script>
  // 全局名：TSLevenshtein
  const d1 = TSLevenshtein.default.get('kitten', 'sitting');
  const d2 = TSLevenshtein.default.get('我愛你', '我叫你');
  console.log(d1, d2);
  // 或使用 unpkg：
  // <script src="https://unpkg.com/ts-levenshtein/dist/index.global.js"></script>
</script>
```

**浏览器（ESM + esm.sh）**

```html
<script type="module">
  import levenshtein from "https://esm.sh/ts-levenshtein?bundle";
  console.log(levenshtein.get("kitten", "sitting"));
  console.log(levenshtein.get("我愛你", "我叫你"));
</script>
```

**本地化字符串比较**

支持使用 [Intl.Collator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Collator) 进行本地化字符串比较：

```javascript
// CommonJS（npm）
const levenshtein = require("ts-levenshtein").default;
levenshtein.get("mikailovitch", "Mikhaïlovitch", { useCollator: true });
// 1

// 或 ESM
// import levenshtein from 'ts-levenshtein'
// levenshtein.get('mikailovitch', 'Mikhaïlovitch', { useCollator: true })
```

## 模块格式与工具链

- **CJS**: `dist/index.cjs`
- **ESM**: `dist/index.mjs`
- **UMD**: `dist/index.umd.js`
- **IIFE（全局）**: `dist/index.global.js`（全局 `TSLevenshtein`）
- **TypeScript 类型**: `dist/index.d.ts`
- **Source map**: 所有构建均提供

## 构建与测试

```bash
npm install
npm run build
npm test
```

## 性能

内部实现要点：

- 非 collator 路径采用 Myers 位并行算法（短串 ≤32 使用 32 位变体；更长字符串使用分块变体）
- 小字符串（≤20）使用经典 DP 快路径
- 公共前后缀裁剪
- 使用 `Uint16Array`/`Int32Array` 并复用固定容量缓冲区，减少分配

可运行自带基准测试：

```bash
npm run benchmark
```

> 结果随机器与 Node 版本而变动；本库追求在正确性与零外部依赖前提下的竞争性能。

### 基准样例（数值仅示例）

| 排名 | 实现                      | 时间 (ms) | 相对最快 | 备注 |
| ---- | ------------------------- | --------: | -------: | ---- |
| 1    | ts-levenshtein            |      0.71 |    0.00% | ok   |
| 2    | levenshtein-edit-distance |      1.82 |  156.34% | ok   |
| 3    | levenshtein               |      2.57 |  261.97% | ok   |
| 4    | levenshtein-component     |      3.18 |  347.89% | ok   |
| 5    | levenshtein-deltas        |      4.04 |  469.01% | ok   |
| 6    | natural                   |     14.41 | 1929.58% | ok   |

## 贡献

欢迎提交 Pull Request。请为你的改动补充/更新测试，并确保本地通过构建与测试（`npm run build`，`npm test`）。

详见 [CONTRIBUTING.md](https://github.com/chaslui/ts-levenshtein/blob/master/CONTRIBUTING.md)。

## 许可证

MIT - 见 [LICENSE.md](https://github.com/chaslui/ts-levenshtein/blob/master/LICENSE.md)
