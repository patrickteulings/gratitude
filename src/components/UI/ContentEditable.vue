<template>
  <div class="inputWrapper contenteditable" :class="{ hasPlaceholderContent: isPlaceholder }" contenteditable="true" @focus="handleFocus" @blur="handleBlur" @input="updateContent" v-html="myContent" :style="getStyle()"></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ContentEditable',
  props: {
    value: String,
    content: String,
    contentPlaceholder: String,
    color: String
  },

  data: () => {
    return {
      myContent: '',
      newContent: '',
      isPlaceholder: false
    };
  },

  methods: {
    updateContent (e: { target: HTMLInputElement}) {
      this.newContent = e.target.innerHTML;
      this.isPlaceholderText();
      this.$emit('onUpdate', e.target.innerHTML);
    },

    getStyle () {
      return (this.color !== undefined) ? `color: ${this.color}` : `color: #000000;`;
    },

    handleFocus () {
      if (this.myContent.trim() === this.contentPlaceholder.trim() || this.myContent.trim() === '') {
        this.myContent = '';
      }
      this.isPlaceholderText();
      this.$emit('onFocus');
    },

    handleBlur () {
      if (!this.newContent.trim().length) {
        this.myContent = this.contentPlaceholder;
      }
      this.isPlaceholderText();
    },

    reset () {
      console.log('reset');
    },

    isPlaceholderText () {
      this.isPlaceholder = (this.newContent.trim() === this.contentPlaceholder.trim() || this.newContent.trim() === '') ? true : false;
    }
  },

  created () {
    if (this.content !== undefined) {
      if (!this.content.length && this.contentPlaceholder) {
        this.myContent = this.contentPlaceholder;
      } else {
        this.myContent = this.content;
      }
    }
    this.isPlaceholderText();
  },
  watch: {
    // content (newVal, oldVal) { // watch it
    //   if (!this.content.length && this.contentPlaceholder) {
    //     this.myContent = this.contentPlaceholder;
    //     this.newContent = this.contentPlaceholder;
    //   } else {
    //     this.myContent = this.content;
    //     this.newContent = this.content;
    //   }
    // }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .contenteditable {
    transition: all 0.3s;
  }

  .hasPlaceholderContent {
    opacity: 0.6
  }
</style>
