import { spawn } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CliTemplateName, ScaffoldCliArgs, VALID_TEMPLATES } from '../cli/parse-args.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES: Record<CliTemplateName, string> = {
  react: 'template-react',
  'react-resta': 'template-react-resta',
};
const DEFAULT_TEMPLATE: CliTemplateName = 'react';

type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

const RENAME: Record<string, string> = { _gitignore: '.gitignore' };
const SKIP_COPY_ENTRIES = new Set(['.git', 'node_modules', 'dist']);

function fail(message: string): never {
  throw new Error(`Error: ${message}`);
}

function listTemplates(): string {
  return Object.keys(TEMPLATES).map((template) => `  - ${template}`).join('\n');
}

function isKnownTemplate(value: string): value is CliTemplateName {
  return value in TEMPLATES;
}

function getPackageManager(): PackageManager {
  const agent = process.env.npm_config_user_agent ?? '';
  if (agent.includes('bun')) return 'bun';
  if (agent.includes('pnpm')) return 'pnpm';
  if (agent.includes('yarn')) return 'yarn';
  return 'npm';
}

function spawnOrFail(command: string, args: string[], cwd: string, label: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('error', () => {
      reject(new Error(`Failed to run ${label} in ${cwd}.`));
    });
    child.on('close', (code: number) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with exit code ${code}.`));
    });
  });
}

function ensureDirExists(dir: string): void {
  if (existsSync(dir)) {
    const stats = statSync(dir);
    if (!stats.isDirectory()) {
      fail(`Target path "${dir}" already exists as a file.`);
    }

    const files = readdirSync(dir).filter((f) => f !== '.git');
    if (files.length > 0) {
      fail(`Directory "${dir}" is not empty.`);
    }
    return;
  }

  mkdirSync(dir, { recursive: true });
}

function formatTargetDir(dir: string): string {
  return dir
    .trim()
    .replace(/[<>:\"\|?*]/g, '')
    .replace(/\/+$/g, '');
}

function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');
}

function copyDir(srcDir: string, destDir: string): void {
  if (!existsSync(srcDir)) {
    return;
  }

  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    if (SKIP_COPY_ENTRIES.has(entry.name)) {
      continue;
    }

    const src = join(srcDir, entry.name);
    const dest = join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else {
      const destName = RENAME[entry.name] ?? entry.name;
      const destPath = join(destDir, destName);
      copyFileSync(src, destPath);
    }
  }
}

function isValidTemplate(value: string): value is CliTemplateName {
  return (value as CliTemplateName) in TEMPLATES;
}

function ensureTemplate(template: CliTemplateName | undefined): CliTemplateName {
  if (!template) {
    return DEFAULT_TEMPLATE;
  }
  if (!isKnownTemplate(template)) {
    fail(`Unknown template "${template}".`);
  }
  return template;
}

export async function runScaffold(args: ScaffoldCliArgs): Promise<void> {
  const targetDir = formatTargetDir(args.target);
  if (!targetDir) {
    fail('Project directory name is required.');
  }

  if (!VALID_TEMPLATES.includes(args.template) || !isValidTemplate(args.template)) {
    console.error(`\nAvailable templates:\n${listTemplates()}`);
    fail(`Unknown template "${args.template}".`);
  }

  const template = ensureTemplate(args.template);
  const root = join(process.cwd(), targetDir);
  const templateDir = TEMPLATES[template];
  const srcDir = join(__dirname, '..', '..', templateDir);
  if (!existsSync(srcDir)) {
    fail(`Template source "${templateDir}" not found.`);
  }

  const packageName = toValidPackageName(basename(targetDir));
  if (!packageName) {
    fail(`Project directory "${targetDir}" cannot be converted into a valid npm package name.`);
  }

  ensureDirExists(root);

  console.log(`\n  Creating UI8Kit app in ${root}...\n`);
  copyDir(srcDir, root);

  const pkgPath = join(root, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
    name?: string;
    [key: string]: unknown;
  };
  pkg.name = packageName;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf-8');

  const indexHtmlPath = join(root, 'index.html');
  let html = readFileSync(indexHtmlPath, 'utf-8');
  html = html.replace(/<title>.*?<\/title>/, `<title>${packageName}</title>`);
  writeFileSync(indexHtmlPath, html, 'utf-8');

  const packageManager = getPackageManager();

  if (args.immediate) {
    console.log('  Installing and starting dev server...\n');
    await spawnOrFail(packageManager, ['install'], root, `${packageManager} install`);
    await spawnOrFail(packageManager, ['run', 'dev'], root, `${packageManager} run dev`);
  } else {
    console.log('  Done. Next steps:\n');
    console.log(`  cd ${targetDir}`);
    if (packageManager === 'bun') {
      console.log('  bun install');
      console.log('  bun run dev');
    } else if (packageManager === 'pnpm') {
      console.log('  pnpm install');
      console.log('  pnpm run dev');
    } else if (packageManager === 'yarn') {
      console.log('  yarn install');
      console.log('  yarn run dev');
    } else {
      console.log('  npm install');
      console.log('  npm run dev');
    }
  }
  console.log('');
}

export function printScaffoldUsage(): string {
  return `Usage:\n  npx brand-os [OPTION]... [DIRECTORY]\n  npm exec brand-os -- [OPTION]... [DIRECTORY]\n  bunx brand-os [OPTION]... [DIRECTORY]\n\nCreate a new UI8Kit Vite + React app.\n\nOptions:\n  -t, --template NAME   template (default: react)\n  -i, --immediate       install deps and run dev\n  -h, --help            show help\n\nExamples:\n  npx brand-os my-app\n  npx brand-os my-app --template react -i\n  npm exec brand-os -- --template react-resta`;
}
