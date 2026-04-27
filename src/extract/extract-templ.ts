import { extractHtmlClasses } from './extract-html.js';
import { ClassOccurrence } from './types.js';

export function extractTemplClasses(file: string, content: string): ClassOccurrence[] {
  return extractHtmlClasses(file, content);
}
