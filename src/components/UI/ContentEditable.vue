<template>
  <div class="inputWrapper">
    <div id="gratitudeBodyEditable" contenteditable="true" @click="setFocus()" @keyup="editingContent">
      {{ content }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ContentEditable',
  props: {
    value: String,
    content: String,
    contentPlaceholder: String,
    inputLabel: String
  },
  data: () => {
    return {

    };
  },

  methods: {
    setFocus () {
      this.$emit('focus');
    },

    editingContent (event: Event) {
      const el = document.getElementById('gratitudeBodyEditable');
      if (el) this.$emit('edit', el.innerText);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
