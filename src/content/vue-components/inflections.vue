<template>
    <div v-show="visible">
        <h3>{{selectedView.title}}</h3>
        <div class="alpheios-inflections__view-selector-cont uk-margin">
            <label class="uk-form-label">View selector:</label>
            <select v-model="selectedViewModel" class="uk-select">
                <option v-for="view in views">{{view.name}}</option>
            </select>
        </div>
        <div class="alpheios-inflections__control-btn-cont uk-button-group uk-margin">
            <button class="uk-button uk-button-primary uk-button-small alpheios-inflections__control-btn"
                    @click="hideEmptyColsClick">
                {{buttons.hideEmptyCols.text}}
            </button>
            <button class="uk-button uk-button-primary uk-button-small alpheios-inflections__control-btn"
                    @click="hideNoSuffixGroupsClick">
                {{buttons.hideNoSuffixGroups.text}}
            </button>
        </div>
        <p class="uk-margin">Hover over the suffix to see its grammar features</p>
        <div :id="elementIDs.wideView" class="uk-margin"></div>
        <div :id="elementIDs.footnotes" class="alpheios-inflections__footnotes uk-margin uk-text-small">
            <template v-for="footnote in footnotes">
                <dt>{{footnote.index}}</dt>
                <dd>{{footnote.text}}</dd>
            </template>
        </div>
    </div>
</template>
<script>
  import { ViewSet, L10n, L10nMessages } from 'alpheios-inflection-tables'

  export default {
    name: 'Inflections',
    props: {
      // This will be an InflectionData object
      infldata: {
        type: [Object, Boolean],
        required: true
      },
      locale: {
        type: String,
        required: true
      }
    },

    data: function () {
      return {
        visible: false,
        views: [],
        selectedViewName: '',
        selectedView: {},
        renderedView: {},
        elementIDs: {
          wideView: 'alph-inflection-table-wide',
          footnotes: 'alph-inflection-footnotes'
        },
        htmlElements: {
          wideView: undefined,
        },
        buttons: {
          hideEmptyCols: {
            contentHidden: false,
            text: '',
            shownText: 'Hide empty columns',
            hiddenText: 'Show empty columns'
          },
          hideNoSuffixGroups: {
            noSuffMatchHidden: false,
            text: '',
            shownText: 'Hide groups with no suffix matching',
            hiddenText: 'Show groups with no suffix matching'
          }
        }
      }
    },

    computed: {
      selectedViewModel: {
        get: function () {
          return this.selectedViewName
        },
        set: function (newValue) {
          console.log(`Selected view changed to ${newValue}`)
          this.selectedView = this.views.find(view => view.name === newValue)
          this.renderInflections().displayInflections()
          this.selectedViewName = newValue
        }
      },
      inflectionTable: function () {
        return this.selectedView.name
      },
      footnotes: function () {
        let footnotes = []
        if (this.selectedView && this.selectedView.footnotes) {
          footnotes = Array.from(this.selectedView.footnotes.values())
        }
        return footnotes
      }
    },

    watch: {
      infldata: function (inflectionData) {
        console.log('Inflection data changed')
        if (inflectionData) {
          this.views = this.viewSet.getViews(inflectionData)
          // Select a first view by default
          if (this.views.length > 0) {
            this.selectedViewName = this.views[0].name
            this.selectedView = this.views[0]
            this.renderInflections().displayInflections()
            this.visible = true
          }
        }
      },
      locale: function (locale) {
        console.log(`locale changed to ${locale}`)
        if (this.infldata) {
          this.renderInflections().displayInflections() // Re-render inflections for a different locale
        }
      }

    },

    methods: {
      clearInflections: function () {
        for (let element of Object.values(this.htmlElements)) { element.innerHTML = '' }
        return this
      },

      renderInflections: function () {
        this.clearInflections().setDefaults()
        this.selectedView.render(this.infldata, this.l10n.messages(this.locale))
        return this
      },

      displayInflections: function () {
        let popupClassName = 'alpheios-inflections__footnote-popup'
        let closeBtnClassName = 'alpheios-inflections__footnote-popup-close-btn'
        let hiddenClassName = 'hidden'
        let titleClassName = 'alpheios-inflections__footnote-popup-title'
        this.htmlElements.wideView.appendChild(this.selectedView.wideViewNodes)
        let footnoteLinks = this.htmlElements.wideView.querySelectorAll('[data-footnote]')
        if (footnoteLinks) {
          for (let footnoteLink of footnoteLinks) {
            let index = footnoteLink.dataset.footnote
            if (!index) {
              console.warn(`[data-footnote] attribute has no index value`)
              break
            }
            let indexes = index.replace(/\s*/g, '').split(',')
            let popup = document.createElement('div')
            popup.classList.add(popupClassName, hiddenClassName)
            let title = document.createElement('div')
            title.classList.add(titleClassName)
            title.innerHTML = 'Footnotes:'
            popup.appendChild(title)

            for (const index of indexes) {
              let footnote = this.selectedView.footnotes.get(index)
              let dt = document.createElement('dt')
              dt.innerHTML = footnote.index
              popup.appendChild(dt)
              let dd = document.createElement('dd')
              dd.innerHTML = footnote.text
              popup.appendChild(dd)
            }
            let closeBtn = document.createElement('div')
            closeBtn.classList.add(closeBtnClassName)
            closeBtn.innerHTML =
              `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke-width="1.06" d="M16 16L4 4M16 4L4 16"></path>
               </svg>`
            popup.appendChild(closeBtn)
            footnoteLink.appendChild(popup)

            footnoteLink.addEventListener('click', (event) => {
              popup.classList.remove(hiddenClassName)
              event.stopPropagation()
            })

            closeBtn.addEventListener('click', (event) => {
              popup.classList.add(hiddenClassName)
              event.stopPropagation()
            })
          }
        }
        return this
      },

      setDefaults () {
        this.buttons.hideEmptyCols.contentHidden = false
        this.buttons.hideEmptyCols.text = this.buttons.hideEmptyCols.shownText
        this.buttons.hideNoSuffixGroups.contentHidden = false
        this.buttons.hideNoSuffixGroups.text = this.buttons.hideNoSuffixGroups.shownText
        return this
      },

      hideEmptyColsClick () {
        this.buttons.hideEmptyCols.contentHidden = !this.buttons.hideEmptyCols.contentHidden
        if (this.buttons.hideEmptyCols.contentHidden) {
          this.buttons.hideEmptyCols.text = this.buttons.hideEmptyCols.hiddenText
          this.selectedView.hideEmptyColumns()
        } else {
          this.buttons.hideEmptyCols.text = this.buttons.hideEmptyCols.shownText
          this.selectedView.showEmptyColumns()
        }
        this.displayInflections()
      },

      hideNoSuffixGroupsClick () {
        this.buttons.hideNoSuffixGroups.contentHidden = !this.buttons.hideNoSuffixGroups.contentHidden
        if (this.buttons.hideNoSuffixGroups.contentHidden) {
          this.buttons.hideNoSuffixGroups.text = this.buttons.hideNoSuffixGroups.hiddenText
          this.selectedView.hideNoSuffixGroups()
        } else {
          this.buttons.hideNoSuffixGroups.text = this.buttons.hideNoSuffixGroups.shownText
          this.selectedView.showNoSuffixGroups()
        }
        this.displayInflections()
      }
    },

    created: function () {
      this.viewSet = new ViewSet()
      this.l10n = new L10n(L10nMessages)
    },

    mounted: function () {
      this.htmlElements.wideView = this.$el.querySelector(`#${this.elementIDs.wideView}`)
    }
  }
