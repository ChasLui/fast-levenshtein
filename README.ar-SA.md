# ts-levenshtein - خوارزمية Levenshtein بـ TypeScript

[![CI](https://github.com/ChasLui/ts-levenshtein/actions/workflows/ci.yml/badge.svg)](https://github.com/ChasLui/ts-levenshtein/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ts-levenshtein.svg)](https://www.npmjs.com/package/ts-levenshtein)
[![npm downloads](https://img.shields.io/npm/dm/ts-levenshtein.svg)](https://www.npmjs.com/package/ts-levenshtein)
[![Follow on Twitter](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Follow&maxAge=2592000)](https://twitter.com/chaslui1)

[English](README.md) | [简体中文](README.zh-CN.md) | **العربية**

تنفيذٌ لـ [مسافة ليفِنشتاين](http://en.wikipedia.org/wiki/Levenshtein_distance) بـ TypeScript مع دعمٍ اختياري للمقارنات الحسّاسة للمحلية عبر `Intl.Collator`. النواة مبنية على خوارزمية Myers بالتوازي البِتّي (دون تبعيات تشغيلية خارجية) مع مسار سريع للسلاسل القصيرة و إعادة استخدامٍ لمخازن typed arrays.

## الميزات

- يعمل في Node.js والمتصفح
- دعم مقارنات نصية حسّاسة للمحلية (اختياري)
- حزمة اختبارات شاملة

## التثبيت

```bash
npm install ts-levenshtein
```

**CDN**

يمكنك التحميل كواجهة IIFE عالمية أو كـ ESM عبر esm.sh.

- IIFE (الاسم العالمي `TSLevenshtein`):
  - jsDelivr: `https://cdn.jsdelivr.net/npm/ts-levenshtein/dist/index.global.js`
  - unpkg: `https://unpkg.com/ts-levenshtein/dist/index.global.js`
- ESM (esm.sh):
  - `https://esm.sh/ts-levenshtein`

## أمثلة

**الاستخدام الافتراضي (Node.js)**

```javascript
// CommonJS (npm)
const levenshtein = require("ts-levenshtein").default;
console.log(levenshtein.get("back", "book")); // 2
console.log(levenshtein.get("أحبك", "أبك")); // مثال

// أو ESM
// import levenshtein from 'ts-levenshtein'
// console.log(levenshtein.get('back', 'book'))
```

**المتصفح عبر CDN (IIFE)**

```html
<script src="https://cdn.jsdelivr.net/npm/ts-levenshtein/dist/index.global.js"></script>
<script>
  // الاسم العالمي: TSLevenshtein
  const d1 = TSLevenshtein.default.get('kitten', 'sitting');
  const d2 = TSLevenshtein.default.get('أحبك', 'أبك');
  console.log(d1, d2);
</script>
```

**مقارنات نصية حسّاسة للمحلية**

يدعم استخدام [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator):

```javascript
// CommonJS (npm)
const levenshtein = require("ts-levenshtein").default;
levenshtein.get("mikailovitch", "Mikhaïlovitch", { useCollator: true });
// 1
```

## صيغ الحزم والأدوات

- **CJS**: `dist/index.cjs`
- **ESM**: `dist/index.mjs`
- **UMD**: `dist/index.umd.js`
- **IIFE (عالمي)**: `dist/index.global.js` (الاسم العالمي `TSLevenshtein`)
- **أنواع TypeScript**: `dist/index.d.ts`
- **خرائط المصدر**: متاحة لجميع البُنى

## البناء والاختبار

```bash
npm install
npm run build
npm test
```

## الأداء

- خوارزمية Myers بالتوازي البِتّي للمسار غير المعتمد على collator
- مسار DP سريع للسلاسل القصيرة
- اقتطاع بادئات/لواحق مشتركة
- استخدام typed arrays وإعادة استخدام المخازن لتقليل الإنشاءات

## المساهمة

مرحبًا بالمساهمات. فضلًا حدّث/أضِف اختبارات للتغييرات وتأكد من اجتياز البناء والاختبارات محليًا (`npm run build`, `npm test`).

## الرخصة

MIT - انظر `LICENSE.md`
