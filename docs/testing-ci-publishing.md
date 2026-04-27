# Testing, CI, And Publishing

This guide explains how to verify `ui8px` locally and publish it safely to npm.

## Local Development Checks

Run the full local gate:

```bash
npm run preflight
```

The preflight script runs:

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm test`
5. `npm pack --dry-run`

This is intentionally the same set of checks that CI runs before publishing.

## Fast Inner Loop

When working on code:

```bash
npm run check
npm run build
npm test
```

Run the full preflight before committing or publishing.

## Why `package-lock.json` Is Committed

CI uses:

```bash
npm ci
```

That requires `package-lock.json`. The lockfile makes CI installs reproducible and reduces supply-chain ambiguity.

## GitHub Actions

The repository uses two workflows:

```text
.github/workflows/ci.yml
.github/workflows/publish.yml
```

`ci.yml` runs on push and pull requests. It installs dependencies and runs the same preflight gates.

`publish.yml` runs when a GitHub Release is published or when the workflow is manually dispatched. It publishes to npm with provenance:

```bash
npm publish --access public --provenance
```

Both workflows use Node.js 24 so GitHub Actions runs with an npm version that supports current npm Trusted Publishing/OIDC behavior. If publishing fails with a misleading `E404 Not Found - PUT https://registry.npmjs.org/...`, check the printed `npm --version` first and make sure it is `11.5.1` or newer.

## Trusted Publishing

For provenance publishing, configure npm Trusted Publisher for the package:

- Package: `ui8px`
- Repository owner: your GitHub owner
- Repository name: your GitHub repository
- Workflow filename: `publish.yml`
- Environment name: `npm`

The workflow uses:

```yaml
permissions:
  contents: read
  id-token: write
```

That lets npm verify the GitHub Actions identity without storing a long-lived `NPM_TOKEN`.

## Release Workflow

For a new release:

```bash
npm run preflight
git add .
git commit -m "Release v0.2.5"
git push origin main
git tag v0.2.5
git push origin v0.2.5
```

Then publish a GitHub Release using tag `v0.2.5`.

The release event triggers the publish workflow.

## Version Rules

npm versions are immutable. If `0.2.5` has already been published, the next release must use a new version such as `0.2.6`.

Recommended version commands:

```bash
npm version patch --no-git-tag-version
npm version minor --no-git-tag-version
npm version major --no-git-tag-version
```

Then commit the version change and create the matching git tag manually.

## Supply-Chain Checklist

Before publishing:

- Keep runtime dependencies at zero when possible.
- Avoid `preinstall`, `install`, and `postinstall` scripts.
- Publish from GitHub Actions with provenance.
- Keep `package-lock.json` committed.
- Run `npm run preflight`.
- Use tags and GitHub Releases for traceability.
- Enable npm 2FA for the maintainer account when ready.

## Troubleshooting

If `npm publish` fails in CI with an authentication error:

- verify the workflow is using Node.js 24 or npm `11.5.1+`;
- verify Trusted Publisher is configured for the correct package;
- verify the workflow filename is `publish.yml`;
- verify the workflow environment is `npm`;
- verify `id-token: write` permission is present;
- verify the package name in `package.json` is `ui8px`.

If local preflight fails before `npm ci`, make sure `package-lock.json` exists:

```bash
npm install --package-lock-only
```
