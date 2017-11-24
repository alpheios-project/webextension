import * as Models from 'alpheios-data-models'

class SourceSelection {
  constructor (target, defaultLanguage) {
    this.target = target
    let targetLang
    try {
      targetLang = this.getAttribute('lang') || this.getAttribute('xml:lang')
    } catch (e) {
      // if we don't have an element
      console.log('getAttribute not accessible on target')
    }
    if (!targetLang) {
      let closestLangElement = target.closest('[lang]') || this.target.closest('[xml\\:lang]')
      if (closestLangElement) {
        targetLang = closestLangElement.getAttribute('lang') || closestLangElement.getAttribute('xml:lang')
      }
    }
    if (!targetLang) {
      targetLang = defaultLanguage
    }
    this.language = Models.LanguageModelFactory.getLanguageForCode(targetLang)
    this.initialize({word: null, normalized_word: null, start: 0, end: 0, context: null, position: 0})
  }

  initialize (wordObj) {
    this.in_margin = this.selectionInMargin()
    if (this.in_margin) {
      this.word_selection = wordObj
      return
    }
    try {
      this.original_selection = this.target.ownerDocument.getSelection()
    } catch (e) {
      this.original_selection = null
      console.log('No selection found in target owner document')
      return
    }
    let separator = this.language.baseUnit
    switch (separator) {
      case Models.Constants.LANG_UNIT_WORD:
        wordObj = this.doSpaceSeparatedWordSelection()
        break
      case Models.Constants.LANG_UNIT_CHAR:
        wordObj = this.doCharacterBasedWordSelection()
        break
      default:
        throw new Error(`unknown base_unit ${separator.toString()}`)
    }
    this.word_selection = wordObj
  }

  reset () {
    if (this.word_selection.word) {
      this.word_selection.reset()
    }
  }

  /**
   * Helper function to determine if the user's selection
   * is in the margin of the document
   * @private
   * @returns true if in the margin, false if not
   * @type Boolean
   */
  selectionInMargin () {
      // Sometimes mouseover a margin seems to set the range offset
      // greater than the string length, so check that condition,
      // as well as looking for whitepace at the offset with
      // only whitespace to the right or left of the offset
      // TODO - not sure if it's necessary anymore?
      // var inMargin =
       //   this.original_selection.anchorOffset >= this.original_selection.toString().length ||
      //    ( a_rngstr[a_ro].indexOf(" ") == 0 &&
      //          (a_rngstr.slice(0,a_ro).search(/\S/) == -1 ||
      //         a_rngstr.slice(a_ro+1,-1).search(/\S/) == -1)
      //    );
    return false
  };

  /**
  * Helper method for {@link #findSelection} which
  * identifies target word and surrounding
  * context for languages whose words are
  * space-separated
  * @see #findSelection
  * @private
  */
  doSpaceSeparatedWordSelection () {
    let selection = this.original_selection
    let anchor = selection.anchorNode
    let focus = selection.focusNode
    let anchorText = anchor.data
    let ro = selection.anchorOffset
    // clean string:
    //   convert punctuation to spaces
    anchorText = anchorText.replace(new RegExp('[' + this.language.getPunctuation() + ']', 'g'), ' ')

    // find word
    let wordStart = anchorText.lastIndexOf(' ', ro)
    let wordEnd = anchorText.indexOf(' ', wordStart + 1)

    if (wordStart === -1) {
      wordStart = ro
    }

    if (wordEnd === -1) {
      wordEnd = anchorText.length
    }

    // if empty, nothing to do
    if (wordStart === wordEnd) {
      return {}
    }

    // extract word
    let word = anchorText.substring(wordStart, wordEnd)

    /* Identify the words preceeding and following the focus word
    * TODO - query the type of node in the selection to see if we are
    * dealing with something other than text nodes
    * We also need to be able to pull surrounding context for text
    * nodes that are broken up by formatting tags (<br/> etc))
    */

    let contextStr = null
    let contextPos = 0

    if (this.language.contextForward || this.language.contextBackward) {
      let startstr = anchorText.substring(0, wordEnd)
      let endstr = anchorText.substring(wordEnd + 1, anchorText.length)
      let preWordlist = startstr.split(/\s+/)
      let postWordlist = endstr.split(/\s+/)

      // limit to the requested # of context words
      // prior to the selected word
      // the selected word is the last item in the
      // preWordlist array
      if (preWordlist.length > this.language.contextBackward + 1) {
        preWordlist = preWordlist.slice(preWordlist.length - (this.language.contextBackward + 1))
      }
      // limit to the requested # of context words
      // following to the selected word
      if (postWordlist.length > this.language.contextForward) {
        postWordlist = postWordlist.slice(0, this.language.contextForward)
      }

      /* TODO: should we put the punctuation back in to the
      * surrounding context? Might be necessary for syntax parsing.
      */
      contextStr =
          preWordlist.join(' ') + ' ' + postWordlist.join(' ')
      contextPos = preWordlist.length - 1
    }

    let wordObj = { word: word,
      normalized_word: this.language.normalizeWord(word).trim(),
      start: wordStart,
      end: wordEnd,
      context: contextStr,
      position: contextPos,
      reset: () => { selection.setBaseAndExtent(anchor, wordStart, focus, wordEnd) }
    }
    return wordObj
  }

  /**
   * Helper method for {@link #findSelection} which identifies
   * target word and surrounding context for languages
   * whose words are character based
   * @see #findSelection
   * @private
   */
  doCharacterBasedWordSelection () {
    // TODO
  }

  toString () {
    return `language:${this.language} word: ${this.word_selection.normalized_word}`
  }
}
export default SourceSelection
