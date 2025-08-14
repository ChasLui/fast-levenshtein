import path from "node:path";
import { fileURLToPath } from "node:url";

function hrtimeMs(): number {
  const [s, ns] = process.hrtime();
  return s * 1000 + ns / 1e6;
}

type BenchmarkStatus = "ok" | "skipped" | "error";

interface BenchmarkResult {
  name: string;
  status: BenchmarkStatus;
  ms: number | null;
  errorMessage?: string;
}

function isMissingModuleError(e: unknown): boolean {
  const msg = String((e as any) && ((e as any).message ?? e));
  // @ts-ignore narrow for node error
  const code = (e as any) && (e as any).code;
  return (
    code === "MODULE_NOT_FOUND" ||
    /Cannot find module/.test(msg) ||
    msg === "MODULE_NOT_FOUND"
  );
}

function runTest(name: string, fn: () => void): BenchmarkResult {
  const start = hrtimeMs();
  try {
    fn();
  } catch (e: any) {
    if (isMissingModuleError(e)) {
      return { name, status: "skipped", ms: null };
    }
    return {
      name,
      status: "error",
      ms: null,
      errorMessage: String(e && e.message ? e.message : e),
    };
  }
  const end = hrtimeMs();
  const ms = parseFloat((end - start).toFixed(2));
  return { name, status: "ok", ms };
}

function pad(
  value: string,
  width: number,
  align: "left" | "right" = "left"
): string {
  if (value.length >= width) return value;
  const padSize = width - value.length;
  const spaces = " ".repeat(padSize);
  return align === "right" ? spaces + value : value + spaces;
}

function renderTable(headers: string[], rows: string[][]): string {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ?? "").length))
  );

  const makeBorder = (junction = "+", horizontal = "-") =>
    junction +
    colWidths.map((w) => horizontal.repeat(w + 2)).join(junction) +
    junction;

  const renderRow = (cols: string[]) =>
    "| " + cols.map((c, i) => pad(c, colWidths[i])).join(" | ") + " |";

  const lines: string[] = [];
  lines.push(makeBorder());
  lines.push(renderRow(headers));
  lines.push(makeBorder());
  for (const r of rows) lines.push(renderRow(r));
  lines.push(makeBorder());
  return lines.join("\n");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - tsx resolves .ts extension at runtime
import suite from "./speed.ts";

console.log(`Benchmark: ${suite.name}`);

const rawResults: BenchmarkResult[] = [];
for (const t of suite.tests as Array<{ name: string; fn: () => void }>) {
  rawResults.push(runTest(t.name, t.fn));
}

const okResults = rawResults.filter(
  (r) => r.status === "ok" && typeof r.ms === "number"
) as Array<Required<Pick<BenchmarkResult, "name" | "ms">> & { status: "ok" }>;
const fastest =
  okResults.length > 0 ? Math.min(...okResults.map((r) => r.ms)) : null;

// Sort: ok by time asc, then skipped, then error
const sorted = [
  ...rawResults
    .filter((r) => r.status === "ok")
    .sort((a, b) => (a.ms ?? Infinity) - (b.ms ?? Infinity)),
  ...rawResults.filter((r) => r.status === "skipped"),
  ...rawResults.filter((r) => r.status === "error"),
];

let rankCounter = 0;
const rows = sorted.map((r) => {
  let rank = "-";
  let timeStr = "-";
  let relStr = "-";
  if (r.status === "ok" && typeof r.ms === "number") {
    rank = String(++rankCounter);
    timeStr = r.ms.toFixed(2);
    relStr =
      fastest !== null
        ? `${(((r.ms - fastest) / fastest) * 100).toFixed(2)}%`
        : "-";
  }
  const statusStr =
    r.status === "ok" ? "ok" : r.status === "skipped" ? "skipped" : "error";
  return [rank, r.name, timeStr, relStr, statusStr];
});

const headers = [
  "Rank",
  "Implementation",
  "Time (ms)",
  "Relative to fastest",
  "Status",
];
console.log(renderTable(headers, rows));

if (typeof (suite as any).onComplete === "function") {
  (suite as any).onComplete();
}
