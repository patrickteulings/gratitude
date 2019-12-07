<template>
  <div class="inputWrapper">
    <label :for="inputId">{{inputLabel}}</label>
    <input :id="inputId" :placeholder="inputPlaceholder" type="text" v-bind:value="value" v-on:input="$emit('input', $event.target.value)">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import { firestorePlugin } from 'vuefire';
import { db } from '@/services/firebaseConfigTypeScript';

Vue.use(firestorePlugin);

export default Vue.extend({
  name: 'Input',
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
