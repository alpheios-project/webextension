<template>
    <div class="alpheios-panel auk" :class="classes" :style="this.data.styles"
         data-component="alpheios-panel" data-resizable="true" v-show="data.isOpen"
        :data-notification-visible="data.notification.isContentAvailable">

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

        <div class="alpheios-panel__notifications uk-text-small" :class="notificationClasses">
            <span @click="closeNotifications" class="alpheios-panel__notifications-close-btn">
                <close-icon></close-icon>
            </span>
            <span v-html="data.notification.text"></span>
            <setting :data="data.settings.preferredLanguage" :show-title="false"
                     :classes="['alpheios-panel__notifications--lang-switcher']" @change="settingChanged"
                     v-show="data.notification.showLanguageSwitcher"></setting>
        </div>
        <div :id="navbarID" class="alpheios-panel__nav">
            <div :class="{ active: data.tabs.definitions }" @click="changeTab('definitions')"
                 class="alpheios-panel__nav-btn">
                <definitions-icon class="icon"></definitions-icon>
            </div>

            <div v-bind:class="{ active: data.tabs.inflections }" @click="changeTab('inflections')"
                 class="alpheios-panel__nav-btn">
                <inflections-icon class="icon"></inflections-icon>
            </div>

            <div v-bind:class="{ active: data.tabs.grammar }" @click="changeTab('grammar')"
              class="alpheios-panel__nav-btn">
                <grammar-icon class="icon"></grammar-icon>
            </div>

            <div v-bind:class="{ active: data.tabs.status }" @click="changeTab('status')"
                 class="alpheios-panel__nav-btn">
                <status-icon class="icon"></status-icon>
            </div>

            <div v-bind:class="{ active: data.tabs.options }" @click="changeTab('options')"
                 class="alpheios-panel__nav-btn">
                <options-icon class="icon"></options-icon>
            </div>

            <div v-bind:class="{ active: data.tabs.info }" @click="changeTab('info')"
                 class="alpheios-panel__nav-btn">
                <info-icon class="icon"></info-icon>
            </div>
        </div>
        <div class="alpheios-panel__content">
            <div v-show="data.tabs.definitions" class="alpheios-panel__tab-panel">
                <div class="alpheios-panel__contentitem" v-for="definition in data.shortDefinitions">
                    <shortdef :definition="definition"></shortdef>
                </div>
                <div class="alpheios-panel__contentitem" v-html="data.fullDefinitions"></div>
            </div>
            <div v-show="inflectionsTabVisible" :id="inflectionsPanelID" class="alpheios-panel__tab-panel">
                <inflections class="alpheios-panel-inflections"
                             :data="data.inflectionComponentData" :locale="data.settings.locale.currentValue"
                             @contentwidth="setContentWidth">
                </inflections>
            </div>
            <div v-show="data.tabs.grammar" class="alpheios-panel__tab-panel alpheios-panel__tab-panel--no-padding">
                  <grammar :res="data.grammarRes"></grammar>
              </div>
            <div v-show="data.tabs.status" class="alpheios-panel__tab-panel">
                <div v-for="message in data.messages">
                    <div class="alpheios-panel__message">{{message}}</div>
                </div>
            </div>
            <div v-show="data.tabs.options" class="alpheios-panel__tab-panel">
                <setting :data="data.settings.preferredLanguage" @change="settingChanged"
                         :classes="['alpheios-panel__options-item']"></setting>
                <setting :data="data.settings.locale" @change="settingChanged"
                         :classes="['alpheios-panel__options-item']"></setting>
                <setting :data="data.settings.panelPosition" @change="settingChanged"
                         :classes="['alpheios-panel__options-item']"></setting>
                <setting :data="data.settings.uiType" @change="settingChanged"
                         :classes="['alpheios-panel__options-item']"></setting>
                <setting :data="languageSetting" @change="resourceSettingChanged"
                  :key="languageSetting.name"
                  v-if="languageSetting.values.length > 1"
                  v-for="languageSetting in data.resourceSettings.lexicons"></setting>
            </div>
            <div v-show="data.tabs.info" class="alpheios-panel__tab-panel">
                <info></info>
            </div>
        </div>

        <div class="alpheios-panel__status">
            <span v-show="data.status.selectedText">Selected text: {{data.status.selectedText}}</span><br>
            <span v-show="data.status.languageName">Language: {{data.status.languageName}}</span>
        </div>
    </div>
