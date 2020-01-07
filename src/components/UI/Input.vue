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
      console.log('jee from input');
      this.$emit('focus');
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.inputWrapper {
  text-align: left;
  margin-bottom: 1rem;
}

label {
  color: #1F1F1C;
  display: block;
  margin-bottom: 1rem;
}


h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
