import { ClassifiedClassToken, ParserContract, ParserContractClassBucket } from './types.js';

const FALLBACK_STRUCTURAL_EXACT = new Set(['border', 'border-0', 'border-2', 'border-4', 'border-t', 'border-b', 'border-l', 'border-r', 'border-x', 'border-y', 'transform']);
const FALLBACK_SEMANTIC_EXACT = new Set(['outline-none', 'transition', 'transition-all', 'transition-colors', 'transition-transform', 'antialiased', 'bg-transparent']);
const FALLBACK_SEMANTIC_PREFIXES = ['ring-', 'ring-offset-', 'outline-', 'duration-', 'ease-', 'font-', 'text-', 'rounded-', 'shadow-'];
const FALLBACK_DECORATIVE_EXACT = new Set(['bg-black']);
const FALLBACK_DECORATIVE_PREFIXES = ['bg-gradient-to-', 'from-', 'via-', 'to-', 'opacity-', 'bg-opacity-', 'bg-black/', 'bg-gray-', 'bg-zinc-'];

function getMatchCandidates(original: string, base: string): string[] {
  if (original === base) {
    return [base];
  }
  return [original, base];
}

function includesExact(candidates: string[], values: string[] | undefined): string | undefined {
  if (!values) {
    return undefined;
  }
  for (const candidate of candidates) {
    if (values.includes(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

function matchesPrefix(candidates: string[], prefixes: string[] | undefined): string | undefined {
  if (!prefixes) {
    return undefined;
  }
  for (const candidate of candidates) {
    for (const prefix of prefixes) {
      if (candidate.startsWith(prefix)) {
        return prefix;
      }
    }
  }
  return undefined;
}

function matchesApprovedArbitrary(
  candidates: string[],
  values: ParserContractClassBucket['approvedArbitraryMatches'],
): string | undefined {
  if (!values) {
    return undefined;
  }
  for (const candidate of candidates) {
    const match = values.find((item) => item.class === candidate);
    if (match) {
      return match.class;
    }
  }
  return undefined;
}

function splitVariantPrefixes(token: string): { base: string; variantPrefixes: string[]; important: boolean } {
  const parts = token.split(':');
  const rawBase = parts[parts.length - 1] ?? token;
  const important = rawBase.startsWith('!');
  const base = important ? rawBase.slice(1) : rawBase;

  return {
    base,
    variantPrefixes: parts.slice(0, -1),
    important,
  };
}

function classifyFromContract(
  candidates: string[],
  contract: ParserContract,
): { bucket: ClassifiedClassToken['bucket']; matchSource: ClassifiedClassToken['matchSource']; matchedRule?: string } | null {
  const structuralExceptions = contract.brandExceptions?.structuralCustomUtilities ?? {};
  const semanticExceptions = contract.brandExceptions?.semanticCustomUtilities ?? {};

  const structuralExceptionMatch = candidates.find((candidate) => candidate in structuralExceptions);
  if (structuralExceptionMatch) {
    return { bucket: 'structural', matchSource: 'brand-exception', matchedRule: structuralExceptionMatch };
  }

  const semanticExceptionMatch = candidates.find((candidate) => candidate in semanticExceptions);
  if (semanticExceptionMatch) {
    return { bucket: 'semantic', matchSource: 'brand-exception', matchedRule: semanticExceptionMatch };
  }

  const structuralBucket = contract.classes.structural;
  const semanticBucket = contract.classes.semantic;
  const decorativeBucket = contract.classes.decorative;

  const structuralApproved = matchesApprovedArbitrary(candidates, structuralBucket?.approvedArbitraryMatches);
  if (structuralApproved) {
    return { bucket: 'structural', matchSource: 'approved-arbitrary', matchedRule: structuralApproved };
  }

  const semanticApproved = matchesApprovedArbitrary(candidates, semanticBucket?.approvedArbitraryMatches);
  if (semanticApproved) {
    return { bucket: 'semantic', matchSource: 'approved-arbitrary', matchedRule: semanticApproved };
  }

  const structuralExact = includesExact(candidates, structuralBucket?.exactUtilities);
  if (structuralExact) {
    return { bucket: 'structural', matchSource: 'exact', matchedRule: structuralExact };
  }

  const structuralCustomUtility = includesExact(candidates, structuralBucket?.customUtilities);
  if (structuralCustomUtility) {
    return { bucket: 'structural', matchSource: 'exact', matchedRule: structuralCustomUtility };
  }

  const semanticExact = includesExact(candidates, semanticBucket?.exactUtilities);
  if (semanticExact) {
    return { bucket: 'semantic', matchSource: 'exact', matchedRule: semanticExact };
  }

  const semanticCustomUtility = includesExact(candidates, semanticBucket?.customUtilities);
  if (semanticCustomUtility) {
    return { bucket: 'semantic', matchSource: 'exact', matchedRule: semanticCustomUtility };
  }

  const decorativeExact = includesExact(candidates, decorativeBucket?.exactUtilities);
  if (decorativeExact) {
    return { bucket: 'decorative', matchSource: 'exact', matchedRule: decorativeExact };
  }

  const structuralPrefix = matchesPrefix(candidates, structuralBucket?.prefixes);
  if (structuralPrefix) {
    return { bucket: 'structural', matchSource: 'prefix', matchedRule: structuralPrefix };
  }

  const decorativePrefix = matchesPrefix(candidates, decorativeBucket?.prefixes);
  if (decorativePrefix) {
    return { bucket: 'decorative', matchSource: 'prefix', matchedRule: decorativePrefix };
  }

  const semanticPrefix = matchesPrefix(candidates, semanticBucket?.prefixes);
  if (semanticPrefix) {
    return { bucket: 'semantic', matchSource: 'prefix', matchedRule: semanticPrefix };
  }

  return null;
}

function classifyFromFallbacks(
  candidates: string[],
): { bucket: ClassifiedClassToken['bucket']; matchSource: ClassifiedClassToken['matchSource']; matchedRule?: string } | null {
  for (const candidate of candidates) {
    if (FALLBACK_STRUCTURAL_EXACT.has(candidate)) {
      return { bucket: 'structural', matchSource: 'fallback', matchedRule: candidate };
    }
    if (FALLBACK_SEMANTIC_EXACT.has(candidate)) {
      return { bucket: 'semantic', matchSource: 'fallback', matchedRule: candidate };
    }
    if (FALLBACK_SEMANTIC_PREFIXES.some((prefix) => candidate.startsWith(prefix))) {
      const prefix = FALLBACK_SEMANTIC_PREFIXES.find((item) => candidate.startsWith(item));
      return { bucket: 'semantic', matchSource: 'fallback', matchedRule: prefix };
    }
    if (FALLBACK_DECORATIVE_EXACT.has(candidate)) {
      return { bucket: 'decorative', matchSource: 'fallback', matchedRule: candidate };
    }
    if (FALLBACK_DECORATIVE_PREFIXES.some((prefix) => candidate.startsWith(prefix))) {
      const prefix = FALLBACK_DECORATIVE_PREFIXES.find((item) => candidate.startsWith(item));
      return { bucket: 'decorative', matchSource: 'fallback', matchedRule: prefix };
    }
  }

  return null;
}

export function classifyClassToken(token: string, contract: ParserContract): ClassifiedClassToken {
  const trimmed = token.trim();
  const { base, variantPrefixes, important } = splitVariantPrefixes(trimmed);
  const candidates = getMatchCandidates(trimmed, base);

  const contractMatch = classifyFromContract(candidates, contract);
  if (contractMatch) {
    return {
      original: trimmed,
      base,
      variantPrefixes,
      important,
      bucket: contractMatch.bucket,
      matchSource: contractMatch.matchSource,
      matchedRule: contractMatch.matchedRule,
    };
  }

  const fallbackMatch = classifyFromFallbacks(candidates);
  if (fallbackMatch) {
    return {
      original: trimmed,
      base,
      variantPrefixes,
      important,
      bucket: fallbackMatch.bucket,
      matchSource: fallbackMatch.matchSource,
      matchedRule: fallbackMatch.matchedRule,
    };
  }

  return {
    original: trimmed,
    base,
    variantPrefixes,
    important,
    bucket: 'unknown',
    matchSource: 'unknown',
  };
}
