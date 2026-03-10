export type StringMap = Record<string, string>;
export type CssDeclarationMap = Record<string, string>;

export interface AliasColorToken {
  light: string;
  dark: string;
  aliases?: string[];
  referenceAliases?: string[];
}

export interface BrandOsUtilityRecipe {
  className: string;
  declarations: CssDeclarationMap;
  pseudoDeclarations?: Record<string, CssDeclarationMap>;
}

export interface BrandOsAnimationKeyframes {
  [step: string]: CssDeclarationMap;
}

export interface BrandOsAnimationUtility {
  className: string;
  keyframe: string;
  animation: string;
  reducedMotion?: boolean;
}

export interface BrandOsStaggerUtilities {
  classPrefix?: string;
  delays: string[];
  declarations?: CssDeclarationMap;
  reducedMotion?: boolean;
}

export interface BrandOsCategoryUtilityConfig {
  enabled?: boolean;
  classPrefix?: string;
  textColor?: string;
  includeCanonicalTokenClass?: boolean;
  aliasFields?: Array<'aliases' | 'referenceAliases'>;
}

export interface BrandOsThemeEmitConfig {
  bodyApplyClasses?: string[];
  bodyFontFamilyKey?: string;
  headingSelectors?: string[];
  headingFontFamilyKey?: string;
  headingLetterSpacing?: string;
  utilityRecipes?: BrandOsUtilityRecipe[];
  keyframes?: Record<string, BrandOsAnimationKeyframes>;
  animationUtilities?: BrandOsAnimationUtility[];
  staggerUtilities?: BrandOsStaggerUtilities;
  categoryUtilities?: BrandOsCategoryUtilityConfig;
  reducedMotion?: {
    extraSelectors?: string[];
    resetDeclarations?: CssDeclarationMap;
  };
}

export interface BrandOsDocsEmitConfig {
  generatedKitTitle?: string;
  promptTitlePrefix?: string;
  promptIntro?: string;
  promptAttachFiles?: string[];
  parserFixtureTitle?: string;
  parserFixtureReference?: string;
}

export interface BrandOsTailwindEmitConfig {
  exportName?: string;
  includeAnimationUtilities?: boolean;
}

export interface BrandOsCompanionPathsConfig {
  promptPackSuffix?: string;
  parserContractSuffix?: string;
  fixturesSuffix?: string;
  generatedDirSuffix?: string;
}

export interface BrandOsEmitConfig {
  companionPaths?: BrandOsCompanionPathsConfig;
  theme?: BrandOsThemeEmitConfig;
  docs?: BrandOsDocsEmitConfig;
  tailwind?: BrandOsTailwindEmitConfig;
}

export interface BrandOsSchema {
  meta: {
    name: string;
    description?: string;
    slug?: string;
  };
  emit?: BrandOsEmitConfig;
  brandThesis?: {
    summary?: string;
    promise?: string;
    positioning?: string;
    personality?: string[];
    antiPersonality?: string[];
    voice?: {
      tone?: string[];
      avoid?: string[];
    };
  };
  tokens: {
    color: {
      light: StringMap;
      dark: StringMap;
      categories?: Record<string, AliasColorToken>;
      charts?: Record<string, string>;
    };
    typography: {
      families: StringMap;
      weights?: Record<string, number>;
      sizes?: StringMap;
      lineHeights?: Record<string, number | string>;
      tracking?: StringMap;
      surfaceOverrides?: Record<string, StringMap>;
    };
    spacing?: {
      baseUnit?: number;
      scale?: StringMap;
      sectionRhythm?: StringMap;
      container?: StringMap;
    };
    radius: StringMap;
    shadow: StringMap;
    motion?: {
      durations?: StringMap;
      easings?: StringMap;
      presets?: Record<string, Record<string, string | number | boolean>>;
      reducedMotion?: Record<string, boolean>;
    };
  };
  designGrammar?: {
    densityModes?: StringMap;
    shapeLanguage?: {
      core?: string;
    };
    surfaceLanguage?: {
      base?: string;
      depthRule?: string;
      accentRule?: string;
      contrastRule?: string;
    };
    imageTreatment?: {
      style?: string;
      preferred?: string[];
      avoid?: string[];
    };
    contentVoice?: {
      adjectives?: string[];
      avoid?: string[];
    };
  };
  componentPolicy?: {
    keepStandard?: string[];
    wrapEarly?: string[];
    customBlocks?: string[];
    rawHtmlAllowedFor?: string[];
    avoid?: string[];
  };
  recipes?: {
    pageArchetypes?: Record<string, { purpose?: string; requiredSections?: string[] }>;
    sectionArchetypes?: Record<string, { purpose?: string; requiredSlots?: string[]; fixedTraits?: string[] }>;
  };
}

export interface PromptPackSurface {
  goal: string;
  requiredInputs: string[];
  optionalInputs?: string[];
  sectionExpectations?: string[];
  surfaceOverrides?: string[];
  deliverables?: string[];
  promptTemplate: string[];
  auditChecklist?: string[];
}

export interface PromptPack {
  sharedContext: {
    brandSummary: string;
    styleKeywords?: string[];
    negativeStyleKeywords?: string[];
    crossSurfaceRules?: string[];
    implementationBias?: {
      preferredStack?: string;
      systemLayer?: string[];
      brandLayer?: string[];
    };
    motionBias?: {
      defaultLevel?: string;
      allowedEscalation?: string[];
      forbiddenWithoutJustification?: string[];
    };
  };
  surfaces: Record<string, PromptPackSurface>;
  auditPromptAddendum?: string[];
}

export interface ParserFixtureExpected {
  structural: string[];
  semantic: string[];
  decorative: string[];
  unknown?: string[];
}

export interface ParserFixture {
  id: string;
  title: string;
  sourceFile: string;
  description: string;
  classes: string[];
  expected: ParserFixtureExpected;
  notes?: string[];
}

export interface ParserFixtureSource {
  schemaVersion: string;
  brandId: string;
  referenceProjectName?: string;
  fixtures: ParserFixture[];
}

export interface BrandOsResolvedPaths {
  schemaPath: string;
  promptPackPath: string;
  parserContractPath: string;
  fixturesPath: string;
  emitDir: string;
  schemaFileName: string;
}
