<template>
  <div>
    <textarea
      :class="['customTextarea', {hasPlaceholderContent: isPlaceholder}, getFieldType() ]"
      :placeholder='getRandomPlaceholder()'
      :style='getStyle()'
      contenteditable='true'
      @focus='handleFocus'
      @blur='handleBlur'
      @input='handleUpdate'
      @keyup="isPlaceholderText"
      rows='1'
      value='lets test'
      v-model="myContent"
      ref="textArea"
    />
  </div>
</template>

<script lang='ts'>

// Core
import Vue from 'vue';

// Events
import { EventBus } from '@/helpers/eventbus';

// Helpers
import { getBeastie } from '@/helpers/beastie';

export default Vue.extend({
  name: 'ContentEditable',
  props: {
    value: String,
    content: {
      type: String,
      default: '',
      required: false
    },
    textAreaType: {
      type: String,
      default: 'body',
      required: false
    },
    color: String
  },

  data: () => {
    return {
      myContent: '',
      newContent: '',
      isPlaceholder: false,
      duplicate: ''
    };
  },

  methods: {
    handleUpdate (e: { target: HTMLInputElement }) {
      this.handleHeight(e.target);
      this.isPlaceholderText();
      this.$emit('onUpdate', e.target.value);
    },

    handleHeight (el: HTMLElement) {
      const style = getComputedStyle(el, null);
      const padding = Number(style.paddingTop) * 2 || 0;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight + padding}px`;
    },

    handleFocus () {
      this.$emit('onFocus');
    },

    handleBlur () {
      this.isPlaceholderText();
    },

    getFieldType () {
      return this.textAreaType === 'title' ? 'customTextarea--title' : 'customTextarea--body';
    },

    getStyle () {
      return this.color !== undefined
        ? `color: ${this.color}`
        : `color: #616161;`;
    },

    isPlaceholderText (): void {
      if (this.myContent !== undefined) {
        this.isPlaceholder = (this.myContent.trim() === '') ? true : false;
      }
    },

    getRandomPlaceholder (): string {
      return getBeastie();
    },

    reset () {
      this.myContent = this.duplicate;
    }
  },

  mounted () {

    if (this.content !== undefined) {
      this.myContent = this.content;
      this.duplicate = this.content.slice();
    } else {
      this.isPlaceholderText();
    }

    this.handleHeight(this.$el.querySelectorAll('.customTextarea')[0] as HTMLElement);

    setTimeout(() => {
      this.handleHeight(this.$el.querySelectorAll('.customTextarea')[0] as HTMLElement);
    }, 1000);

    EventBus.$on('resetContentEditable', () => this.reset() );
  },

  watch: {
    content (newValue, oldValue) {
      this.myContent = newValue;
      this.duplicate = newValue;
      this.handleHeight(this.$el.querySelectorAll('.customTextarea')[0] as HTMLElement);
      setTimeout(() => {
        this.handleHeight(this.$el.querySelectorAll('.customTextarea')[0] as HTMLElement);
      }, 10);
    }
  }
});
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.contenteditable {
  transition: all 0.3s;
}

.hasPlaceholderContent {
  opacity: 0.6;
  font-weight: 100;
}
</style>
