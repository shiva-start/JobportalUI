import fs from 'node:fs';
import path from 'node:path';

const I18N_DIR = path.resolve('public/assets/i18n');
const MOJIBAKE_PATTERN = /[ØÙÃÂÐÑ]/;
const REPLACEMENT_PATTERN = /\uFFFD/;
const CONTROL_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;
const SUSPICIOUS_ARABIC_BANG_PATTERN = /[\u0621-\u064A]![\u0621-\u064A]/;

function walk(value, pointer, issues) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${pointer}[${index}]`, issues));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, child]) => {
      const nextPointer = pointer ? `${pointer}.${key}` : key;
      walk(child, nextPointer, issues);
    });
    return;
  }

  if (typeof value !== 'string') {
    return;
  }

  if (MOJIBAKE_PATTERN.test(value)) {
    issues.push(`${pointer}: contains mojibake marker (Ø/Ù/Ã/Â/Ð/Ñ)`);
  }

  if (REPLACEMENT_PATTERN.test(value)) {
    issues.push(`${pointer}: contains replacement character (�)`);
  }

  if (CONTROL_PATTERN.test(value)) {
    issues.push(`${pointer}: contains control characters`);
  }

  if (SUSPICIOUS_ARABIC_BANG_PATTERN.test(value)) {
    issues.push(`${pointer}: contains suspicious ! inside Arabic word`);
  }
}

function collectJsonFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(dir, entry.name));
}

const files = collectJsonFiles(I18N_DIR);
const allIssues = [];

for (const file of files) {
  const issues = [];
  const raw = fs.readFileSync(file);

  if (raw.length >= 3 && raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
    issues.push('<file>: has UTF-8 BOM (must be UTF-8 without BOM)');
  }

  const text = raw.toString('utf8');
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    issues.push(`<file>: invalid JSON (${error.message})`);
  }

  if (parsed) {
    walk(parsed, '', issues);
  }

  if (issues.length > 0) {
    allIssues.push({ file, issues });
  }
}

if (allIssues.length > 0) {
  console.error('i18n encoding validation failed:\n');
  allIssues.forEach(({ file, issues }) => {
    console.error(`- ${path.relative(process.cwd(), file)}`);
    issues.forEach((issue) => console.error(`  - ${issue}`));
  });
  process.exit(1);
}

console.log(`i18n encoding validation passed for ${files.length} file(s).`);
