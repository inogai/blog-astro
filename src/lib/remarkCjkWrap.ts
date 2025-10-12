import type { Root } from 'mdast'
import { all as cjkAll } from 'cjk-regex'
import { visit } from 'unist-util-visit'

// Known Issues: `“` `”` `‘` `’` can be used in CJK text and latin text, but they are not included in cjk-regex.
// I use 「」『』 personally so this don't affect me, but if you land here, you might want to append that to your regex
// Or you can optionally only check “‘ at front, and ’” at back so it doesn't interfere with mixed text.

const CJK_REGEX = cjkAll().toString()
const REGEX = new RegExp(`([${CJK_REGEX}])\n(?=${CJK_REGEX})`, 'g')

/** Finds all \n within CJK characters and replaces them with a space */
function processText(text: string): string {
  return text.replaceAll(REGEX, '$1')
}

/**
 * Plugin to remove line breaks between CJK characters.
 *
 * @returns Transform function.
 */
export default function remarkCjkWrap() {
  /**
   * @param {Root} tree - The markdown AST.
   */
  return (tree: Root) => {
    visit(tree, (node) => {
      if ('value' in node && typeof node.value === 'string') {
        node.value = processText(node.value)
      }
    })
  }
}
