import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(repoRoot, 'dist', 'index.js');

function tempProject() {
  return mkdtempSync(path.join(tmpdir(), 'ui8px-'));
}

function writeFile(root, filePath, content) {
  const absolute = path.join(root, filePath);
  mkdirSync(path.dirname(absolute), { recursive: true });
  writeFileSync(absolute, content, 'utf8');
  return absolute;
}

function runCli(root, args) {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  return {
    status: result.status ?? 0,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

test('validate grid keeps existing class-map validation flow', () => {
  const root = tempProject();
  writeFile(root, 'map.json', JSON.stringify({ 'p-2': 'padding: calc(var(--spacing) * 2);' }));

  const result = runCli(root, ['validate', 'grid', '--input', 'map.json', '--output', 'backlog.json']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Violations: 0/);

  const backlog = JSON.parse(readFileSync(path.join(root, 'backlog.json'), 'utf8'));
  assert.equal(backlog.summary.violations, 0);
});

test('lint rejects 4px fine tuning in layout scope', () => {
  const root = tempProject();
  writeFile(root, 'src/views/page.templ', '<section class="px-3 py-4 flex"></section>');

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /UI8PX001/);
  assert.match(result.stdout, /px-3/);
});

test('lint allows 4px fine tuning in control scope', () => {
  const root = tempProject();
  writeFile(root, 'src/ui/button.templ', '<button class="inline-flex px-3 py-1 items-center"></button>');

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Violations: 0/);
});

test('learn mode writes observed JSONL and proposals', () => {
  const root = tempProject();
  writeFile(root, 'src/views/page.templ', '<section class="px-3 bg-red-500"></section>');

  const result = runCli(root, ['lint', './...', '--learn']);
  assert.equal(result.status, 1);

  const observed = readFileSync(path.join(root, '.ui8px', 'telemetry', 'observed.jsonl'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.ok(observed.length >= 2);
  assert.ok(observed.some((event) => event.class === 'px-3'));

  const proposals = JSON.parse(readFileSync(path.join(root, '.ui8px', 'telemetry', 'proposals.json'), 'utf8'));
  assert.ok(proposals.unknownUtilities['px-3']);
});

test('validate patterns treats reordered class lists as the same pattern', () => {
  const root = tempProject();
  writeFile(root, 'src/views/a.templ', '<div class="justify-end px-6 py-4"></div>');
  writeFile(root, 'src/views/b.templ', '<div class="px-6 py-4 justify-end"></div>');

  const result = runCli(root, ['validate', 'patterns', './...', '--min-count', '2']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /Repeated patterns: 1/);

  const report = JSON.parse(readFileSync(path.join(root, '.ui8px', 'reports', 'patterns.json'), 'utf8'));
  assert.equal(report.patterns.length, 1);
  assert.equal(report.patterns[0].count, 2);
});

test('go preset allows compact tuning in Go variant helpers', () => {
  const root = tempProject();
  const init = runCli(root, ['init', '--preset', 'go']);
  assert.equal(init.status, 0, init.stderr);
  writeFile(root, 'utils/variants.go', `
package utils

func ButtonSizeVariant(size string) string {
  return "h-8 px-3 text-sm"
}
`);

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Violations: 0/);
});

test('go extractor reads utils.Cn, Cn, return literals, and mixed dynamic args', () => {
  const root = tempProject();
  const init = runCli(root, ['init', '--preset', 'go']);
  assert.equal(init.status, 0, init.stderr);
  writeFile(root, 'utils/variants.go', `
package utils

func ButtonClasses(props Props) string {
  base := "inline-flex items-center"
  _ = Cn("h-8 px-3 text-sm")
  _ = utils.Cn("inline-flex items-center", "px-3 py-2")
  return utils.Cn(base, "px-3", props.Class)
}

func BadgeClasses() string {
  return "h-7 px-3 text-sm"
}
`);

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Violations: 0/);
});

test('go extractor denies compact tuning in layout examples', () => {
  const root = tempProject();
  const init = runCli(root, ['init', '--preset', 'go']);
  assert.equal(init.status, 0, init.stderr);
  writeFile(root, 'tests/examples/page.go', `
package examples

func PageClasses() string {
  return "px-3 py-4"
}
`);

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /UI8PX001/);
  assert.match(result.stdout, /px-3/);
});

test('validate patterns includes repeated Go class compositions', () => {
  const root = tempProject();
  const init = runCli(root, ['init', '--preset', 'go']);
  assert.equal(init.status, 0, init.stderr);
  writeFile(root, 'utils/a.go', `
package utils

func A() string {
  return utils.Cn("justify-end px-6 py-4", props.Class)
}
`);
  writeFile(root, 'utils/b.go', `
package utils

func B() string {
  return Cn("px-6 py-4 justify-end")
}
`);

  const result = runCli(root, ['validate', 'patterns', './...', '--min-count', '2']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /Repeated patterns: 1/);

  const report = JSON.parse(readFileSync(path.join(root, '.ui8px', 'reports', 'patterns.json'), 'utf8'));
  assert.equal(report.patterns.length, 1);
  assert.equal(report.patterns[0].count, 2);
});
