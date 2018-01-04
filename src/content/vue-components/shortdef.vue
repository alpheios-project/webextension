<template>
  <div class="alpheios-definition__short">
      <span class="alpheios-definition__lemma">{{ definition.lemmaText }}:</span>
      <span class="alpheios-definition__text">{{ definition.text }}</span>
      <span v-if="definition.provider" class="alpheios-definition__provider">{{ definition.provider.toString() }}</span>
  </div>
</template>
<script>
  export default {
    name: 'ShortDef',
    props: ['definition'],
    methods: {},
    mounted () {
      console.log('ShortDef is mounted')
    }
  }
</script>
<style lang="scss">
  @import "../styles/alpheios";

  .alpheios-definition__text {
     color: $alpheios-tools-color;
     font-weight: bold;
  }
</style>
