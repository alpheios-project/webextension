<template>
    <div class="alpheios-panel auk" v-bind:class="panelClasses" v-bind:style="this.data.styles"
         data-component="alpheios-panel" data-resizable="true" v-show="data.isOpen">

        <div class="alpheios-panel__header">
            <div class="alpheios-panel__header-title">
                <img class="alpheios-panel__header-logo" src="../images/logo.png">
            </div>
            <span @click="setPosition('left')" v-show="attachToLeftVisible" class="alpheios-panel__header-action-btn">
                <attach-left-icon></attach-left-icon>
            </span>
            <span @click="setPosition('right')" v-show="attachToRightVisible" class="alpheios-panel__header-action-btn">
                <attach-right-icon></attach-right-icon>
            </span>
            <span @click="close" class="alpheios-panel__header-action-btn">
                <close-icon></close-icon>
            </span>
        </div>

        <div class="alpheios-panel__body">
            <div class="alpheios-panel__content">
                <div v-show="data.tabs.definitions" data-element="definitionsPanel">
                  <div class="alpheios-panel__contentitem" v-for="definition in data.shortDefinitions">
                    <shortdef :definition="definition"></shortdef>
                   </div>
                   <div class="alpheios-panel__contentitem" v-html="data.fullDefinitions"></div>
                </div>
                <div v-show="data.tabs.inflections" data-element="inflectionsPanel">
                    <inflections :infldata="data.inflectionData" :locale="data.settings.locale.currentValue"></inflections>
                </div>
                <div v-show="data.tabs.status" data-element="statusPanel">
                    <div v-html="data.messages"></div>
                </div>
                <div v-show="data.tabs.grammar" data-element="grammarPanel" class="alpheios-panel__fullheight">
                    <iframe class="alpheios-panel__grammarframe" :src="data.grammarSrc"></iframe>
                </div>
                <div v-show="data.tabs.options" data-element="optionsPanel">
                    <setting :data="data.settings.preferredLanguage" @change="settingChanged"></setting>
                    <setting :data="data.settings.locale" @change="settingChanged"></setting>
                    <setting :data="data.settings.panelPosition" @change="settingChanged"></setting>
                    <setting :data="data.settings.uiType" @change="settingChanged"></setting>
                </div>
                <div v-show="data.tabs.info" data-element="infoPanel">
                    <info></info>
                </div>
            </div>
            <div id="alpheios-panel__nav" class="alpheios-panel__nav">
                <div :class="{ active: data.tabs.definitions }" @click="changeTab('definitions')"
                  class="alpheios-panel__nav-btn">
                    <definitions-icon class="icon"></definitions-icon>
                </div>

                <div v-bind:class="{ active: data.tabs.inflections }" @click="changeTab('inflections')"
                     class="alpheios-panel__nav-btn">
                    <inflections-icon class="icon"></inflections-icon>
                </div>

                <div v-bind:class="{ active: data.tabs.status }" @click="changeTab('status')"
                      class="alpheios-panel__nav-btn">
                    <status-icon class="icon"></status-icon>
                </div>

                <div v-bind:class="{ active: data.tabs.options }" @click="changeTab('options')"
                      class="alpheios-panel__nav-btn">
                    <options-icon class="icon"></options-icon>
                </div>

                <div v-bind:class="{ active: data.tabs.grammar }" @click="changeTab('grammar')"
                      class="alpheios-panel__nav-btn">
                    <grammar-icon class="icon"></grammar-icon>
                </div>

                <div v-bind:class="{ active: data.tabs.info }" @click="changeTab('info')"
                      class="alpheios-panel__nav-btn">
                    <info-icon class="icon"></info-icon>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import Inflections from './inflections.vue'
  import Setting from './setting.vue'
  import ShortDef from './shortdef.vue'
  import Info from './info.vue'
  import interact from 'interactjs'

  // Embeddable SVG icons
  import AttachLeftIcon from '../images/inline-icons/attach-left.svg';
  import AttachRightIcon from '../images/inline-icons/attach-right.svg';
  import CloseIcon from '../images/inline-icons/close.svg';
  import DefinitionsIcon from '../images/inline-icons/definitions.svg';
  import InflectionsIcon from '../images/inline-icons/inflections.svg';
  import StatusIcon from '../images/inline-icons/status.svg';
  import OptionsIcon from '../images/inline-icons/options.svg';
  import GrammarIcon from '../images/inline-icons/resources.svg';
  import InfoIcon from '../images/inline-icons/info.svg';

  export default {
    name: 'Panel',
    components: {
      inflections: Inflections,
      setting: Setting,
      shortdef: ShortDef,
      info: Info,
      attachLeftIcon: AttachLeftIcon,
      attachRightIcon: AttachRightIcon,
      closeIcon: CloseIcon,
      definitionsIcon: DefinitionsIcon,
      inflectionsIcon: InflectionsIcon,
      statusIcon: StatusIcon,
      optionsIcon: OptionsIcon,
      infoIcon: InfoIcon,
      grammarIcon: GrammarIcon
    },
    props: {
      data: {
        type: Object,
        required: true
      }
    },

    computed: {
      panelClasses: function () {
        if (this.data.settings.panelPosition.currentValue === 'right') { return 'alpheios-panel-right' }
        else { return 'alpheios-panel-left' }
      },

      attachToLeftVisible: function () {
        return this.data.settings.panelPosition.currentValue === 'right'
      },

      attachToRightVisible: function () {
        return this.data.settings.panelPosition.currentValue === 'left'
      }
    },
    methods: {
      updateZIndex: function (zIndexMax) {
        if (zIndexMax >= this.zIndex) {
          this.zIndex = zIndexMax
          if (this.zIndex < Number.POSITIVE_INFINITY) { this.zIndex++ } // To be one level higher that the highest element on a page
          this.self.element.style.zIndex = this.zIndex
        }
      },

      close () {
        this.$emit('close')
      },

      setPosition (position) {
        this.$emit('setposition', position)
      },

      changeTab (name) {
        this.$emit('changetab', name)
      },

      clearContent: function () {
        for (let contentArea in this.contentAreas) {
          if (this.contentAreas.hasOwnProperty(contentArea)) {
            this.contentAreas[contentArea].clearContent()
          }
        }
        return this
      },

      showMessage: function (messageHTML) {
        this.contentAreas.messages.setContent(messageHTML)
        this.tabGroups.contentTabs.activate('statusTab')
      },

      appendMessage: function (messageHTML) {
        this.contentAreas.messages.appendContent(messageHTML)
      },

      clearMessages: function () {
        this.contentAreas.messages.setContent('')
      },

      settingChanged: function (name, value) {
        this.$emit('settingchange', name, value) // Re-emit for a Vue instance

      }
    },
    mounted: function () {
      // Initialize Interact.js: make panel resizable
      interact(this.$el)
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: false, top: false },

          // keep the edges inside the parent
          restrictEdges: {
            outer: document.body,
            endOnly: true
          },

          // minimum size
          restrictSize: {
            min: { width: this.data.minWidth }
          },

          inertia: true
        })
        .on('resizemove', event => {
          let target = event.target
          // update the element's style
          target.style.width = `${event.rect.width}px`
        })
    }
  }
