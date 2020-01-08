<template>
  <div class="inputWrapper">
    <label :for="inputId">{{inputLabel}}</label>
    <textarea :id="inputId" :placeholder="inputPlaceholder" rows="10" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" @focus="setFocus()"></textarea>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TextArea',
  props: {
    value: String,
    inputPlaceholder: String,
    inputId: String,
    inputLabel: String,
    resize: Boolean
  },
  data: () => {
    return {

    };
  },

  methods: {
    setFocus () {
      this.$emit('focus');
    },

    // Resizes TextArea (height only) to content on Init and @keyup, not prefferable
    resizeField () {

    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
