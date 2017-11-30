<template>
    <modal name="popup"
           transition="nice-modal-fade"
           classes="popup"
           :min-width="200"
           :min-height="200"
           :pivot-y="0.5"
           :adaptive="true"
           :resizable="true"
           :draggable="true"
           :scrollable="false"
           :reset="true"
           width="60%"
           height="60%"
           @before-open="beforeOpen"
           @opened="opened"
           @closed="closed"
           @before-close="beforeClose">
        <div class="popup-content">
            <button v-on:click="closePopup">Close</button>
            <h2>{{ $root.popupTitle }}</h2>
            <div v-html="$root.popupContent"></div>
            <button v-on:click="openPanel">Extended data ...</button>
        </div>
    </modal>
</template>
<script>
  export default {
    name: 'Popup',
    methods: {
      openPanel () {
        console.log('Opening a panel to show extended results')
        this.$root.$modal.hide('popup')
        this.$root.panel.open()
      },

      closePopup () {
        this.$root.$modal.hide('popup')
      },

      beforeOpen () { },

      beforeClose () { },

      opened (e) {
        // e.ref should not be undefined here
        console.log('opened', e)
        console.log('ref', e.ref)
      },

      closed (e) {
        console.log('closed', e)
      }
    },
    mounted () {
      console.log('Popup is mounted')
    },
    watch: {
      popupContent: function (value) {
        console.log('Popup content changed to ' + value)
      }
    }
  }
</script>
<style>
    .popup {
        border-radius: 5px;
        background: #F7F7F7;
        box-shadow: 5px 5px 30px 0 rgba(46, 61, 73, 0.6);
    }

    .popup-content {
        padding: 20px;
        font-size: 14px;
    }

    .v--modal-overlay[data-modal="popup"] {
        background: rgba(0, 0, 0, 0.0);
    }
</style>