</template>
<script>
  import Inflections from './inflections.vue'
  import Setting from './setting.vue'
  import ShortDef from './shortdef.vue'
  import Grammar from './grammar.vue'
  import Info from './info.vue'
  import interact from 'interactjs'
  import Locales from '../../locales/locales'

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
      grammar: Grammar,
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
    data: function () {
      return {
        navbarID: 'alpheios-panel__nav',
        inflectionsPanelID: 'alpheios-panel__inflections-panel'
      }
    },
    props: {
      data: {
        type: Object,
        required: true
      }
    },

    computed: {
      classes: function () {
        return Object.assign(this.data.classes, {
          'alpheios-panel-left': this.data.settings.panelPosition.currentValue === 'left',
          'alpheios-panel-right': this.data.settings.panelPosition.currentValue === 'right'
        })
      },

      notificationClasses: function () {
        return {
          'alpheios-panel__notifications--important': this.data.notification.important
        }
      },

      attachToLeftVisible: function () {
        return this.data.settings.panelPosition.currentValue === 'right'
      },

      attachToRightVisible: function () {
        return this.data.settings.panelPosition.currentValue === 'left'
      },

      // Need this to watch when inflections tab becomes active and adjust panel width to fully fit an inflection table in
      inflectionsTabVisible: function () {
        // Inform an inflection component about its visibility state change
        this.data.inflectionComponentData.visible = this.data.tabs.inflections
        return this.data.tabs.inflections
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

      closeNotifications () {
        this.$emit('closenotifications')
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
      },

      resourceSettingChanged: function (name, value) {
        this.$emit('resourcesettingchange', name, value) // Re-emit for a Vue instance
      },

      setContentWidth: function (width) {
        let widthDelta = parseInt(this.navbarWidth, 10)
          + parseInt(this.inflPanelLeftPadding, 10)
          + parseInt(this.inflPanelRightPadding, 10)
        if (width > this.data.minWidth + widthDelta) {
          let adjustedWidth = width + widthDelta
          // Max viewport width less some space to display page content
          let maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 20
          if (adjustedWidth > maxWidth) { adjustedWidth = maxWidth }
          this.$el.style.width = `${adjustedWidth}px`
        }
      }
    },

    mounted: function () {
      // Determine paddings and sidebar width for calculation of a panel width to fit content
      let navbar = this.$el.querySelector(`#${this.navbarID}`)
      let inflectionsPanel = this.$el.querySelector(`#${this.inflectionsPanelID}`)
      this.navbarWidth = navbar ? window.getComputedStyle(navbar).getPropertyValue('width').match(/\d+/)[0] : 0
      this.inflPanelLeftPadding = inflectionsPanel ? window.getComputedStyle(inflectionsPanel).getPropertyValue('padding-left').match(/\d+/)[0] : 0
      this.inflPanelRightPadding = inflectionsPanel ? window.getComputedStyle(inflectionsPanel).getPropertyValue('padding-right').match(/\d+/)[0] : 0

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
        width: 400px; // Initial width
        height: 100vh;
        top: 0;
        z-index: 2000;
        position: fixed;
        background: #FFF;
        resize: both;
        opacity: 0.95;
        direction: ltr;
        display: grid;
        grid-template-columns: auto 60px;
        grid-template-rows: 60px 60px auto 60px;
        grid-template-areas:
            "header header"
            "content sidebar"
            "content sidebar"
            "status sidebar"
    }

    .alpheios-panel[data-notification-visible="true"] {
        grid-template-areas:
                "header header"
                "notifications sidebar"
                "content sidebar"
                "status sidebar"
    }

    .alpheios-panel.alpheios-panel-left {
        left: 0;
    }

    .alpheios-panel.alpheios-panel-right {
        right: 0;
        grid-template-columns: 60px auto;
        grid-template-areas:
                "header header"
                "sidebar notifications "
                "sidebar content"
                "sidebar status"

    }

    .alpheios-panel__header {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        padding: 10px;
        box-sizing: border-box;
        background-color: $alpheios-toolbar-color;
        grid-area: header;
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
        overflow: auto;
        grid-area: content;
        direction: ltr;
        box-sizing: border-box;
        display: flex;
    }

    .alpheios-panel__notifications {
        display: none;
        position: relative;
        padding: 10px 20px;
        background: $alpheios-logo-color;
        grid-area: notifications;
        overflow: hidden;
    }

    .alpheios-panel__notifications-close-btn {
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

    .alpheios-panel__notifications-close-btn:hover,
    .alpheios-panel__notifications-close-btn:focus {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }

    .alpheios-panel__notifications--lang-switcher {
        font-size: 12px;
        float: right;
        margin: -20px 10px 0 0;
        display: inline-block;
    }

    .alpheios-panel__notifications--lang-switcher .uk-select {
        width: 120px;
        height: 25px;
    }

    .alpheios-panel__notifications--important {
        background: $alpheios-icon-color;
    }

    [data-notification-visible="true"] .alpheios-panel__notifications {
        display: block;
    }

    .alpheios-panel__tab-panel {
        display: flex;
        flex-direction: column;
        padding: 20px;
    }

    .alpheios-panel__tab-panel--no-padding {
        padding: 0;
    }

    .alpheios-panel__message {
        margin-bottom: 0.5rem;
    }

    .alpheios-panel__options-item {
        margin-bottom: 0.5rem;
    }

    .alpheios-panel__status {
        padding: 10px 20px;
        background: $alpheios-toolbar-color;
        color: #FFF;
        grid-area: status;
    }

    .alpheios-panel__contentitem {
        margin-bottom: 1em;
    }

    .alpheios-panel__nav {
        width: 60px;
        background: $alpheios-toolbar-active-color;
        grid-area: sidebar;
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
</style>
