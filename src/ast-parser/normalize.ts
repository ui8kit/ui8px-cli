import { NormalizedNodeMatch, ParsedAstNode, ParserContract, Ui8KitCandidate } from './types.js';

interface PatternContext {
  brandId?: string;
}

interface PatternReducer {
  id: string;
  brands: string[];
  match(node: ParsedAstNode, context: PatternContext): NormalizedNodeMatch | null;
}

function getClassOriginals(node: ParsedAstNode): Set<string> {
  return new Set(node.classifiedClasses?.map((item) => item.original) ?? node.classes ?? []);
}

function getClassBases(node: ParsedAstNode): Set<string> {
  return new Set(node.classifiedClasses?.map((item) => item.base) ?? []);
}

function hasClass(node: ParsedAstNode, value: string): boolean {
  return getClassOriginals(node).has(value) || getClassBases(node).has(value);
}

function hasAllClasses(node: ParsedAstNode, values: string[]): boolean {
  return values.every((value) => hasClass(node, value));
}

function hasAnyClass(node: ParsedAstNode, values: string[]): boolean {
  return values.some((value) => hasClass(node, value));
}

function hasDecorativeClass(node: ParsedAstNode, value: string): boolean {
  return (node.classifiedClasses ?? []).some((item) => item.bucket === 'decorative' && (item.original === value || item.base === value));
}

function getTextContent(node: ParsedAstNode): string {
  if (node.type === 'text') {
    return node.text ?? '';
  }

  return (node.children ?? []).map((child) => getTextContent(child)).join(' ').replace(/\s+/g, ' ').trim();
}

function findDescendant(
  node: ParsedAstNode,
  predicate: (candidate: ParsedAstNode) => boolean,
): ParsedAstNode | undefined {
  for (const child of node.children ?? []) {
    if (predicate(child)) {
      return child;
    }
    const nested = findDescendant(child, predicate);
    if (nested) {
      return nested;
    }
  }
  return undefined;
}

function hasDescendant(node: ParsedAstNode, predicate: (candidate: ParsedAstNode) => boolean): boolean {
  return findDescendant(node, predicate) !== undefined;
}

function isElement(node: ParsedAstNode, tagName?: string): boolean {
  return node.type === 'element' && (!tagName || node.tagName === tagName);
}

function createUi8KitCandidate(component: string, role: string, props: Ui8KitCandidate['props'], notes?: string[]): Ui8KitCandidate {
  return {
    component,
    role,
    props,
    notes,
  };
}

function createMatch(
  brandId: string | undefined,
  kind: string,
  matchedBy: string,
  confidence: NormalizedNodeMatch['confidence'],
  ui8kitCandidates: Ui8KitCandidate[],
  notes?: string[],
): NormalizedNodeMatch {
  return {
    kind,
    brandId,
    matchedBy,
    confidence,
    ui8kitCandidates,
    notes,
  };
}

