<template>
    <div class="alpheios-panel auk" v-bind:class="panelClasses" v-bind:style="this.data.styles"
         data-component="alpheios-panel" data-resizable="true" v-show="data.isOpen">
        <div class="alpheios-panel__header">
            <div class="alpheios-panel__header-title">
                <img class="alpheios-panel__header-logo" src="../images/logo.png">
            </div>
            <span @click="setPosition('left')" v-show="attachToLeftVisible" class="alpheios-panel__header-action-btn"
                  uk-icon="icon: chevron-left; ratio: 2"></span>
            <span @click="setPosition('right')" v-show="attachToRightVisible" class="alpheios-panel__header-action-btn"
                  uk-icon="icon: chevron-right; ratio: 2"></span>
            <span @click="close" class="alpheios-panel__header-action-btn" uk-icon="icon: close; ratio: 2"></span>
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
                    <div :id="data.inflectionIDs.localeSwitcher" class="alpheios-ui-form-group"></div>
                    <div :id="data.inflectionIDs.viewSelector" class="alpheios-ui-form-group"></div>
                    <div :id="data.inflectionIDs.tableBody"></div>
                </div>
                <div v-show="data.tabs.status" data-element="statusPanel">
                    <div v-html="data.messages"></div>
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
            <span :class="{ active: data.tabs.definitions }" @click="changeTab('definitions')"
                  class="alpheios-panel__nav-btn uk-icon" data-element="definitionsTab" data-tab-group="contentTabs"
                  data-target-name="definitionsPanel" uk-icon="icon: comment; ratio: 2"></span>

                <span v-bind:class="{ active: data.tabs.inflections }" @click="changeTab('inflections')"
                      class="alpheios-panel__nav-btn uk-icon" data-element="inflectionsTab" data-tab-group="contentTabs"
                      data-target-name="inflectionsPanel" uk-icon="icon: table; ratio: 2"></span>

                <span v-bind:class="{ active: data.tabs.status }" @click="changeTab('status')"
                      class="alpheios-panel__nav-btn uk-icon" uk-icon="icon: clock; ratio: 2"
                      data-element="statusTab" data-tab-group="contentTabs" data-target-name="statusPanel"></span>

                <span v-bind:class="{ active: data.tabs.options }" @click="changeTab('options')"
                      class="alpheios-panel__nav-btn uk-icon" uk-icon="icon: cog; ratio: 2" data-element="optionsTab"
                      data-tab-group="contentTabs" data-target-name="optionsPanel"></span>

                <span v-bind:class="{ active: data.tabs.info }" @click="changeTab('info')"
                      class="alpheios-panel__nav-btn uk-icon" uk-icon="icon: info; ratio: 2" data-element="infoTab"
                      data-tab-group="contentTabs" data-target-name="infoPanel"></span>
            </div>
        </div>
    </div>
</template>
<script>
  import Setting from './setting.vue'
  import ShortDef from './shortdef.vue'
  import Info from './info.vue'
  import interact from 'interactjs'

  export default {
    name: 'Panel',
    components: {
      setting: Setting,
      shortdef: ShortDef,
      info: Info
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

    .auk .uk-icon.alpheios-panel__header-action-btn {
        display: block;
        width: 40px;
        height: 40px;
        margin: 0 10px;
        cursor: pointer;
    }

    .alpheios-panel__header-action-btn:hover {
        fill: #FFF;
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
    }

    .auk .uk-icon.alpheios-panel__nav-btn {
        cursor: pointer;
        margin: 20px 10px;
    }
</style>
