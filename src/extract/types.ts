export type ClassSourceKind = 'class-attribute' | 'css-apply' | 'go-static';

export interface ClassOccurrence {
  file: string;
  line: number;
  column: number;
  raw: string;
  tokens: string[];
  kind: ClassSourceKind;
  selector?: string;
}