</script>
<style lang="scss">
    @import "../styles/alpheios";

    .alpheios-inflections__view-selector-cont {
        max-width: 280px;
    }

    .alpheios-inflections__control-btn-cont {
        max-width: 280px;
    }

    .auk .uk-button-small.alpheios-inflections__control-btn {
        line-height: 1.5;
    }

    .alpheios-inflections__footnotes {
        display: grid;
        grid-template-columns: 40px 1fr;
        grid-row-gap: 2px;
        max-width: 280px;

        dt {
            font-weight: 700;
        }
    }

    [data-footnote] {
        position: relative;
        padding-left: 2px;
    }

    .alpheios-inflections__footnote-popup {
        display: grid;
        grid-template-columns: 20px 1fr;
        grid-row-gap: 2px;
        background: $alpheios-toolbar-color;
        color: #FFF;
        position: absolute;
        padding: 30px 15px 15px;
        left: 0;
        bottom: 20px;
        transform: translateX(-50%);
        z-index: 10;
        min-width: 200px;
    }

    .alpheios-inflections__footnote-popup.hidden {
        display: none;
    }

    .alpheios-inflections__footnote-popup-title {
        font-weight: 700;
        position: absolute;
        text-transform: uppercase;
        left: 15px;
        top: 7px;
    }

    .alpheios-inflections__footnote-popup-close-btn {
        position: absolute;
        right: 5px;
        top: 5px;
        display: block;
        width: 20px;
        height: 20px;
        margin: 0;
        cursor: pointer;
        fill: #FFF;
        stroke: #FFF;
    }

    .alpheios-inflections__footnote-popup-close-btn:hover,
    .alpheios-inflections__footnote-popup-close-btn:active {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }
</style>
