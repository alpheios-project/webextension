<template>
    <div ref="popup" class="alpheios-popup auk" v-bind:class="data.classes"
         v-show="visible" :data-notification-visible="data.notification.visible">
        <div class="alpheios-popup__header">
            <div class="alpheios-popup__header-text">
                <span v-show="data.status.selectedText" class="alpheios-popup__header-selection">{{data.status.selectedText}}</span>
                <span v-show="data.status.languageName" class="alpheios-popup__header-word">({{data.status.languageName}})</span>
            </div>
            <span class="alpheios-popup__close-btn" @click="closePopup">
                <close-icon></close-icon>
            </span>
        </div>
        <div v-show="!data.morphDataReady"
             class="alpheios-popup__definitions alpheios-popup__definitions--placeholder uk-text-small">
            No lexical data is available yet
        </div>
        <div v-show="data.morphDataReady" class="alpheios-popup__definitions uk-text-small">
            <morph :lexemes="lexemes" :definitions="definitions" :linkedfeatures="linkedfeatures"></morph>
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
  import CloseIcon from '../images/inline-icons/close.svg';

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
      notificationClasses: function () {
        return {
          'alpheios-popup__notifications--important': this.data.notification.important
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

      resizeListener(event) {
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

      dragMoveListener(event) {
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
      const resizableSettings = {
        preserveAspectRatio: false,
        edges: { left: true, right: true, bottom: true, top: true },
        restrictSize: {
          min: { width: this.data.minWidth, height: this.data.minHeight }
        },
        restrictEdges: {
          outer: document.body,
          endOnly: true,
        }
      };
      const draggableSettings = {
        inertia: true,
        autoScroll: false,
        restrict: {
          restriction: document.body,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onmove: this.dragMoveListener
      };
      interact(this.$el)
        .resizable(resizableSettings)
        .draggable(draggableSettings)
        .on('resizemove', this.resizeListener);
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
        font-size: 16px;
        font-weight: 700;
        color: $alpheios-toolbar-color;
    }

    .alpheios-popup__header-word {
        font-size: 14px;
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
        font-size: 12px;
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

    .alpheios-popup__definitions {
        flex: 1 1 260px;
        box-sizing: border-box;
        margin: 10px 10px 0;
        overflow: auto;
        padding: 10px;
        border: 1px solid $alpheios-sidebar-header-border-color;
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
</style>
