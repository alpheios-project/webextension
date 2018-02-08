<template>
    <div ref="popup" class="alpheios-popup auk" v-bind:class="data.classes" :style="dimensions"
         v-show="visible" :data-notification-visible="data.notification.visible">
        <div class="alpheios-popup__header">
            <div class="alpheios-popup__header-text">
                <span v-show="data.status.selectedText" class="alpheios-popup__header-selection">{{data.status.selectedText}}</span>
                <span v-show="data.status.languageName && data.verboseMode" class="alpheios-popup__header-word">({{data.status.languageName}})</span>
            </div>
            <span class="alpheios-popup__close-btn" @click="closePopup">
                <close-icon></close-icon>
            </span>
        </div>
        <div v-show="!morphDataReady"
             class="alpheios-popup__morph-cont alpheios-popup__definitions--placeholder uk-text-small">
            No lexical data is available yet
        </div>
        <div v-show="morphDataReady" :id="lexicalDataContainerID" class="alpheios-popup__morph-cont uk-text-small">
            <morph :id="morphComponentID" :lexemes="lexemes" :definitions="definitions" :linkedfeatures="linkedfeatures">
            </morph>

            <div class="alpheios-popup__morph-cont-providers" v-if="showProviders">
                <div class="alpheios-popup__morph-cont-providers-header">Credits:</div>
                <div class="alpheios-popup__morph-cont-providers-source" v-for="p in data.providers">
                    {{ p.toString() }}
                </div>
            </div>
        </div>
        <div class="alpheios-popup__providers" v-if="data.providers.length > 0">
          <a class="alpheios-popup__providers-link" v-on:click="switchProviders">{{providersLinkText}}</a>
        </div>
        <div class="alpheios-popup__button-area">
            <img class="alpheios-popup__logo" src="../images/icon.png">
            <div class="uk-button-group">
                <button @click="showPanelTab('inflections')" v-show="data.inflDataReady"
                        class="uk-button uk-button-primary uk-button-small alpheios-popup__more-btn">Inflect</button>
                <button @click="showPanelTab('definitions')" v-show="data.defDataReady"
                        class="uk-button uk-button-primary uk-button-small alpheios-popup__more-btn">Define</button>
                <button @click="showPanelTab('options')"
                        class="uk-button uk-button-primary uk-button-small alpheios-popup__more-btn">Options</button>
            </div>
        </div>
        <div class="alpheios-popup__notifications uk-text-small" :class="notificationClasses"
             v-show="data.notification.important">
            <span @click="closeNotifications" class="alpheios-popup__notifications-close-btn">
                <close-icon></close-icon>
            </span>
            <span v-html="data.notification.text"></span>
            <setting :data="data.settings.preferredLanguage" :show-title="false"
                     :classes="['alpheios-popup__notifications--lang-switcher']" @change="settingChanged"
                     v-show="data.notification.showLanguageSwitcher"></setting>
        </div>
    </div>
