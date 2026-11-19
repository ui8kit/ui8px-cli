export interface ValidateGridViolation {
  className: string;
  property: string;
  rawValue: string;
  resolvedPx: number;
  /** the scope that decided the unit (layout: 8px, control: 4px) */
  scope?: string;
  reason: string;
}

export interface ValidateGridSummary {
  classesChecked: number;
  declarationsChecked: number;
  violations: ValidateGridViolation[];
}

export interface ValidateGridOptions {
  design: 'grid';
  input: string;
  output: string;
  spacingBase: number;
  rootFontSize: number;
  scope?: 'layout' | 'control';
  verbose: boolean;
}

export interface ValidateGridBacklog {
  meta: {
    input: string;
    output: string;
    design: string;
    spacingBase: number;
    rootFontSize: number;
    generatedAt: string;
    classesScanned: number;
    declarationsScanned: number;
  };
  summary: {
    classesChecked: number;
    declarationsChecked: number;
    violations: number;
  };
  violations: ValidateGridViolation[];
}
