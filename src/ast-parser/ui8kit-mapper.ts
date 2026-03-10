import { ParsedAstNode, Ui8KitAstNode, Ui8KitMappingFragment } from './types.js';

function componentNode(
  component: string,
  props: Record<string, string | number | boolean | Array<string | number | boolean>> = {},
  children: Ui8KitAstNode[] = [],
  notes?: string[],
): Ui8KitAstNode {
  return {
    type: 'component',
    component,
    props,
    children,
    notes,
  };
}

function textNode(value: string): Ui8KitAstNode {
  return {
    type: 'text',
    value,
  };
}

function isElement(node: ParsedAstNode, tagName?: string): boolean {
  return node.type === 'element' && (!tagName || node.tagName === tagName);
}

function getTextContent(node: ParsedAstNode): string {
  if (node.type === 'text') {
    return node.text?.replace(/\s+/g, ' ').trim() ?? '';
  }

  return (node.children ?? [])
    .map((child) => getTextContent(child))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findDescendant(node: ParsedAstNode, predicate: (candidate: ParsedAstNode) => boolean): ParsedAstNode | undefined {
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

function findDescendants(node: ParsedAstNode, predicate: (candidate: ParsedAstNode) => boolean): ParsedAstNode[] {
  const matches: ParsedAstNode[] = [];

  const visit = (candidate: ParsedAstNode) => {
    if (predicate(candidate)) {
      matches.push(candidate);
    }
    for (const child of candidate.children ?? []) {
      visit(child);
    }
  };

  for (const child of node.children ?? []) {
    visit(child);
  }

  return matches;
}

function hasClass(node: ParsedAstNode, value: string): boolean {
  return (node.classifiedClasses ?? []).some((item) => item.original === value || item.base === value);
}

function extractBackgroundImage(node: ParsedAstNode): string | null {
  const backgroundImage = (node.styles ?? []).find((style) => style.property === 'background-image');
  return backgroundImage?.value ?? null;
}

function extractFirstTextByTag(node: ParsedAstNode, tagName: string): string | null {
  const match = findDescendant(node, (candidate) => isElement(candidate, tagName));
  if (!match) {
    return null;
  }
  const value = getTextContent(match);
  return value || null;
}

function extractButtonText(node: ParsedAstNode): string | null {
  const match = findDescendant(node, (candidate) => isElement(candidate, 'button') || isElement(candidate, 'a'));
  if (!match) {
    return null;
  }
  const value = getTextContent(match);
  return value || null;
}

function extractHeroPhotoOverlay(node: ParsedAstNode): Ui8KitMappingFragment {
  const title = extractFirstTextByTag(node, 'h1');
  const description = extractFirstTextByTag(node, 'p');
  const primaryCta = extractButtonText(node);
  const backgroundImage = extractBackgroundImage(node);

  return {
    kind: 'hero-photo-overlay',
    sourcePath: node.path,
    sourceTagName: node.tagName,
    confidence: 'high',
    extracted: {
      title,
      description,
      primaryCta,
      backgroundImage,
    },
    ast: componentNode('Block', {
      component: 'section',
      relative: true,
      py: '16',
      'data-class': 'hero-section',
    }, [
      componentNode('Box', {
        absolute: true,
        inset: '0',
        'data-class': 'hero-overlay',
      }),
      componentNode('Container', {
        max: 'w-7xl',
        'data-class': 'hero-content',
      }, [
        componentNode('Stack', {
          gap: '4',
          items: 'center',
          'data-class': 'hero-copy',
        }, [
          componentNode('Title', {
            order: 1,
            fontSize: '5xl',
            textAlign: 'center',
            textColor: 'primary-foreground',
            'data-class': 'hero-title',
          }, title ? [textNode(title)] : []),
          componentNode('Text', {
            fontSize: 'lg',
            textAlign: 'center',
            textColor: 'muted-foreground',
            lineHeight: 'relaxed',
            'data-class': 'hero-description',
          }, description ? [textNode(description)] : []),
          componentNode('Group', {
            gap: '4',
            justify: 'center',
            items: 'center',
            'data-class': 'hero-actions',
          }, [
            componentNode('Button', {
              variant: 'primary',
              size: 'lg',
              'data-class': 'hero-cta-primary',
            }, primaryCta ? [textNode(primaryCta)] : []),
          ]),
        ]),
      ]),
    ], [
      'Preserve the background image as a media asset or slot during full UI8Kit conversion.',
    ]),
  };
}

function extractPrimaryCtaButton(node: ParsedAstNode): Ui8KitMappingFragment {
  const label = getTextContent(node);

  return {
    kind: 'primary-cta-button',
    sourcePath: node.path,
    sourceTagName: node.tagName,
    confidence: 'high',
    extracted: {
      label,
    },
    ast: componentNode('Button', {
      variant: 'primary',
      size: 'md',
      'data-class': 'button-primary',
    }, label ? [textNode(label)] : []),
  };
}

function extractGradientPromoShell(node: ParsedAstNode): Ui8KitMappingFragment {
  const title = extractFirstTextByTag(node, 'h2');
  const description = extractFirstTextByTag(node, 'p');
  const buttons = findDescendants(node, (candidate) => isElement(candidate, 'button') || isElement(candidate, 'a'))
    .map((candidate) => getTextContent(candidate))
    .filter(Boolean);

  return {
    kind: 'gradient-promo-shell',
    sourcePath: node.path,
    sourceTagName: node.tagName,
    confidence: 'high',
    extracted: {
      title,
      description,
      buttons,
    },
    ast: componentNode('Block', {
      component: 'section',
      py: '16',
      'data-class': 'promo-section',
    }, [
      componentNode('Container', {
        max: 'w-6xl',
        'data-class': 'promo-content',
      }, [
        componentNode('Stack', {
          gap: '4',
          items: 'center',
          'data-class': 'promo-copy',
        }, [
          componentNode('Title', {
            order: 2,
            fontSize: '4xl',
            textAlign: 'center',
            textColor: 'primary-foreground',
            'data-class': 'promo-title',
          }, title ? [textNode(title)] : []),
          componentNode('Text', {
            fontSize: 'lg',
            textAlign: 'center',
            textColor: 'primary-foreground',
            lineHeight: 'relaxed',
            'data-class': 'promo-description',
          }, description ? [textNode(description)] : []),
          componentNode('Group', {
            gap: '4',
            justify: 'center',
            items: 'center',
            'data-class': 'promo-actions',
          }, buttons.map((buttonLabel, index) =>
            componentNode('Button', {
              variant: index === 0 ? 'primary' : 'outline',
              size: 'lg',
              'data-class': index === 0 ? 'promo-cta-primary' : 'promo-cta-secondary',
            }, [textNode(buttonLabel)]),
          )),
        ]),
      ]),
    ], [
      'Keep the rose/pink gradient in a decorative brand layer instead of forcing it into the system token layer.',
    ]),
  };
}

function extractTestimonialCard(node: ParsedAstNode): Ui8KitMappingFragment {
  const author = extractFirstTextByTag(node, 'h4');
  const role = findDescendants(node, (candidate) => isElement(candidate, 'p') && hasClass(candidate, 'text-sm'))
    .map((candidate) => getTextContent(candidate))
    .find(Boolean) ?? null;
  const quote = findDescendants(node, (candidate) => isElement(candidate, 'p') && !hasClass(candidate, 'text-sm'))
    .map((candidate) => getTextContent(candidate))
    .find((value) => value.length > 40) ?? null;
  const ratingCount = findDescendants(node, (candidate) => hasClass(candidate, 'fill-current')).length;

  return {
    kind: 'testimonial-card',
    sourcePath: node.path,
    sourceTagName: node.tagName,
    confidence: 'high',
    extracted: {
      author,
      role,
      quote,
      ratingCount,
    },
    ast: componentNode('Card', {
      'data-class': 'testimonial-card',
    }, [
      componentNode('Stack', {
        gap: '4',
        'data-class': 'testimonial-content',
      }, [
        componentNode('Group', {
          gap: '4',
          items: 'center',
          'data-class': 'testimonial-header',
        }, [
          componentNode('Stack', {
            gap: '1',
            'data-class': 'testimonial-meta',
          }, [
            componentNode('Text', {
              component: 'p',
              fontWeight: 'semibold',
              'data-class': 'testimonial-author',
            }, author ? [textNode(author)] : []),
            componentNode('Text', {
              component: 'p',
              fontSize: 'sm',
              textColor: 'muted-foreground',
              'data-class': 'testimonial-role',
            }, role ? [textNode(role)] : []),
          ]),
        ]),
        componentNode('Text', {
          component: 'p',
          textColor: 'muted-foreground',
          lineHeight: 'relaxed',
          'data-class': 'testimonial-quote',
        }, quote ? [textNode(quote)] : []),
        componentNode('Text', {
          component: 'p',
          fontSize: 'sm',
          textColor: 'primary',
          'data-class': 'testimonial-rating',
        }, ratingCount ? [textNode(`${ratingCount} star rating`)] : []),
      ]),
    ]),
  };
}

function extractMenuSeparator(node: ParsedAstNode): Ui8KitMappingFragment {
  return {
    kind: 'menu-separator',
    sourcePath: node.path,
    sourceTagName: node.tagName,
    confidence: 'high',
    ast: componentNode('Box', {
      border: 't',
      'data-class': 'menu-separator',
    }),
  };
}

function parseMenuHeading(raw: string | null): { title: string | null; price: string | null } {
  if (!raw) {
    return { title: null, price: null };
  }

  const match = raw.match(/^(.*?)(?:\s+-\s+)([^-]*[₽$€].*)$/);
  if (!match) {
    return { title: raw, price: null };
  }

  return {
    title: match[1]?.trim() ?? raw,
    price: match[2]?.trim() ?? null,
  };
}

function extractMenuItemRow(node: ParsedAstNode): Ui8KitMappingFragment {
  const headingText = extractFirstTextByTag(node, 'h4');
  const { title, price } = parseMenuHeading(headingText);
  const description = extractFirstTextByTag(node, 'p');

  return {
    kind: 'menu-item-row',
    sourcePath: node.path,
    sourceTagName: node.tagName,
    confidence: 'medium',
    extracted: {
      title,
      price,
      description,
    },
    ast: componentNode('Stack', {
      gap: '2',
      'data-class': 'menu-item-row',
    }, [
      componentNode('Group', {
        justify: 'between',
        items: 'center',
        gap: '4',
        'data-class': 'menu-item-head',
      }, [
        componentNode('Text', {
          component: 'h4',
          fontSize: 'xl',
          fontWeight: 'semibold',
          'data-class': 'menu-item-title',
        }, title ? [textNode(title)] : []),
        componentNode('Text', {
          component: 'span',
          fontSize: 'sm',
          fontWeight: 'semibold',
          textColor: 'primary',
          'data-class': 'menu-item-price',
        }, price ? [textNode(price)] : []),
      ]),
      componentNode('Text', {
        component: 'p',
        textColor: 'muted-foreground',
        'data-class': 'menu-item-description',
      }, description ? [textNode(description)] : []),
      componentNode('Box', {
        border: 't',
        'data-class': 'menu-item-separator',
      }),
    ]),
  };
}

function createFragmentFromMatch(node: ParsedAstNode, kind: string): Ui8KitMappingFragment | null {
  if (kind === 'hero-photo-overlay') return extractHeroPhotoOverlay(node);
  if (kind === 'primary-cta-button') return extractPrimaryCtaButton(node);
  if (kind === 'gradient-promo-shell') return extractGradientPromoShell(node);
  if (kind === 'testimonial-card') return extractTestimonialCard(node);
  if (kind === 'menu-separator') return extractMenuSeparator(node);
  if (kind === 'menu-item-row') return extractMenuItemRow(node);
  return null;
}

function visitNodes(nodes: ParsedAstNode[], visitor: (node: ParsedAstNode) => void): void {
  for (const node of nodes) {
    visitor(node);
    visitNodes(node.children ?? [], visitor);
  }
}

export function buildUi8KitMappings(nodes: ParsedAstNode[]): Ui8KitMappingFragment[] {
  const mappings: Ui8KitMappingFragment[] = [];

  visitNodes(nodes, (node) => {
    for (const match of node.normalized ?? []) {
      const fragment = createFragmentFromMatch(node, match.kind);
      if (fragment) {
        mappings.push(fragment);
      }
    }
  });

  return mappings;
}
