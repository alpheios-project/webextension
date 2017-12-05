<template>
    <modal name="popup"
           transition="nice-modal-fade"
           classes="alpheios-popup auk"
           :min-width="200"
           :min-height="200"
           :pivot-y="0.5"
           :adaptive="true"
           :resizable="true"
           :draggable="true"
           :scrollable="false"
           :clickToClose="false"
           :reset="true"
           width="60%"
           height="60%"
           @before-open="beforeOpen"
           @opened="opened"
           @closed="closed"
           @before-close="beforeClose">
        <div class="alpheios-popup__content">
            <button v-on:click="closePopup" class="alpheios-popup__close-btn"><span uk-icon="icon: close"></span></button>
            <h2>{{ $root.popupTitle }}</h2>
            <div v-html="$root.popupContent"></div>
            <button v-on:click="openPanel" class="uk-button uk-button-default alpheios-popup__more-btn">Extended data ...</button>
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
    .alpheios-popup {
        border-radius: 0;
        box-shadow: 5px 5px 30px 0 rgba(46, 61, 73, 0.6);
    }

    .alpheios-popup__content {
        padding: 20px;
        font-size: 14px;
        position: relative;
    }

    .alpheios-popup__close-btn {
        border: none;
        background: transparent;
        right: 1rem;
        top: 1rem;
        position: absolute;
        cursor: pointer;
    }

    .auk .uk-button.alpheios-popup__more-btn {
        margin-top: 30px;
        float: right;
    }

    .v--modal-overlay[data-modal="popup"] {
        background: rgba(0, 0, 0, 0.0);
    }
</style>
