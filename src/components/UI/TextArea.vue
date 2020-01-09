<template>
  <div class="inputWrapper">
    <label :for="inputId">{{inputLabel}}</label>
    <textarea :id="inputId" data-autoresize :placeholder="inputPlaceholder" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" @focus="setFocus()" @keyup="resizeField" style="border: 1px;"></textarea>
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
      const el: any = document.querySelectorAll('[data-autoresize]')[0];

      if (el !== undefined) {

        // Resist temptation to move the next line to the top of the closure, it will break stuff
        // (text legibility (cut-off) in the last line)
        const offset = el.offsetHeight - el.clientHeight;

        el.style.height = 'auto';
        el.style.height = el.scrollHeight + offset + 'px';
      }
    }
  },

  mounted () {
   this.resizeField();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
textarea {
  box-sizing: border-box;
  resize: none;
}
</style>
