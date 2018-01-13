<template>
  <div class="alpheios-grammar">
    <div class="alpheios-grammar__provider">{{ res.provider.toString() }}</div>
    <iframe class="alpheios-grammar__frame" :src="res.url"></iframe>
  </div>
</template>
<script>
  export default {
    name: 'Grammar',
    props: {
      res: {
        type: Object,
        required: true
      },
    }
  }
</script>
<style lang="scss">
    @import "../styles/alpheios";

    .alpheios-grammar__provider {
      font-size: $alpheios-base-font-size;
      font-weight: normal;
      color: $alpheios-toolbar-color;
      font-style: italic;
      margin-top: .5em;
      margin-bottom: .5em;
    }

    .alpheios-grammar, .alpheios-grammar__frame {
        height: 100%;
        width: 100%;
    }
</style>
