/**
 * Phase 5 Schema Cleanup Script
 *
 * Uses the pre-computed models_to_remove.json (341 models) from analyze_schema.mjs.
 * 1. Removes enterprise model blocks from schema.prisma
 * 2. Removes back-reference fields in KEEP/REVIEW models that point to removed models
 * 3. Writes clean schema to prisma/schema.cleaned.prisma
 */
import fs from 'fs';

const SCHEMA_PATH = 'prisma/schema.prisma';
const REMOVE_LIST_PATH = 'prisma/models_to_remove.json';
const OUT_PATH = 'prisma/schema.cleaned.prisma';

const content = fs.readFileSync(SCHEMA_PATH, 'utf-8');
const removeList = JSON.parse(fs.readFileSync(REMOVE_LIST_PATH, 'utf-8'));
const removeSet = new Set(removeList);

console.log(`Models to remove: ${removeSet.size}`);

// ─── 1. Parse all top-level blocks ───────────────────────────────────────────

function parseBlocks(text) {
  const blocks = [];
  const headerRe = /^(datasource|generator|model|enum)\s+(\w+)\s*\{/gm;
  let m;
  while ((m = headerRe.exec(text)) !== null) {
    const kind = m[1];
    const name = m[2];
    const blockStart = m.index;
    let depth = 0;
    let blockEnd = blockStart;
    for (let i = blockStart + m[0].length - 1; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') {
        depth--;
        if (depth === 0) { blockEnd = i + 1; break; }
      }
    }
    blocks.push({ kind, name, start: blockStart, end: blockEnd, body: text.slice(blockStart, blockEnd) });
  }
  return blocks;
}

const blocks = parseBlocks(content);
const modelBlocks = blocks.filter(b => b.kind === 'model');
const enumBlocks = blocks.filter(b => b.kind === 'enum');
const headerBlocks = blocks.filter(b => b.kind === 'datasource' || b.kind === 'generator');

console.log(`Total blocks: ${blocks.length} (${modelBlocks.length} models, ${enumBlocks.length} enums)`);

// ─── 2. Strip back-reference fields from kept models ─────────────────────────
// A "back-reference" field in Prisma is one whose field type is a removed model.
// Pattern: <fieldName>  <RemovedModel>?  or  <fieldName>  <RemovedModel>[]  or  <fieldName>  <RemovedModel>
// We strip any non-comment field line whose type resolves to a REMOVE model.

function stripRemovedFields(body, removeSet) {
  const lines = body.split('\n');
  const result = [];
  for (const line of lines) {
    const trimmed = line.trim();
    // Preserve: blank lines, model declaration, closing brace, comments, directives (@@, @)
    if (
      trimmed === '' ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('@@') ||
      trimmed.startsWith('}') ||
      trimmed.startsWith('model ')
    ) {
      result.push(line);
      continue;
    }

    // A field line has at least 2 tokens: fieldName TypeName [modifiers...]
    const tokens = trimmed.split(/\s+/);
    if (tokens.length < 2) {
      result.push(line);
      continue;
    }

    // Extract base type (strip ?, [], ?[])
    const rawType = tokens[1];
    const baseType = rawType.replace(/[\?\[\]]/g, '');

    if (removeSet.has(baseType)) {
      // Skip this field
      continue;
    }

    result.push(line);
  }
  return result.join('\n');
}

// ─── 3. Build output schema ───────────────────────────────────────────────────

// Schema header = everything before the first non-header block
const firstContentBlock = blocks.find(b => b.kind === 'model' || b.kind === 'enum');
let schemaHeader = '';
if (firstContentBlock) {
  // Find the last header block and grab text up to first content block
  schemaHeader = content.slice(0, firstContentBlock.start);
}

const outputParts = [schemaHeader.trimEnd() + '\n'];

// Output kept model blocks (with cleaned fields)
let keptCount = 0;
let removedCount = 0;
for (const block of modelBlocks) {
  if (removeSet.has(block.name)) {
    removedCount++;
    continue;
  }
  const cleanedBody = stripRemovedFields(block.body, removeSet);
  outputParts.push('\n' + cleanedBody + '\n');
  keptCount++;
}

// Output all enum blocks (preserve all — unused enums are harmless)
for (const block of enumBlocks) {
  outputParts.push('\n' + block.body + '\n');
}

const output = outputParts.join('');
fs.writeFileSync(OUT_PATH, output);

console.log(`\n✓ Cleaned schema written to ${OUT_PATH}`);
console.log(`  Original: ${content.split('\n').length} lines`);
console.log(`  Cleaned:  ${output.split('\n').length} lines`);
console.log(`  Models removed: ${removedCount}`);
console.log(`  Models kept: ${keptCount}`);