</template>
<script>
  import Morph from './morph.vue'
  import Setting from './setting.vue'
  import interact from 'interactjs'

  // Embeddable SVG icons
  import CloseIcon from '../images/inline-icons/close.svg'

  export default {
    name: 'Popup',
    components: {
      morph: Morph,
      setting: Setting,
      closeIcon: CloseIcon,
    },
    data: function () {
      return {
        resizable: true,
        draggable: true,
        contentHeight: 0, // Morphological content height (updated with `heightchange` event emitted by a morph component)
        minResizableWidth: 0, // Resizable's min width (for Interact.js)
        minResizableHeight: 0, // Resizable's min height (for Interact.js)
        interactInstance: undefined,
        lexicalDataContainerID: 'alpheios-lexical-data-container',
        morphComponentID: 'alpheios-morph-component'
      }
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      messages: {
        type: Array,
        required: true
      },
      lexemes: {
        type: Array,
        required: true
      },
      definitions: {
        type: Object,
        required: true
      },
      linkedfeatures: {
        type: Array,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      }
    },

    computed: {
      morphDataReady: function () {
        return this.data.morphDataReady
      },
      notificationClasses: function () {
        return {
          'alpheios-popup__notifications--important': this.data.notification.important
        }
      },
      providersLinkText: function() {
        return this.data.showProviders ? 'Hide Credits' : 'Show Credits'
      },
      showProviders: function() {
        return this.data.showProviders
      },
      updates: function() {
        return this.data.updates
      },
      // Returns popup dimensions and positions styles with `px` units
      dimensions: function () {
        if (!this.visible) {
          // Don't do any calculations if popup is invisible
          console.log(`DCALC: popup is hidden, resetting a content height`)
          this.contentHeight = 0
          return {top: `0px`, left: `0px`, width: `0px`, height: `0px`}
        }

        let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        console.log(`DCALC: selection is at [${this.data.targetRect.left}px, ${this.data.targetRect.top}px], viewport dimensions are [${viewportWidth}px, ${viewportHeight}px]`)

        let top = this.data.top
        let left = this.data.left
        let width = this.data.width
        let height = this.data.heightMin
        // A popup should expand if content height exceeds the value below
        // TODO: calculate how much content is longer than a target
        let contentHeightLimit = this.data.heightMin - this.data.fixedElementsHeight
        console.log(`DCALC: expected content height is ${this.contentHeight}px, expansion threshold is ${contentHeightLimit}px`)
        if (this.contentHeight > contentHeightLimit) {
          // Increase popup height if content data is taller than the placeholder available
          height = this.data.heightMin + (this.contentHeight - contentHeightLimit)
          console.log(`DCALC: expanding popup height to ${height}`)
        } else {
          console.log(`DCALC: popup height will not be increased`)
        }

        let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        console.log(`DCALC: scrollbar width is ${scrollbarWidth}`)
        let viewportMargins = 2*this.data.viewportMargin + scrollbarWidth

        /*
        Horizontal positioning:
        1. If there is enough space, align a center of the popup with the center of a selection.
        2. If there is not enough space for that at the left, shift popup to the right.
        3. If there is not enough space at the right, shift popup to the left.
        4. Else, place it at the horizontal center of a viewport.
        Vertical positioning:
        1. If there is enough space below a selection, place popup there.
        2. Otherwise, place it above, if there is enough space there.
        3. Else, place it at the vertical center of a viewport.
         */
        let placementTargetX = this.data.targetRect.left
        let placementTargetY = this.data.targetRect.top
        console.log(`DCALC: placement target is [${placementTargetX}px, ${placementTargetY}px]`)

        if (width + 2*this.data.viewportMargin > viewportWidth) {
          console.log(`DCALC: Shrinking horizontally`)
          left = this.data.viewportMargin
          width = viewportWidth - viewportMargins
        } else if (placementTargetX + width/2 + this.data.viewportMargin + scrollbarWidth < viewportWidth
                   && placementTargetX - width/2 - this.data.viewportMargin > 0) {
          console.log(`DCALC: Aligning horizontally to middle of the word`)
          left = placementTargetX - Math.floor(width / 2)
        } else if (placementTargetX - width/2 - this.data.viewportMargin <= 0) {
          // There is not enough space at the left
          console.log(`DCALC: Shifting horizontally to the right`)
          left = this.data.viewportMargin
        } else if (placementTargetX + width/2 + this.data.viewportMargin >= viewportWidth) {
          // There is not enough space at the right
          console.log(`DCALC: Shifting horizontally to the left`)
          left = viewportWidth - this.data.viewportMargin - scrollbarWidth - width
        } else {
          console.log(`DCALC: Placing horizontally to the middle`)
          left = Math.round((viewportWidth - width)/2)
        }

        if (height + 2*this.data.viewportMargin > viewportHeight) {
          console.log(`DCALC: Shrinking vertically`)
          top = this.data.viewportMargin
          height = viewportHeight - 2*this.data.viewportMargin
        } else if (placementTargetY + this.data.placementMargin + height < viewportHeight) {
          console.log(`DCALC: Placing vertically to the bottom`)
          top = placementTargetY + this.data.placementMargin
        } else if (height + this.data.placementMargin < placementTargetY) {
          console.log(`DCALC: Placing vertically to the top`)
          top = placementTargetY - this.data.placementMargin - height
        } else {
          console.log(`DCALC: Placing vertically to the middle`)
          top = Math.ceil((viewportHeight - height)/2)
        }

        console.log(`DCALC: final popup dimensions are [${width}px, ${height}px],
        popup will be placed at [${left}px, ${top}px]`)

        if (this.interactInstance && this.minResizableWidth !== width && this.minResizableHeight !== height) {
          // If component is mounted and interact.js instance is created, update its resizable properties
          this.minResizableWidth = width
          this.minResizableHeight = height
          this.interactInstance.resizable(this.resizableSettings())
        }

        this.$nextTick(() => {

          let width = this.$el.offsetWidth
          let height = this.$el.offsetHeight
          let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
          let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
          console.log(`DCALC: nextTick, popup dimensions are [${width}px, ${height}px],
            viewport dimensions are [${viewportWidth}px, ${viewportHeight}px]`)
          if (width >= viewportWidth) {
            console.log(`DCALC: limiting a popup width`)
            width = viewportWidth - 2*this.data.viewportMargin - scrollbarWidth
            this.$el.style.width = `${width}px`
          }
            if (height >= viewportHeight) {
                console.log(`DCALC: limiting a popup height`)
                height = viewportHeight - 2*this.data.viewportMargin
              this.$el.style.height = `${height}px`
            }
        })

        return {
          top: `${top}px`,
          left: `${left}px`,
          width: `auto`,
          height: `auto`
        }
      }
    },

    methods: {
      clearMessages() {
        while (this.messages.length >0) {
          this.messages.pop()
        }
      },

      closePopup () {
        this.$emit('close')
      },

      closeNotifications () {
        this.$emit('closepopupnotifications')
      },

      showPanelTab (tabName) {
        this.$emit('showpaneltab', tabName)
      },

      settingChanged: function (name, value) {
        this.$emit('settingchange', name, value) // Re-emit for a Vue instance
      },

      switchProviders: function () {
        this.data.showProviders = ! this.data.showProviders
        if (this.data.showProviders) {
          // Show credits info
          this.$nextTick(() => {
            let container = this.$el.querySelector(`#${this.lexicalDataContainerID}`)
            if (container) {
              container.scrollTop = container.scrollHeight // Will make it scroll all the way to the bottom
            }
          })
        }
      },

      // Interact.js resizable settings
      resizableSettings: function () {
        return {
          preserveAspectRatio: false,
          edges: { left: true, right: true, bottom: true, top: true },
          restrictSize: {
            min: { width: this.minResizableWidth, height: this.minResizableHeight }
          },
          restrictEdges: {
            outer: document.body,
            endOnly: true,
          }
        }
      },

      // Interact.js draggable settings
      draggableSettings: function () {
        return {
          inertia: true,
          autoScroll: false,
          restrict: {
            restriction: document.body,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          onmove: this.dragMoveListener
        }
      },

      resizeListener (event) {
        if (this.resizable) {
          const target = event.target
          let x = (parseFloat(target.getAttribute('data-x')) || 0)
          let y = (parseFloat(target.getAttribute('data-y')) || 0)

          // update the element's style
          target.style.width  = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'

          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

          target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
      },

      dragMoveListener (event) {
        if (this.draggable) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.webkitTransform = `translate(${x}px, ${y}px)`;
          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    },

    mounted () {
      console.log('mounted')
      this.interactInstance = interact(this.$el)
        .resizable(this.resizableSettings())
        .draggable(this.draggableSettings())
        .on('resizemove', this.resizeListener)
    },

    watch: {
      updates: function(updates) {
        console.log("updating content height")
        this.$nextTick(() => {
          let morphComponent = this.$el.querySelector(`#${this.morphComponentID}`) // TODO: Avoid repetitive selector queries
          this.contentHeight = (morphComponent && morphComponent.clientHeight) ? morphComponent.clientHeight : 0
        })
      },
    }
  }
</script>
<style lang="scss">
    @import "../styles/alpheios";

    .alpheios-popup {
        display: flex;
        flex-direction: column;
        background: #FFF;
        border: 1px solid lightgray;
        min-width: 210px;
        min-height: 150px;
        z-index: 1000;
        position: fixed;
        left: 200px;
        top: 100px;
        box-sizing: border-box;  /* Required for Interact.js to take element size with paddings and work correctly */
        overflow: auto;
        font-family: $alpheios-font-family;
        font-size: $alpheios-base-font-size;
        color: $alpheios-copy-color;
    }

    .alpheios-popup__header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        flex: 0 0 50px;
        padding: 10px 20px;
    }

    .alpheios-popup__header-text {
        position: relative;
        top: 20px;
        left: 3px;
        line-height: 1;
    }

    .alpheios-popup__header-selection {
        font-size: $alpheios-base-font-size;
        font-weight: 700;
        color: $alpheios-toolbar-color;
    }

    .alpheios-popup__header-word {
        font-size: 0.75*$alpheios-base-font-size;
        position: relative;
        top: -1px;
    }

    .alpheios-popup__close-btn {
        display: block;
        position: absolute;
        width: 30px;
        right: 5px;
        top: 10px;
        cursor: pointer;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-popup__close-btn:hover,
    .alpheios-popup__close-btn:focus {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }

    .alpheios-popup__notifications {
        display: none;
        position: relative;
        padding: 10px 20px;
        background: $alpheios-logo-color;
        flex: 0 0 60px;
        box-sizing: border-box;
        overflow: hidden;
    }

    .alpheios-popup__notifications-close-btn {
        position: absolute;
        right: 5px;
        top: 5px;
        display: block;
        width: 20px;
        height: 20px;
        margin: 0;
        cursor: pointer;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-popup__notifications-close-btn:hover,
    .alpheios-popup__notifications-close-btn:focus {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }

    [data-notification-visible="true"] .alpheios-popup__notifications {
        display: block;
    }

    .alpheios-popup__notifications--lang-switcher {
        font-size: 0.75*$alpheios-base-font-size;
        float: right;
        margin: -20px 10px 0 0;
        display: inline-block;
    }

    .alpheios-popup__notifications--lang-switcher .uk-select {
        width: 120px;
        height: 25px;
    }

    .alpheios-popup__notifications--important {
        background: $alpheios-icon-color;
    }

    .alpheios-popup__morph-cont {
        flex: 1 1;
        box-sizing: border-box;
        margin: 10px 10px 0;
        overflow: auto;
        padding: 10px;
        border: 1px solid $alpheios-sidebar-header-border-color;
    }

    .alpheios-popup__morph-cont-providers-header {
        display: inline-block;
        color: $alpheios-link-color;
        font-size: 0.75*$alpheios-base-font-size;
        font-weight: 700;
        margin-top: 2px;
    }

    .alpheios-popup__definitions--placeholder {
        border: 0 none;
        padding: 10px 0 0;
    }

    .alpheios-popup__button-area {
        flex: 0 1 auto;
        padding: 10px 20px;
        text-align: right;
        box-sizing: border-box;
        position: relative;
    }

    img.alpheios-popup__logo {
        height: 35px;
        width: auto;
        position: absolute;
        top: 6px;
        left: 20px;
    }

    .alpheios-popup__more-btn {
        float: right;
        margin-bottom: 10px;
    }
    .alpheios-popup__morph-cont-providers-source {
      font-size: smaller;
      font-weight: normal;
      color: $alpheios-toolbar-color;
      font-style: italic;
      margin-left: .5em;
      margin-top: .5em;
    }

    .alpheios-popup__providers {
      margin-left: 20px;
    }
    .alpheios-popup__providers-link {
      font-size: 0.675*$alpheios-base-font-size;
    }
</style>
