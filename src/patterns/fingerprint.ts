import { createHash } from 'node:crypto';

export function fingerprint(value: string): string {
  return `u:${createHash('sha256').update(value).digest('hex').slice(0, 12)}`;
}
