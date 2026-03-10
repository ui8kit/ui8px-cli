import { parse as parseHtml, type HTMLElement, type Node, NodeType } from 'node-html-parser';
import { classifyClassToken } from './classifier.js';
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

function convertNode(node: Node, contract: ParserContract): ParsedAstNode | null {
  if (node.nodeType === NodeType.TEXT_NODE) {
    const text = node.rawText;
    if (!text.trim()) {
      return null;
    }
    return {
      type: 'text',
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
    tagName: element.tagName.toLowerCase(),
    attributes: { ...element.attributes },
    styles: parseStyleAttribute(element.getAttribute('style') ?? undefined, contract),
    classes,
    classifiedClasses: classes.map((className) => classifyClassToken(className, contract)),
    children: [],
  };

  parsedNode.children = element.childNodes
    .map((child) => convertNode(child, contract))
    .filter((child): child is ParsedAstNode => child !== null);

  return parsedNode;
}

function summarizeNodes(nodes: ParsedAstNode[]): AstParseReport['summary'] {
  let nodeCount = 0;
  let classCount = 0;
  let structuralCount = 0;
  let semanticCount = 0;
  let decorativeCount = 0;
  let unknownCount = 0;
  let styleAttributeCount = 0;

  const visit = (node: ParsedAstNode) => {
    nodeCount += 1;
    classCount += node.classifiedClasses?.length ?? 0;
    styleAttributeCount += node.styles?.length ?? 0;

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

  return {
    nodeCount,
    classCount,
    structuralCount,
    semanticCount,
    decorativeCount,
    unknownCount,
    styleAttributeCount,
  };
}

export function buildAstParseReport(sourcePath: string, contractPath: string, html: string, contract: ParserContract): AstParseReport {
  const root = parseHtml(html, {
    comment: false,
  });

  const nodes = root.childNodes
    .map((child) => convertNode(child, contract))
    .filter((child): child is ParsedAstNode => child !== null);

  return {
    sourcePath,
    contractPath,
    nodes,
    summary: summarizeNodes(nodes),
  };
}
