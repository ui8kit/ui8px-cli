# Scripts

## `node-artifact-cleaner.sh`

`node-artifact-cleaner.sh` performs a recursive cleanup of common Node.js, Bun, and Turbo workspace artifacts from the repository root.

### Run

From the repository root:

```sh
bash scripts/node-artifact-cleaner.sh
```

Preview without deleting anything:

```sh
bash scripts/node-artifact-cleaner.sh --dry-run
```

Run without the interactive confirmation prompt:

```sh
bash scripts/node-artifact-cleaner.sh --yes
```

Preview without deleting anything and without prompts:

```sh
bash scripts/node-artifact-cleaner.sh --dry-run --yes
```

Show built-in help:

```sh
bash scripts/node-artifact-cleaner.sh --help
```

The script prints the detected root directory and asks for confirmation before deleting anything. In `--dry-run` mode it prints what would be removed without making changes. With `--yes`, confirmation is skipped.

### What it removes

- `**/node_modules`
- `**/dist`
- `**/.next`
- `**/.nuxt`
- `**/.svelte-kit`
- `**/.parcel-cache`
- `**/coverage`
- `**/.cache`
- `**/.turbo`
- `**/*.tsbuildinfo`
- `**/bun.lock`
- `**/bun.lockb`
- `**/package-lock.json`
- `**/yarn.lock`
- `**/pnpm-lock.yaml`

### Safety checks

- The script only runs if it is located at `scripts/node-artifact-cleaner.sh`.
- The workspace root is resolved from the script location.
- Cleanup starts only after the user confirms with `YES` or `Y`.
- `--dry-run` previews all matched files and directories without deleting them.
- `--yes` skips the interactive confirmation prompt.
- `--help` prints the built-in usage information.

### Internal functions

- `remove_path()`: removes a directory or path match and increments the deleted items counter.
- `remove_file()`: removes a file match and increments the deleted items counter.

### Implementation notes

- Directory cleanup runs first so large generated folders are removed in a single pass.
- File cleanup uses `find ... -prune` to skip traversing directories that are already scheduled for deletion.
- Removed paths are printed relative to the workspace root for easier review.
