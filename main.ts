// make.fun "Rename the Planet": one line, under 200 characters, renaming one
// planet of our solar system and giving the why in the same breath.
//
// The line is Saturn, because the two facts that carry the joke are Saturn's
// alone: its mean density is 0.687 g/cm3, so it would float in a bathtub, and
// Cassini measured ring material raining into the planet, which is why the
// name has to be a bath toy that is being dissolved rather than a toy that is
// merely wet. Every other planet is denser than water and has no rings to lose.
// Run as `node main.ts` on Node 22.18 or later, which strips the types itself;
// package.json marks the repository as an ES module so the imports below load.
import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";

const LINE =
  "Saturn: rename it The Bath Toy \u2014 the only planet light enough to float in your tub, and its rings are raining in, so it is dissolving in the water.";

// The gate: UTF-8 text of 1 to 200 characters, not only white space. Counted in
// code points, as the sealed scorer counts them, not in UTF-16 units.
function gate(text: string): { ok: boolean; why: string; length: number } {
  const points = [...text].length;
  if (text.trim().length === 0) return { ok: false, why: "blank", length: points };
  if (points < 1) return { ok: false, why: "empty", length: points };
  if (points > 200) return { ok: false, why: "over 200 characters", length: points };
  if (text.includes("\n")) return { ok: false, why: "not one line", length: points };
  return { ok: true, why: "valid", length: points };
}

const verdict = gate(LINE);
if (!verdict.ok) {
  console.error(`entry refused by the gate: ${verdict.why} (${verdict.length} code points)`);
  process.exit(1);
}

const outDir = process.env.OUTPUT_DIR || "/output";
const outFile = join(outDir, "entry.txt");
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, LINE, { encoding: "utf8" });

const digest = createHash("sha256").update(LINE, "utf8").digest("hex");
console.log(`planet   Saturn`);
console.log(`name     The Bath Toy`);
console.log(`length   ${verdict.length} code points (gate: 1 to 200)`);
console.log(`written  ${outFile}`);
console.log(`sha256   ${digest}`);
