<template>
  <div class="alpheios-info uk-margin">
    <div class="alpheios-info__versiontext">{{ data.manifest.name }} {{ data.manifest.version }}</div>
    <div class="alpheios-info__helptext">
      <h3>Getting Started</h3>
      <p>Activate on a page with Latin, Ancient Greek, Arabic or Persian text.</p>
      <p>Double-click on a word to retrieve morphology and short definitions.</p>
      <p>Alpheios will try to detect the language of the word from the page markup. If it cannot it will use the default language (currently using <b>{{ data.languageName }}</b>). </p>
      <p>Click the Settings wheel to change the default language, default dictionaries or to disable the popup (set UI Type to 'panel').</p>
      <p>Use the arrow at the top of this panel to move it from the right to left of your browser window.</p>
      <p>You can reopen this panel at any time by selecting 'Info' from the Alpheios Reading Tools option in your browser's context menu.</p>
      <p>Deactivate Alpheios by clicking the toolbar icon or choosing 'Deactivate' from the Alpheios Reading Tools option in your browser's context menu.</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Info',
    props: {
      data: {
        type: Object,
        required: true
      }
    }
  }
</script>
<style lang="scss">
  @import "../styles/alpheios";

  .alpheios-info {
    font-family: $alpheios-font-family !important;
    font-size: $alpheios-base-font-size !important;
    color: $alpheios-copy-color !important;
  }

  .alpheios-info .alpheios-info__helptext p {
    font-size: 0.875*$alpheios-base-font-size;
    font-family: $alpheios-font-family !important;
    font-size: $alpheios-base-font-size !important;
    color: $alpheios-copy-color !important;
  }

  .alpheios-info .alpheios-info__versiontext {
    font-size: 0.675*$alpheios-base-font-size;
    margin-bottom: 1em;
  }

</style>
