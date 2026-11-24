import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const source = readFileSync(new URL("../src/data/use-cases.ts", import.meta.url), "utf8");
const match = source.match(/export const useCases: UseCase\[\] = (\[[\s\S]*?\]);\s*export const useCaseSlugs/);
assert(match, "Use-case data array not found");
const cases = JSON.parse(match[1]);
assert(cases.length >= 20, "Expected at least 20 reviewed use cases");
const slugs = new Set();
const titles = new Set();
const services = new Set(["ai-agents", "sales-automation", "1c-crm", "reporting"]);
for (const [index, item] of cases.entries()) {
  assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Bad slug at " + index);
  assert(!slugs.has(item.slug), "Duplicate slug: " + item.slug);
  assert(!titles.has(item.title), "Duplicate title: " + item.title);
  assert(item.title.length > 20, "Short title " + item.slug);
  assert(item.summary.length > 55, "Short summary " + item.slug);
  assert(item.problem.length > 65, "Short problem " + item.slug);
  assert(Array.isArray(item.inputs) && item.inputs.length >= 3, "Missing inputs " + item.slug);
  assert(Array.isArray(item.steps) && item.steps.length >= 4, "Incomplete process " + item.slug);
  assert(Array.isArray(item.metrics) && item.metrics.length >= 3, "Missing metrics " + item.slug);
  assert(item.humanCheck.length >= 55, "Missing human review " + item.slug);
  assert(item.limitations.length >= 65, "Missing limitations " + item.slug);
  assert(services.has(item.service), "Broken related service " + item.slug);
  slugs.add(item.slug); titles.add(item.title);
}
console.log("Validated " + cases.length + " unique cases and their basic content fields.");
