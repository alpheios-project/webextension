<template>
    <div id="app">
        <test-modal></test-modal>

        <button class="btn" @click="$modal.show('popup')">
            Test Modal
        </button>
    </div>
</template>

<script>
  import Popup from './components/popup.vue'

  export default {
    name: 'app',
    components: {
      TestModal: Popup
    },
    created () { },
    methods: { },
  }
</script>

<style lang="scss" scoped>
    button.btn {
        outline: none;
        padding: 6px 18px;
        cursor: pointer;
        border-radius: 0;
        color: rgb(13, 119, 182);
        background: rgb(255, 255, 255);
        border: 1px solid rgb(13, 119, 182);
        min-width: 90px;
    }
</style>
