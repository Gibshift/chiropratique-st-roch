function extractNodes(node: any): string {
  if (!node) return ''

  if (node.type === 'text') {
    return node.text ?? ''
  }

  if (Array.isArray(node.children)) {
    const childText = node.children.map(extractNodes).join('')
    const block = ['paragraph', 'heading', 'listitem', 'quote'].includes(node.type)
    return block ? childText + ' ' : childText
  }

  return ''
}

export function extractLexicalText(content: any, maxChars = 800): string {
  if (!content?.root) return ''
  return extractNodes(content.root).replace(/\s+/g, ' ').trim().slice(0, maxChars)
}
