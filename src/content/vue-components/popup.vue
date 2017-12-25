<template>
    <div ref="popup" class="alpheios-popup" v-show="visible">
        <span class="alpheios-popup__close-btn" @click="closePopup" uk-icon="icon: close; ratio: 2"></span>
        <div class="alpheios-popup__message-area" v-html="messages"></div>
        <div class="alpheios-popup__content-area" v-html="content"></div>
        <button @click="showInflectionsPanelTab" v-show="defdataready" class="uk-button uk-button-default alpheios-popup__more-btn">Go to Inflections</button>
        <button @click="showDefinitionsPanelTab" v-show="infldataready" class="uk-button uk-button-default alpheios-popup__more-btn">Go to Full Definitions</button>
    </div>
</template>
<script>
  import interact from 'interactjs'

  export default {
    name: 'Popup',
    data: function () {
      return {
        resizable: true,
        draggable: true,
      }
    },
    props: {
      messages: {
        type: String,
        required: true
      },
      content: {
        type: String,
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
      }
    },
    methods: {
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
        console.log('Resize listener')
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
          min: { width: 300, height: 300 }
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
<style>
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
    }

    .alpheios-popup__close-btn {
        color: gray;
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
    }
</style>