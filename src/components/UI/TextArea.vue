<template>
  <div class="inputWrapper">
    <label :for="inputId">{{inputLabel}}</label>
    <textarea :id="inputId" :placeholder="inputPlaceholder" rows="10" v-bind:value="value" v-on:input="$emit('input', $event.target.value)"></textarea>
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
    inputLabel: String
  },
  data: () => {
    return {

    };
  },
  methods: {

  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.inputWrapper {
  text-align: left;
  margin-bottom: 1rem;
}

input[type="text"] {
  border: 1px solid #1F1F1C;
  border-radius: 2px;
  padding: 1rem;
  font-size: 1rem;
}

label {
  color: #1F1F1C;
  display: block;
  margin-bottom: 1rem;
}
</style>
