import path from 'node:path';
import { fileURLToPath } from 'node:url';

function hrtimeMs(): number {
  const [s, ns] = process.hrtime();
  return s * 1000 + ns / 1e6;
}

function runTest(name: string, fn: () => void): void {
  const start = hrtimeMs();
  fn();
  const end = hrtimeMs();
  const ms = (end - start).toFixed(2);
  console.log(`${name}: ${ms} ms`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - tsx resolves .ts extension at runtime
import suite from './speed.ts';

console.log(`Benchmark: ${suite.name}`);

const safeTests = suite.tests.map((t: { name: string; fn: () => void }) => {
  const name = t.name;
  const fn = () => {
    try {
      return t.fn();
    } catch (e: any) {
      if (
        e &&
        (e.code === 'MODULE_NOT_FOUND' ||
          /Cannot find module/.test(String(e)) ||
          String(e && e.message) === 'MODULE_NOT_FOUND')
      ) {
        console.log(`${name}: skipped (missing optional dependency)`);
        return;
      }
      throw e;
    }
  };
  return { name, fn };
});

for (const t of safeTests) {
  runTest(t.name, t.fn);
}

if (typeof (suite as any).onComplete === 'function') {
  (suite as any).onComplete();
}


