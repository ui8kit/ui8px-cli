# Tech Brand OS Parser Fixtures

These fixtures are derived from the `tech-blog-rounded-main` reference and are intended to validate how a parser splits classes into structural, semantic, decorative, and unknown buckets.

## How To Use
1. Read a fixture file from this directory.
2. Classify each class according to `tech-brand-os-parser-contract.json`.
3. Compare the parser result to the `expected` buckets.
4. Emit warnings for any mismatches or unknown classes.

## Fixture Count
- 7 fixture(s)

## Coverage
- container shells
- hero shells
- gradient overlays
- named brand utilities such as `pill-nav` and `floating-button`
- motion utilities
