import 'element-closest' // To polyfill Element.closest() if required
import * as Models from 'alpheios-data-models'
import TextSelector from '../text-selector'
import MediaSelector from './media-selector'

export default class HTMLSelector extends MediaSelector {
  constructor (target, defaultLanguageCode) {
    super(target)
    this.defaultLanguageCode = defaultLanguageCode

    this.wordSeparator = new Map()
    this.wordSeparator.set(Models.Constants.LANG_UNIT_WORD, this.doSpaceSeparatedWordSelection.bind(this))
    this.wordSeparator.set(Models.Constants.LANG_UNIT_CHAR, this.doCharacterBasedWordSelection.bind(this))
  }

  static getSelector (target, defaultLanguageCode) {
    return new HTMLSelector(target, defaultLanguageCode).createTextSelector()
  }

  createTextSelector () {
    let wordSelector = new TextSelector()
    wordSelector.languageCode = this.getLanguageCode(this.defaultLanguageCode)
    wordSelector.language = this.getLanguage(wordSelector.languageCode)

    if (this.wordSeparator.has(wordSelector.language.baseUnit)) {
      wordSelector = this.wordSeparator.get(wordSelector.language.baseUnit)(wordSelector)
    } else {
      console.warn(`No word separator function found for a "${wordSelector.language.baseUnit}" base unit`)
    }
    return wordSelector
  }

  /**
   * Returns a language code of a text piece defined by target. Scans for a `lang` attribute of a selection target
   * or, if not found, all parents of a target.
   * @return {string | undefined} Language code of a text piece or undefined if language cannot be determined.
   */
  getLanguageCodeFromSource () {
    let languageCode = this.target.getAttribute('lang') || this.target.getAttribute('xml:lang')
    if (!languageCode) {
      // If no attribute of target element found, check its ancestors
      let closestLangElement = this.target.closest('[lang]') || this.target.closest('[xml\\:lang]')
      if (closestLangElement) {
        languageCode = closestLangElement.getAttribute('lang') || closestLangElement.getAttribute('xml:lang')
      }
    }
    return languageCode
  }

  static getSelection (target) {
    let selection = target.ownerDocument.getSelection()
    if (!selection) { console.warn(`Cannot get selection from a document`) }
    return selection
  }

  /**
   * Helper method for {@link #findSelection} which
   * identifies target word and surrounding
   * context for languages whose words are
   * space-separated
   * @see #findSelection
   * @private
   */
  doSpaceSeparatedWordSelection (textSelector) {
    let selection = HTMLSelector.getSelection(this.target)
    let anchor = selection.anchorNode
    let focus = selection.focusNode
    let anchorText = anchor.data
    let ro = selection.anchorOffset
    // clean string:
    //   convert punctuation to spaces
    anchorText = anchorText.replace(new RegExp('[' + textSelector.language.getPunctuation() + ']', 'g'), ' ')

    // find word
    let wordStart = anchorText.lastIndexOf(' ', ro) + 1
    let wordEnd = anchorText.indexOf(' ', wordStart + 1)

    if (wordStart === -1) {
      wordStart = ro
    }

    if (wordEnd === -1) {
      wordEnd = anchorText.length
    }

    // if empty, nothing to do
    if (wordStart === wordEnd) {
      return textSelector
    }

    // extract word
    let word = anchorText.substring(wordStart, wordEnd).trim()

    /* Identify the words preceeding and following the focus word
    * TODO - query the type of node in the selection to see if we are
    * dealing with something other than text nodes
    * We also need to be able to pull surrounding context for text
    * nodes that are broken up by formatting tags (<br/> etc))
    */

    let contextStr = null
    let contextPos = 0

    if (textSelector.language.contextForward || textSelector.language.contextBackward) {
      let startstr = anchorText.substring(0, wordEnd)
      let endstr = anchorText.substring(wordEnd + 1, anchorText.length)
      let preWordlist = startstr.split(/\s+/)
      let postWordlist = endstr.split(/\s+/)

      // limit to the requested # of context words
      // prior to the selected word
      // the selected word is the last item in the
      // preWordlist array
      if (preWordlist.length > textSelector.language.contextBackward + 1) {
        preWordlist = preWordlist.slice(preWordlist.length - (textSelector.language.contextBackward + 1))
      }
      // limit to the requested # of context words
      // following to the selected word
      if (postWordlist.length > textSelector.language.contextForward) {
        postWordlist = postWordlist.slice(0, textSelector.language.contextForward)
      }

      /* TODO: should we put the punctuation back in to the
      * surrounding context? Might be necessary for syntax parsing.
      */
      contextStr =
        preWordlist.join(' ') + ' ' + postWordlist.join(' ')
      contextPos = preWordlist.length - 1
    }

    textSelector.selectedText = word
    textSelector.normalizedSelectedText = textSelector.language.normalizeWord(word)
    textSelector.start = wordStart
    textSelector.end = wordEnd
    textSelector.context = contextStr
    textSelector.position = contextPos

    if (textSelector.word) {
      // Reset a selection
      selection.setBaseAndExtent(anchor, wordStart, focus, wordEnd)
    }
    return textSelector
  }

  /**
   * Helper method for {@link #findSelection} which identifies
   * target word and surrounding context for languages
   * whose words are character based
   * @see #findSelection
   * @private
   */
  doCharacterBasedWordSelection (textSelection) {
    // TODO
  }
}
