<template>
  <div class="inputWrapper">
    <label :for="inputId" v-if="inputLabel">{{inputLabel}}</label>
    <input :id="inputId" :placeholder="inputPlaceholder" type="text" :class="inputClassname" :style="getInputColor()" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" @focus="setFocus()">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Input',
  props: {
    value: String,
    inputPlaceholder: String,
    inputId: String,
    inputLabel: String,
    inputColor: String,
    inputClassname: String
  },

  data: () => {
    return {

    };
  },

  methods: {
    getInputColor (): string {
      return (this.inputColor !== '') ? `color: ${this.inputColor}` : `color: #000000;`;
    },

    setFocus () {
      this.$emit('focus');
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
