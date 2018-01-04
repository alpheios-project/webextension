<template>
    <div ref="popup" class="alpheios-popup" v-show="visible">
        <span class="alpheios-popup__close-btn" @click="closePopup" uk-icon="icon: close; ratio: 2"></span>
        <div class="alpheios-popup__message-area">
          <ul>
            <li @beforehide="clearMessages" v-for="message in messages" class="alpheios-popup__message uk-alert-primary" uk-alert>
              <a class="uk-alert-close" uk-close></a>
              {{ message }}
            </li>
          </ul>
        </div>
        <morph v-show="morphdataready" :lexemes="lexemes" :definitions="definitions"></morph>
        <div class="uk-button-group">
          <button @click="showInflectionsPanelTab" v-show="defdataready" class="uk-button uk-button-primary uk-button-small alpheios-popup__more-btn">Inflect</button>
          <button @click="showDefinitionsPanelTab" v-show="infldataready" class="uk-button uk-button-primary uk-button-small alpheios-popup__more-btn">Define</button>
        </div>
    </div>
</template>
<script>
  import Morph from './morph.vue'
  import interact from 'interactjs'

  export default {
    name: 'Popup',
    components: { morph: Morph },
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
      visible: {
        type: Boolean,
        required: true
      },
      defdataready: {
        type: Boolean,
        required: true
      },
      infldataready: {
        type: Boolean,
        required: true
      },
      morphdataready: {
        type: Boolean,
        required: true
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

      showDefinitionsPanelTab () {
        this.$emit('showdefspaneltab')
      },

      showInflectionsPanelTab () {
        this.$emit('showinflpaneltab')
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
        background: #FFF;
        border: 1px solid lightgray;
        width: 400px;
        height: 500px;
        z-index: 1000;
        position: fixed;
        left: 200px;
        top: 100px;
        padding: 50px 20px 20px;
        box-sizing: border-box;  /* Required for Interact.js to take element size with paddings and work correctly */
        overflow: auto;
        font-family: $alpheios-font-family;
        font-size: $alpheios-base-font-size;
        color: $alpheios-copy-color;
    }

    .alpheios-popup li {
        list-style-type: none;
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        font-size: 12px;
        color: $alpheios-copy-color;
        padding: 0;
    }

    .alpheios-popup__close-btn {
        color: $alpheios-copy-color;
        display: block;
        width: 40px;
        height: 40px;
        top: 0;
        right: 0;
        margin: 10px;
        cursor: pointer;
        position: absolute;
    }

    .alpheios-popup__message-area {
        margin-bottom: 20px;
    }

    .alpheios-popup__content-area {
        margin-bottom: 20px;
    }

    .alpheios-popup__more-btn {
        float: right;
        margin-bottom: 10px;
    }

    li.alpheios-popup__message {
        display:none;
    }

    li.alpheios-popup__message:last-child {
        display:block;
    }

</style>
