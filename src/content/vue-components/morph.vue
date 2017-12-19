<template>
  <div>{{ lexemes.length }}</div>
</template>
<script>
  export default {
    name: 'Morph',
    props: ['lexemes'],
    mounted () {
      console.log('Morph is mounted')
    },
    watch: {
      lexemes: function (newVal, oldValue) {
        console.log('Lexemes changed to ' + newVal)
      }
    }
  }
</script>
<style>
</style>