</script>
<style lang="scss">
    @import "../styles/alpheios";
    $alpheios-panel-header-height: 60px;

    .alpheios-panel {
        display: block;
        width: 400px; // Initial width
        height: 100vh;
        top: 0;
        z-index: 2000;
        position: fixed;
        background: #FFF;
        resize: both;
        opacity: 0.95;
        direction: ltr;
    }

    .alpheios-panel.alpheios-panel-left {
        left: 0;
    }

    .alpheios-panel.alpheios-panel-right {
        display: block;
        right: 0;
    }

    .alpheios-panel.full-width {
        display: block;
        width: 100%;
        left: 0;
    }

    .alpheios-panel__header {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        height: $alpheios-panel-header-height;
        padding: 10px;
        box-sizing: border-box;
        background-color: $alpheios-toolbar-color;
    }

    .alpheios-panel-right .alpheios-panel__header {
        direction: ltr;
        padding: 10px 0 10px 20px;
    }

    .alpheios-panel-right .alpheios-panel__header {
        direction: rtl;
        padding: 10px 20px 10px 0;
    }


    .alpheios-panel__header-title {
        flex-grow: 1;
    }

    .alpheios-panel__header-logo {
        margin-top: -1px;
    }

    .alpheios-panel__header-action-btn,
    .alpheios-panel__header-action-btn.active:hover,
    .alpheios-panel__header-action-btn.active:focus {
        display: block;
        width: 40px;
        height: 40px;
        margin: 0 10px;
        cursor: pointer;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-panel__header-action-btn:hover,
    .alpheios-panel__header-action-btn:focus,
    .alpheios-panel__header-action-btn.active {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }

    .alpheios-panel__body {
        display: flex;
        height: calc(100vh - #{$alpheios-panel-header-height});
    }

    .alpheios-panel-left .alpheios-panel__body {
        flex-direction: row;
    }

    .alpheios-panel-right .alpheios-panel__body {
        flex-direction: row-reverse;
    }

    .alpheios-panel__content {
        flex-grow: 1;
        direction: ltr;
        overflow: auto;
        padding: 10px 20px 100px;
    }

    .alpheios-panel__contentitem {
        margin-bottom: 1em;
    }

    .alpheios-panel__nav {
        width: 60px;
        background: $alpheios-toolbar-active-color;
    }

    .alpheios-panel__nav-btn,
    .alpheios-panel__nav-btn.active:hover,
    .alpheios-panel__nav-btn.active:focus {
        cursor: pointer;
        margin: 20px 10px;
        width: 40px;
        height: 40px;
        background: transparent no-repeat center center;
        background-size: contain;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-panel__nav-btn:hover,
    .alpheios-panel__nav-btn:focus,
    .alpheios-panel__nav-btn.active {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }

    .alpheios-panel__grammarframe {
        height: 100%;
        width: 100%;
    }

    .alpheios-panel__fullheight {
        height: 100%;
    }


</style>
