<template>
    <div class="uk-margin">
        <label class="uk-form-label">{{data.labelText}}</label>
        <select v-model="selected" class="uk-select">
            <option v-for="item in data.textValues()">{{item}}</option>
        </select>
    </div>
</template>
<script>
  export default {
    name: 'Setting',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    computed: {
      selected: {
        get: function () {
          return this.data.currentTextValue()
        },
        set: function (newValue) {
          this.$emit('change', this.data.name, newValue)
        }
      }
    }
  }
</script>
<style lang="scss">

</style>