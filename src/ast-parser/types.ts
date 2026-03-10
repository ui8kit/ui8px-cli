export type AstClassBucket = 'structural' | 'semantic' | 'decorative' | 'unknown';

export interface ParserContractClassBucket {
  prefixes?: string[];
  exactUtilities?: string[];
  customUtilities?: string[];
  approvedArbitraryMatches?: Array<{
    class: string;
    mapsTo?: string;
    reason?: string;
  }>;
}

export interface ParserContract {
  id?: string;
  brandId?: string;
  stateVariantPolicy?: {
    breakpointPrefixes?: string[];
    interactionPrefixes?: string[];
    rule?: string;
  };
  attributePolicies?: Record<
    string,
    {
      category?: string;
      handling?: string;
      notes?: string[];
    }
  >;
  classes: {
    structural?: ParserContractClassBucket;
    semantic?: ParserContractClassBucket;
    decorative?: ParserContractClassBucket;
  };
  brandExceptions?: {
    structuralCustomUtilities?: Record<string, { meaning?: string; target?: string }>;
    semanticCustomUtilities?: Record<string, { meaning?: string; target?: string }>;
  };
}

export interface ParsedStyleAttribute {
  property: string;
  value: string;
  category?: string;
  handling?: string;
}

export interface ClassifiedClassToken {
  original: string;
  base: string;
  variantPrefixes: string[];
  important: boolean;
  bucket: AstClassBucket;
  matchSource: 'brand-exception' | 'approved-arbitrary' | 'exact' | 'prefix' | 'fallback' | 'unknown';
  matchedRule?: string;
}

export interface ParsedAstNode {
  type: 'element' | 'text';
  tagName?: string;
  text?: string;
  attributes?: Record<string, string>;
  styles?: ParsedStyleAttribute[];
  classes?: string[];
  classifiedClasses?: ClassifiedClassToken[];
  children?: ParsedAstNode[];
}

export interface AstParseReport {
  sourcePath: string;
  contractPath: string;
  nodes: ParsedAstNode[];
  summary: {
    nodeCount: number;
    classCount: number;
    structuralCount: number;
    semanticCount: number;
    decorativeCount: number;
    unknownCount: number;
    styleAttributeCount: number;
  };
}

export interface FixtureValidationMismatch {
  fixtureId: string;
  bucket: AstClassBucket | 'styles';
  expected: string[];
  actual: string[];
}

export interface FixtureValidationResult {
  fixtureId: string;
  title: string;
  passed: boolean;
  mismatches: FixtureValidationMismatch[];
}

export interface SuiteValidationReport {
  brandId: string;
  contractPath: string;
  fixtureSourcePath: string;
  fixtureCount: number;
  passedCount: number;
  failedCount: number;
  results: FixtureValidationResult[];
}
