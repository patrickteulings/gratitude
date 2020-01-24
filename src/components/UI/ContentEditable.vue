<template>
  <div class="inputWrapper contenteditable" contenteditable="true" @focus="handleFocus" @blur="handleBlur" @input="updateContent" v-html="myContent" :style="getStyle()"></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ContentEditable',
  props: {
    value: String,
    content: String,
    placeholder: String,
    color: String
  },

  data: () => {
    return {
      myContent: '',
      newContent: ''
    };
  },

  methods: {
    updateContent (e: { target: HTMLInputElement}) {
      this.newContent = e.target.innerHTML;
      this.$emit('onUpdate', e.target.innerHTML);
    },

    getStyle () {
      return (this.color !== undefined) ? `color: ${this.color}` : `color: #000000;`;
    },

    handleFocus () {
      if (this.myContent === this.placeholder) {
        this.myContent = '';
      }
      this.$emit('onFocus');
    },

    handleBlur () {
      if (!this.newContent.trim().length) {
        this.myContent = this.placeholder;
      }
    }
  },

  created () {
    if (this.content !== undefined) {
      if (!this.content.length && this.placeholder) {
        this.myContent = this.placeholder;
      } else {
        this.myContent = this.content;
      }
    }
  },
  watch: {
    content (newVal, oldVal) { // watch it
      if (!this.content.length && this.placeholder) {
        this.myContent = this.placeholder;
        this.newContent = this.placeholder;
      } else {
        this.myContent = this.content;
        this.newContent = this.content;
      }
    }
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
