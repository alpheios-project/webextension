<template>
    <div class="uk-margin">
      <p class="uk-text-lead alpheios-text">Getting Started</p>
      <p class="uk-text-left uk-text-small alpheios-text">Activate on a page with Latin, Ancient Greek, Arabic or Persian text.</p>
      <p class="uk-text-left uk-text-small alpheios-text">Double-click on a word to retrieve morphology and short definitions.</p>
      <p class="uk-text-left uk-text-small alpheios-text">Alpheios will try to detect the language of the word from the page. If it cannot it will use the default language. </p>
      <p class="uk-text-left uk-text-small alpheios-text">Click the Settings wheel to change the default language, default dictionaries or to disable the popup (set UI Type to 'panel').</p>
      <p class="uk-text-left uk-text-small alpheios-text">Use the arrow at the top of this panel to move it from the right to left of your browser window.</p>
    </div>
</template>
<script>
  export default {
    name: 'Info',
    props: {
      // Temporary commented out to avoid warnings
      /*data: {
        type: Object,
        required: true
      }*/
    },
  }
</script>
<style lang="scss">
  @import "../styles/alpheios";

  .alpheios-text {
    font-family: $alpheios-font-family;
    color: $alpheios-copy-color;
  }

</style>
