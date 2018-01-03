<template>
  <div class="alpheios-definition__short">
      <span class="alpheios-definition__text">{{ definition.text }}</span>
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
<style>
  .alpheios-definition__text {
     color: #0E2233;  /* TODO use variables */
     font-weight: bold;
  }
</style>
