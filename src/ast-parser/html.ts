import { parse as parseHtml, type HTMLElement, type Node, NodeType } from 'node-html-parser';
import { classifyClassToken } from './classifier.js';
import { normalizeAstNodes } from './normalize.js';
import { buildUi8KitMappings } from './ui8kit-mapper.js';
import { AstParseReport, ParsedAstNode, ParsedStyleAttribute, ParserContract } from './types.js';

function parseStyleAttribute(
  styleValue: string | undefined,
  contract: ParserContract,
): ParsedStyleAttribute[] {
  if (!styleValue) {
    return [];
  }

  const parsed: ParsedStyleAttribute[] = [];

  for (const rawEntry of styleValue.split(';')) {
    const entry = rawEntry.trim();
    if (!entry) {
      continue;
    }

    const [propertyPart, ...valueParts] = entry.split(':');
    const property = propertyPart?.trim();
    const value = valueParts.join(':').trim();
    if (!property) {
      continue;
    }

    const attributeKey = `style.${property}`;
    const policy = contract.attributePolicies?.[attributeKey];

    parsed.push({
      property,
      value,
      category: policy?.category,
      handling: policy?.handling,
    });
  }

  return parsed;
}

function convertNode(node: Node, contract: ParserContract, path: string): ParsedAstNode | null {
  if (node.nodeType === NodeType.TEXT_NODE) {
    const text = node.rawText;
    if (!text.trim()) {
      return null;
    }
    return {
      type: 'text',
      path,
      text,
    };
  }

  if (node.nodeType !== NodeType.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const classes = (element.getAttribute('class') ?? '')
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const parsedNode: ParsedAstNode = {
    type: 'element',
    path,
    tagName: element.tagName.toLowerCase(),
    attributes: { ...element.attributes },
    styles: parseStyleAttribute(element.getAttribute('style') ?? undefined, contract),
    classes,
    classifiedClasses: classes.map((className) => classifyClassToken(className, contract)),
    children: [],
  };

  parsedNode.children = element.childNodes
    .map((child, index) => convertNode(child, contract, `${path}.${index}`))
    .filter((child): child is ParsedAstNode => child !== null);

  return parsedNode;
}

function summarizeNodes(nodes: ParsedAstNode[], ui8kitMappings: AstParseReport['ui8kitMappings']): AstParseReport['summary'] {
  let nodeCount = 0;
  let classCount = 0;
  let structuralCount = 0;
  let semanticCount = 0;
  let decorativeCount = 0;
  let unknownCount = 0;
  let styleAttributeCount = 0;
  let normalizedNodeCount = 0;
  let normalizedMatchCount = 0;
  const matchedKinds: Record<string, number> = {};
  const ui8kitMappedKinds: Record<string, number> = {};

  const visit = (node: ParsedAstNode) => {
    nodeCount += 1;
    classCount += node.classifiedClasses?.length ?? 0;
    styleAttributeCount += node.styles?.length ?? 0;
    if ((node.normalized?.length ?? 0) > 0) {
      normalizedNodeCount += 1;
      normalizedMatchCount += node.normalized?.length ?? 0;
      for (const match of node.normalized ?? []) {
        matchedKinds[match.kind] = (matchedKinds[match.kind] ?? 0) + 1;
      }
    }

    for (const classified of node.classifiedClasses ?? []) {
      if (classified.bucket === 'structural') structuralCount += 1;
      else if (classified.bucket === 'semantic') semanticCount += 1;
      else if (classified.bucket === 'decorative') decorativeCount += 1;
      else unknownCount += 1;
    }

    for (const child of node.children ?? []) {
      visit(child);
    }
  };

  nodes.forEach(visit);

  for (const mapping of ui8kitMappings) {
    ui8kitMappedKinds[mapping.kind] = (ui8kitMappedKinds[mapping.kind] ?? 0) + 1;
  }

  return {
    nodeCount,
    classCount,
    structuralCount,
    semanticCount,
    decorativeCount,
    unknownCount,
    styleAttributeCount,
    normalizedNodeCount,
    normalizedMatchCount,
    matchedKinds,
    ui8kitMappingCount: ui8kitMappings.length,
    ui8kitMappedKinds,
  };
}

export function buildAstParseReport(sourcePath: string, contractPath: string, html: string, contract: ParserContract): AstParseReport {
  const root = parseHtml(html, {
    comment: false,
  });

  const nodes = root.childNodes
    .map((child, index) => convertNode(child, contract, `${index}`))
    .filter((child): child is ParsedAstNode => child !== null);

  normalizeAstNodes(nodes, contract);
  const ui8kitMappings = buildUi8KitMappings(nodes);

  return {
    sourcePath,
    contractPath,
    brandId: contract.brandId,
    nodes,
    ui8kitMappings,
    summary: summarizeNodes(nodes, ui8kitMappings),
  };
}
