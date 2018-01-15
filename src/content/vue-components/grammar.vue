<template>
  <div class="alpheios-grammar">
    <div class="alpheios-grammar__provider" v-if="res.provider">{{ res.provider.toString() }}</div>
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
    },

    computed: {
      grammarProvider: function () {
        return (this.res.provider) ? this.res.provider.toString() : ''
      }
    }
  }
</script>
<style lang="scss">
    @import "../styles/alpheios";

    .alpheios-grammar {
        display: flex;
        flex-direction: column;
    }

    .alpheios-grammar__provider {
        flex: 1 1 auto;
        font-size: $alpheios-base-font-size;
        font-weight: normal;
        color: $alpheios-toolbar-color;
        font-style: italic;
        padding: 20px;
    }

    .alpheios-grammar__frame {
        flex: 1 1 100vh;
    }
</style>
