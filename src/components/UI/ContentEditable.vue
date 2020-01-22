<template>
  <div class="inputWrapper" contenteditable="true" @focus="dispatchFocus" @input="updateContent" v-html="myContent" :style="getStyle()"><slot></slot></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ContentEditable',
  props: {
    value: String,
    inputPlaceholder: String,
    inputId: String,
    inputLabel: String,
    resize: Boolean,
    content: String,
    placeholder: String,
    color: String
  },

  data: () => {
    return {
      myContent: ''
    };
  },

  methods: {
    setFocus () {
      this.$emit('focus');
    },

    updateContent (e: { target: HTMLInputElement}) {
      this.$emit('onUpdate', e.target.innerHTML);
    },

    getStyle () {
      return (this.color !== undefined) ? `color: ${this.color}` : `color: #000000;`;
    },

    dispatchFocus () {
      this.$emit('onFocus');
    }
  },

  created () {
    console.log('hier', this.content);
    if (this.content !== undefined) {
      if (!this.content.length && this.placeholder) {
        this.myContent = this.placeholder;
      } else {
        this.myContent = this.content;
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
