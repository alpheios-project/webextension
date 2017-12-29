<template>
    <div class="auk-margin">
        <label class="uk-form-label">{{labeltext}}</label>
        <select v-model="selectedItem" class="uk-select">
            <option v-for="item in items">{{item}}</option>
        </select>
    </div>
</template>
<script>
  export default {
    name: 'Setting',
    props: {
      selected: {
        type: String,
        required: true
      },
      items: {
        type: Array,
        required: true
      },
      labeltext: {
        type: String,
        required: true
      },
    },
    computed: {
      selectedItem: {
        get: function () {
          return this.selected
        },
        set: function (newValue) {
          this.$emit('change', newValue)
        }
      }
    }
  }
</script>
<style>

</style>