const restaPatterns: PatternReducer[] = [
  {
    id: 'resta-hero-photo-overlay',
    brands: ['resta-brand-os'],
    match(node, context) {
      if (!isElement(node, 'section')) return null;
      const hasHeroGeometry = hasAllClasses(node, ['relative', 'w-full']) && (hasClass(node, 'h-[75vh]') || hasClass(node, 'bg-cover'));
      const hasOverlay = hasDescendant(node, (candidate) => isElement(candidate, 'div') && hasAllClasses(candidate, ['absolute', 'inset-0']) && hasAnyClass(candidate, ['bg-gray-900/70', 'bg-black', 'bg-black/50']));
      const hasHeroHeading = hasDescendant(node, (candidate) => isElement(candidate, 'h1') && hasClass(candidate, 'font-pretty'));
      if (!hasHeroGeometry || !hasOverlay || !hasHeroHeading) return null;

      return createMatch(
        context.brandId,
        'hero-photo-overlay',
        'resta-hero-photo-overlay',
        'high',
        [
          createUi8KitCandidate('Block', 'hero-shell', { component: 'section', relative: true, dataClass: 'hero-section' }),
          createUi8KitCandidate('Box', 'hero-overlay', { absolute: true, inset: '0', dataClass: 'hero-overlay' }),
          createUi8KitCandidate('Container', 'hero-content', { max: 'w-7xl', dataClass: 'hero-content' }),
          createUi8KitCandidate('Title', 'hero-title', { order: 1, fontFamily: 'display', textColor: 'primary-foreground' }),
          createUi8KitCandidate('Button', 'hero-primary-cta', { variant: 'primary', size: 'lg' }),
        ],
        ['Background image should be preserved as media metadata or mapped into a hero image slot.'],
      );
    },
  },
  {
    id: 'resta-primary-cta-button',
    brands: ['resta-brand-os'],
    match(node, context) {
      if (!isElement(node)) return null;
      if (!['button', 'a'].includes(node.tagName ?? '')) return null;
      const isPrimaryButton =
        hasClass(node, 'inline-flex') &&
        hasClass(node, 'bg-rose-600') &&
        hasClass(node, 'text-white') &&
        hasClass(node, 'rounded-md');
      if (!isPrimaryButton) return null;

      return createMatch(
        context.brandId,
        'primary-cta-button',
        'resta-primary-cta-button',
        'high',
        [
          createUi8KitCandidate('Button', 'primary-cta', { variant: 'primary', size: 'md' }, [
            'Derive size from spacing and text scale if needed during UI8Kit mapping.',
          ]),
        ],
      );
    },
  },
  {
    id: 'resta-gradient-promo-shell',
    brands: ['resta-brand-os'],
    match(node, context) {
      if (!isElement(node, 'section')) return null;
      const isGradientPromo =
        hasClass(node, 'bg-gradient-to-r') &&
        hasAnyClass(node, ['from-rose-500', 'dark:from-rose-700']) &&
        hasAnyClass(node, ['to-pink-500', 'dark:to-pink-700']);
      if (!isGradientPromo) return null;

      return createMatch(
        context.brandId,
        'gradient-promo-shell',
        'resta-gradient-promo-shell',
        'high',
        [
          createUi8KitCandidate('Block', 'promo-shell', { component: 'section', dataClass: 'promo-section' }),
          createUi8KitCandidate('Container', 'promo-content', { max: 'w-6xl', dataClass: 'promo-content' }),
          createUi8KitCandidate('Button', 'promo-cta', { variant: 'primary' }),
        ],
        ['Gradient background should remain in the decorative brand layer during UI8Kit conversion.'],
      );
    },
  },
  {
    id: 'resta-testimonial-card',
    brands: ['resta-brand-os'],
    match(node, context) {
      if (!isElement(node, 'div')) return null;
      const isCardShell = hasClass(node, 'bg-white') && hasClass(node, 'rounded-lg') && hasClass(node, 'shadow-md');
      const hasAvatar = hasDescendant(node, (candidate) => isElement(candidate, 'img') && hasClass(candidate, 'rounded-full'));
      const hasRating = hasDescendant(node, (candidate) => hasClass(candidate, 'fill-current'));
      if (!isCardShell || !hasAvatar || !hasRating) return null;

      return createMatch(
        context.brandId,
        'testimonial-card',
        'resta-testimonial-card',
        'high',
        [
          createUi8KitCandidate('Card', 'testimonial-card', { dataClass: 'testimonial-card' }),
          createUi8KitCandidate('Group', 'testimonial-header', { items: 'center', gap: '4' }),
          createUi8KitCandidate('Text', 'testimonial-quote', { textColor: 'muted-foreground', lineHeight: 'relaxed' }),
          createUi8KitCandidate('Badge', 'testimonial-rating', { variant: 'secondary' }, [
            'Star row can be preserved as icon group instead of literal badge text.',
          ]),
        ],
      );
    },
  },
  {
    id: 'resta-menu-separator',
    brands: ['resta-brand-os'],
    match(node, context) {
      if (!isElement(node)) return null;
      const separatorLike =
        hasClass(node, 'border-dotted') &&
        hasAnyClass(node, ['border-zinc-300', 'dark:border-zinc-600']) &&
        hasAnyClass(node, ['border-t', 'h-px']);
      if (!separatorLike) return null;

      return createMatch(
        context.brandId,
        'menu-separator',
        'resta-menu-separator',
        'high',
        [
          createUi8KitCandidate('Box', 'menu-separator', { border: 't', dataClass: 'menu-separator' }),
        ],
      );
    },
  },
  {
    id: 'resta-menu-item-row',
    brands: ['resta-brand-os'],
    match(node, context) {
      if (!isElement(node, 'div')) return null;
      const heading = findDescendant(node, (candidate) => isElement(candidate, 'h4') && hasClass(candidate, 'text-xl'));
      const body = findDescendant(node, (candidate) => isElement(candidate, 'p') && hasAnyClass(candidate, ['text-zinc-600', 'dark:text-zinc-400']));
      const separator = findDescendant(node, (candidate) => hasClass(candidate, 'border-dotted'));
      if (!heading || !body || !separator) return null;

      const textContent = getTextContent(heading);
      if (!/-\s*\d/.test(textContent) && !/[₽$€]/.test(textContent)) {
        return null;
      }

      return createMatch(
        context.brandId,
        'menu-item-row',
        'resta-menu-item-row',
        'medium',
        [
          createUi8KitCandidate('Stack', 'menu-item-row', { gap: '2', dataClass: 'menu-item-row' }),
          createUi8KitCandidate('Text', 'menu-item-title', { component: 'h4', fontWeight: 'semibold' }),
          createUi8KitCandidate('Text', 'menu-item-description', { textColor: 'muted-foreground' }),
          createUi8KitCandidate('Box', 'menu-item-separator', { border: 't' }),
        ],
      );
    },
  },
];

function visitNodes(nodes: ParsedAstNode[], visitor: (node: ParsedAstNode) => void): void {
  for (const node of nodes) {
    visitor(node);
    visitNodes(node.children ?? [], visitor);
  }
}

function getReducersForBrand(brandId?: string): PatternReducer[] {
  if (!brandId) {
    return [];
  }
  return [...restaPatterns].filter((pattern) => pattern.brands.includes(brandId));
}

export function normalizeAstNodes(nodes: ParsedAstNode[], contract: ParserContract): void {
  const brandId = contract.brandId;
  const reducers = getReducersForBrand(brandId);
  if (reducers.length === 0) {
    return;
  }

  visitNodes(nodes, (node) => {
    const matches = reducers
      .map((reducer) => reducer.match(node, { brandId }))
      .filter((match): match is NormalizedNodeMatch => match !== null);

    if (matches.length > 0) {
      node.normalized = matches;
    }
  });
}
