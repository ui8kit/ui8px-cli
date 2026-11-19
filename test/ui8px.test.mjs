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

test('lint skips files ignored by local .gitignore', () => {
  const root = tempProject();
  writeFile(root, '.gitignore', '.manual/\n');
  writeFile(root, '.manual/reference.html', '<div class="reference-only-class"></div>');
  writeFile(root, 'src/views/page.templ', '<section class="px-4 py-4 flex"></section>');

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Checked files: 1/);
  assert.match(result.stdout, /Violations: 0/);
});

test('lint accepts extra ignored folders after --ignore', () => {
  const root = tempProject();
  writeFile(root, '.manual/reference.html', '<div class="reference-only-class"></div>');
  writeFile(root, '.project/reference.html', '<div class="project-only-class"></div>');
  writeFile(root, 'src/views/page.templ', '<section class="px-4 py-4 flex"></section>');

  const result = runCli(root, ['lint', './...', '--ignore', '.manual', '.project']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Checked files: 1/);
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

test('validate aria passes when used patterns are included in package config', () => {
  const root = tempProject();
  writeFile(
    root,
    'package.json',
    JSON.stringify({
      ui8kit: {
        aria: {
          mode: 'subset',
          patterns: ['dialog', 'tabs'],
        },
      },
    }),
  );
  writeFile(
    root,
    'src/views/page.templ',
    `
<div data-ui8kit="dialog"></div>
<div data-ui8kit="tabs"></div>
`,
  );

  const result = runCli(root, ['validate', 'aria', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Violations: 0/);
});

test('validate aria reports missing package config patterns', () => {
  const root = tempProject();
  writeFile(
    root,
    'package.json',
    JSON.stringify({
      ui8kit: {
        aria: {
          mode: 'subset',
          patterns: ['dialog'],
        },
      },
    }),
  );
  writeFile(root, 'src/views/page.templ', '<div data-ui8kit="tabs"></div>');

  const result = runCli(root, ['validate', 'aria', './...']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /UI8PX101/);
  assert.match(result.stdout, /missing ARIA pattern "tabs"/);
});

test('validate aria maps sheet and alertdialog to dialog', () => {
  const root = tempProject();
  writeFile(
    root,
    'package.json',
    JSON.stringify({
      ui8kit: {
        aria: {
          mode: 'subset',
          patterns: ['dialog'],
        },
      },
    }),
  );
  writeFile(
    root,
    'src/views/page.templ',
    `
<div data-ui8kit="sheet"></div>
<div data-ui8kit="alertdialog"></div>
`,
  );

  const result = runCli(root, ['validate', 'aria', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('validate aria uses generated manifest as actual bundle when present', () => {
  const root = tempProject();
  writeFile(
    root,
    'package.json',
    JSON.stringify({
      ui8kit: {
        aria: {
          mode: 'subset',
          patterns: ['dialog', 'tabs'],
        },
      },
    }),
  );
  writeFile(
    root,
    'web/static/js/manifest.json',
    JSON.stringify({
      ariaMode: 'subset',
      patterns: ['dialog'],
    }),
  );
  writeFile(root, 'src/views/page.templ', '<div data-ui8kit="tabs"></div>');

  const result = runCli(root, ['validate', 'aria', './...']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /manifest\.json/);
  assert.match(result.stdout, /missing ARIA pattern "tabs"/);
});

test('validate aria accepts full mode', () => {
  const root = tempProject();
  writeFile(
    root,
    'package.json',
    JSON.stringify({
      ui8kit: {
        aria: {
          mode: 'full',
          patterns: [],
        },
      },
    }),
  );
  writeFile(root, 'src/views/page.templ', '<div data-ui8kit="tabs"></div>');

  const result = runCli(root, ['validate', 'aria', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('lint does not treat inset-ring as spacing in layout scope', () => {
  const root = tempProject();
  writeFile(
    root,
    'src/views/page.templ',
    `
<div class="rounded-lg inset-ring inset-ring-border"></div>
<div class="inset-0 inset-x-0 inset-y-0"></div>
<div class="inset-shadow-sm"></div>
`,
  );

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /UI8PX001/);
  assert.doesNotMatch(result.stdout, /UI8PX004/);
  assert.match(result.stdout, /UI8PX002/);
  assert.match(result.stdout, /inset-ring/);
  assert.match(result.stdout, /inset-shadow-sm/);
});

test('lint does not treat inset-ring as spacing in control scope', () => {
  const root = tempProject();
  const init = runCli(root, ['init']);
  assert.equal(init.status, 0, init.stderr);
  const allowedPath = path.join(root, '.ui8px', 'policy', 'allowed.json');
  const allowed = JSON.parse(readFileSync(allowedPath, 'utf8'));
  allowed.utilities.push('inset-ring', 'inset-ring-border', 'inset-shadow-sm');
  writeFile(root, '.ui8px/policy/allowed.json', `${JSON.stringify(allowed, null, 2)}\n`);
  writeFile(
    root,
    'src/ui/button.templ',
    `
<button class="rounded-lg inset-ring inset-ring-border inset-0"></button>
<button class="inset-shadow-sm"></button>
`,
  );

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Violations: 0/);
  assert.doesNotMatch(result.stdout, /UI8PX001/);
  assert.doesNotMatch(result.stdout, /UI8PX004/);
});

test('go extractor reads lowercase cn helpers and splits literal arguments', () => {
  const root = tempProject();
  const init = runCli(root, ['init', '--preset', 'go']);
  assert.equal(init.status, 0, init.stderr);
  writeFile(
    root,
    'tests/examples/page.go',
    `
package examples

func Box(wide bool) string {
  return cn("px-3 py-4")
}

func Wide(wide bool) string {
  return utils.cn("px-2 py-4", "px-4 py-4")
}
`,
  );

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /UI8PX001/);
  assert.match(result.stdout, /px-3/);
  assert.doesNotMatch(result.stdout, /UI8PX004/);
});

test('go extractor reads Class struct fields and const/var utility strings', () => {
  const root = tempProject();
  const init = runCli(root, ['init', '--preset', 'go']);
  assert.equal(init.status, 0, init.stderr);
  writeFile(
    root,
    'tests/examples/card.go',
    `
package examples

type CardProps struct {
  Class string
}

func Card() CardProps {
  return CardProps{Class: "px-3 py-4"}
}

func QuotedCard() CardProps {
  return CardProps{Class: \`h-8 px-3\`}
}

const SimpleConst = "flex unknown-simple-const"
var SimpleVar = \`flex unknown-simple-var\`
const (
  GroupedConst = "flex unknown-grouped-const"
)
`,
  );

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /UI8PX001/);
  assert.match(result.stdout, /px-3/);
  assert.match(result.stdout, /unknown-simple-const/);
  assert.match(result.stdout, /unknown-simple-var/);
  assert.match(result.stdout, /unknown-grouped-const/);
});

test('templ extractor reads Go-side Class, cn, and Attributes forms', () => {
  const root = tempProject();
  writeFile(
    root,
    'src/views/page.templ',
    `
package views

templ Button(props Props) {
  <button class={ cn("inline-flex px-3", props.Class) }>Save</button>
}

templ Card() {
  <div { templ.Attributes{"class": "px-3 py-4"}... }></div>
}

templ Wrapped() {
  @Button(Props{Class: \`h-8 px-3\`})
}
`,
  );

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /UI8PX001/);
  assert.match(result.stdout, /px-3/);
  const px3Hits = result.stdout.match(/disallowed utility class "px-3"/g) ?? [];
  assert.equal(px3Hits.length, 3, result.stdout);
});

test('lint honours gitignore negation lines', () => {
  const root = tempProject();
  writeFile(root, '.gitignore', '*_templ.go\n!keep_templ.go\n');
  writeFile(root, 'ignored_templ.go', 'package ignored\n\nfunc Classes() string { return "flex unknown-ignored-class" }\n');
  writeFile(root, 'keep_templ.go', 'package keep\n\nfunc Classes() string { return "flex unknown-keep-class" }\n');
  writeFile(root, 'src/views/page.templ', '<section class="px-4 py-4 flex"></section>');

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /unknown-keep-class/);
  assert.doesNotMatch(result.stdout, /unknown-ignored-class/);
  assert.match(result.stdout, /Checked files: 2/);
});

test('lint checked files counts scanned files without class lists', () => {
  const root = tempProject();
  writeFile(root, 'pkg/a.go', 'package a\n');
  writeFile(root, 'pkg/b.go', 'package b\n');
  writeFile(root, 'pkg/c.go', 'package c\n');

  const result = runCli(root, ['lint', './...']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Checked files: 3/);
  assert.match(result.stdout, /Checked class lists: 0/);
});

test('validate aria detects UI8Kit component calls that imply patterns', () => {
  const root = tempProject();
  writeFile(
    root,
    'package.json',
    JSON.stringify({
      ui8kit: {
        aria: {
          mode: 'subset',
          patterns: [],
        },
      },
    }),
  );
  writeFile(
    root,
    'src/views/layout.templ',
    `
package views

templ Page() {
  @ui8layout.Shell(ui8layout.ShellProps{}) {
    <main>Content</main>
  }
}
`,
  );

  const result = runCli(root, ['validate', 'aria', './...']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /UI8PX101/);
  assert.match(result.stdout, /UI8Kit component "Shell" requires/);
  assert.match(result.stdout, /missing ARIA pattern "dialog"/);
});

test('validate grid: layout scope takes multiples of 8px only, control scope multiples of 4px', () => {
  const root = tempProject();
  writeFile(root, 'map.json', JSON.stringify({
    'h-3': 'height: calc(var(--spacing) * 3);',
    'gap-1': 'gap: calc(var(--spacing) * 1);',
    'p-2': 'padding: calc(var(--spacing) * 2);',
  }));
  const layout = runCli(root, ['validate', 'grid', '--input', 'map.json', '--output', 'b.json']);
  assert.equal(layout.status, 1);
  const backlog = JSON.parse(readFileSync(path.join(root, 'b.json'), 'utf8'));
  assert.deepEqual(backlog.violations.map((v) => v.className).sort(), ['gap-1', 'h-3']);
  assert.ok(backlog.violations.every((v) => v.scope === 'layout'));
  const control = runCli(root, ['validate', 'grid', '--input', 'map.json', '--output', 'b.json', '--scope', 'control']);
  assert.equal(control.status, 0, control.stdout);
});

test('validate grid reads a compiled stylesheet: nested at-rules, var() with fallbacks, selector scopes, exempt hairlines', () => {
  const root = tempProject();
  writeFile(root, '.ui8px/policy/scopes.json', JSON.stringify({
    extends: 'ui8kit',
    defaultScope: 'layout',
    scopes: [
      { name: 'controls', files: [], selectors: ['\\[data-shape="badge"\\]'], spacing: 'control' },
      { name: 'layout', files: ['**'], spacing: 'layout' },
    ],
  }));
  writeFile(root, '.ui8px/policy/allowed.json', JSON.stringify({ extends: 'ui8kit' }));
  writeFile(root, 'out.css', [
    ':root,:host{--spacing:.25rem;--container-6xl:72rem}',
    '@layer utilities{.gap-2{gap:calc(var(--spacing)*2)}.max-w-6xl{max-width:var(--container-6xl)}',
    '.lg\\:py-40{@media (width>=64rem){padding-block:calc(var(--spacing)*40)}}.w-px{width:1px}}',
    '[data-shape="cta"][data-slot="button"]{height:var(--h-button,40px);width:var(--w-button, 96px)}',
    '[data-shape="badge"][data-density="compact"]{height:20px;width:56px}',
    '@media (width>=40rem){.bad{margin-top:12px}}',
  ].join('\n'));
  const result = runCli(root, ['validate', 'grid', '--input', 'out.css', '--output', 'b.json']);
  assert.equal(result.status, 1, result.stdout);
  const backlog = JSON.parse(readFileSync(path.join(root, 'b.json'), 'utf8'));
  assert.deepEqual(backlog.violations.map((v) => [v.className, v.resolvedPx, v.scope]), [['.bad', 12, 'layout']]);
});

test('ui8kit preset: a policy file extends it and keeps only its local deltas', () => {
  const root = tempProject();
  writeFile(root, '.ui8px/policy/allowed.json', JSON.stringify({ extends: 'ui8kit', utilities: ['aspect-3/4'] }));
  writeFile(root, '.ui8px/policy/denied.json', JSON.stringify({ extends: 'ui8kit', utilities: { 'rounded-lg': { reason: 'local', suggest: ['rounded'] } } }));
  writeFile(root, 'src/views/page.html', '<i class="aspect-3/4 gap-px w-px text-start py-40 rounded-lg"></i>');
  const result = runCli(root, ['lint', './...', '--json']);
  const rules = JSON.parse(result.stdout).diagnostics.map((d) => `${d.rule} ${d.className}`);
  assert.deepEqual(rules, ['UI8PX003 rounded-lg']);
});

test('init --preset ui8kit writes extends-only policy files', () => {
  const root = tempProject();
  const result = runCli(root, ['init', '--preset', 'ui8kit']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(readFileSync(path.join(root, '.ui8px/policy/allowed.json'), 'utf8')).extends, 'ui8kit');
});

test('lint grammar: z-* is not spacing, logical and size/space prefixes are spacing, rtl:/ltr: are modifiers', () => {
  const root = tempProject();
  writeFile(root, 'src/views/page.html', '<i class="z-50 size-4 space-y-4 ps-4 pe-2 ms-4 me-2 start-0 end-0 inset-s-2 rtl:text-right"></i><i class="ltr:text-left size-3 space-x-3 ms-3"></i>');
  const result = runCli(root, ['lint', './...', '--json']);
  const found = JSON.parse(result.stdout).diagnostics.map((d) => `${d.rule} ${d.className}`);
  assert.deepEqual(found, ['UI8PX001 size-3', 'UI8PX001 space-x-3', 'UI8PX001 ms-3']);
});

test('ui8kit preset: text-left / text-right are denied under any modifier, with the logical suggestion', () => {
  const root = tempProject();
  writeFile(root, '.ui8px/policy/allowed.json', JSON.stringify({ extends: 'ui8kit' }));
  writeFile(root, '.ui8px/policy/denied.json', JSON.stringify({ extends: 'ui8kit' }));
  writeFile(root, 'src/views/page.html', '<i class="text-left text-start self-center"></i><i class="md:text-right text-center"></i><i class="text-end"></i>');
  const result = runCli(root, ['lint', './...', '--json']);
  const found = JSON.parse(result.stdout).diagnostics.map((d) => `${d.rule} ${d.className} -> ${(d.suggest ?? []).join(',')}`);
  assert.deepEqual(found.filter((f) => f.startsWith('UI8PX003')), ['UI8PX003 text-left -> text-start', 'UI8PX003 md:text-right -> md:text-end']);
  assert.deepEqual(found.filter((f) => !f.startsWith('UI8PX003') && !f.startsWith('UI8PX004')), []);
});
