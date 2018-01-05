<template>
    <div v-show="infldata">
        <h3>{{selectedView.title}}</h3>
        <div class="uk-margin">
            <label class="uk-form-label">View selector:</label>
            <select v-model="selectedViewModel" class="uk-select">
                <option v-for="view in views">{{view.name}}</option>
            </select>
        </div>
        <div class="uk-button-group uk-margin">
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
        <div :id="elementIDs.narrowView" class="uk-margin"></div>
        <div :id="elementIDs.footnotes" class="uk-margin"></div>
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
        views: [],
        selectedViewName: '',
        selectedView: {},
        renderedView: {},
        elementIDs: {
          wideView: 'alph-inflection-table-wide',
          narrowView: 'alph-inflection-table-narrow',
          footnotes: 'alph-inflection-footnotes'
        },
        htmlElements: {
          wideView: undefined
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
          }
          this.renderInflections().displayInflections()
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
        this.htmlElements.wideView.appendChild(this.selectedView.wideViewNodes)
        this.htmlElements.narrowView.appendChild(this.selectedView.narrowViewNodes)
        this.htmlElements.footnotes.appendChild(this.selectedView.footnotesNodes)
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
      this.htmlElements.narrowView = this.$el.querySelector(`#${this.elementIDs.narrowView}`)
      this.htmlElements.footnotes = this.$el.querySelector(`#${this.elementIDs.footnotes}`)
    }
  }
</script>
<style lang="scss">
    .auk .uk-button-small.alpheios-inflections__control-btn {
        line-height: 1.5;
    }
</style>
