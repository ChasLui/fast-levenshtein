import levModule from "../dist/ts-levenshtein.cjs";

const fastLevenshtein = (
  levModule && (levModule as any).default
    ? (levModule as any).default
    : levModule
).get as (a: string, b: string) => number;

function optional<T = any>(
  name: string,
  picker?: (m: any) => T | null
): T | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(name);
    return picker ? picker(mod) : mod;
  } catch (_e) {
    return null;
  }
}

const levenshtein = optional<(a: string, b: string) => number>("levenshtein");
const levenshteinEditDistance = optional<(a: string, b: string) => number>(
  "levenshtein-edit-distance"
);
const levenshteinComponent = optional<(a: string, b: string) => number>(
  "levenshtein-component"
);
const levenshteinDeltas = optional<any>("levenshtein-deltas");
const natural = optional<(a: string, b: string) => number>(
  "natural",
  (m) => m.LevenshteinDistance
);

// The first 100 words from Letterpress
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let source: any = Array(11)
  .join(
    [
      "aa",
      "aah",
      "aahed",
      "aahing",
      "aahs",
      "aal",
      "aalii",
      "aaliis",
      "aals",
      "aardvark",
      "aardvarks",
      "aardwolf",
      "aardwolves",
      "aargh",
      "aarrgh",
      "aarrghh",
      "aarti",
      "aartis",
      "aas",
      "aasvogel",
      "aasvogels",
      "ab",
      "aba",
      "abac",
      "abaca",
      "abacas",
      "abaci",
      "aback",
      "abacs",
      "abacterial",
      "abactinal",
      "abactinally",
      "abactor",
      "abactors",
      "abacus",
      "abacuses",
      "abaft",
      "abaka",
      "abakas",
      "abalone",
      "abalones",
      "abamp",
      "abampere",
      "abamperes",
      "abamps",
      "aband",
      "abanded",
      "abanding",
      "abandon",
      "abandoned",
      "abandonedly",
      "abandonee",
      "abandonees",
      "abandoner",
      "abandoners",
      "abandoning",
      "abandonment",
      "abandonments",
      "abandons",
      "abandonware",
      "abandonwares",
      "abands",
      "abapical",
      "abas",
      "abase",
      "abased",
      "abasedly",
      "abasement",
      "abasements",
      "abaser",
      "abasers",
      "abases",
      "abash",
      "abashed",
      "abashedly",
      "abashes",
      "abashing",
      "abashless",
      "abashment",
      "abashments",
      "abasia",
      "abasias",
      "abasing",
      "abask",
      "abatable",
      "abate",
      "abated",
      "abatement",
      "abatements",
      "abater",
      "abaters",
      "abates",
      "abating",
      "abatis",
      "abatises",
      "abator",
      "abators",
      "abattis",
      "abattises",
      "abattoir",
      "abattoirs",
    ].join("|")
  )
  .split("|");

function loop(fn: (a: string, b: string) => number): void {
  let iterator = -1;
  let previousValue = "";
  let value: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dist: number;

  // eslint-disable-next-line no-cond-assign
  while ((value = source[++iterator])) {
    dist = fn(previousValue, value);
    previousValue = value;
  }
}

export default {
  name: "Implementation comparison",
  onComplete: function () {
    console.log("Benchmark done.");
  },
  tests: [
    {
      name: "levenshtein-edit-distance",
      fn: function () {
        if (!levenshteinEditDistance) throw new Error("MODULE_NOT_FOUND");
        loop(levenshteinEditDistance);
      },
    },
    {
      name: "levenshtein-component",
      fn: function () {
        if (!levenshteinComponent) throw new Error("MODULE_NOT_FOUND");
        loop(levenshteinComponent);
      },
    },
    {
      name: "levenshtein-deltas",
      fn: function () {
        if (!levenshteinDeltas) throw new Error("MODULE_NOT_FOUND");
        loop(function (v1: string, v2: string) {
          return new levenshteinDeltas!.Lev(v1, v2).distance();
        });
      },
    },
    {
      name: "natural",
      fn: function () {
        if (!natural) throw new Error("MODULE_NOT_FOUND");
        loop(natural);
      },
    },
    {
      name: "levenshtein",
      fn: function () {
        if (!levenshtein) throw new Error("MODULE_NOT_FOUND");
        loop(levenshtein);
      },
    },
    {
      name: "ts-levenshtein",
      fn: function () {
        loop(fastLevenshtein);
      },
    },
  ],
};
