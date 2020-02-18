<template>
  <div class="dropdown dropDownWrapper" :class="classModifier">
    <div class="dropdown__trigger" :class="{'is-open' : isOpen}" :style="getItemColor(selected)" @click="toggleDropdown">{{ getFormattedItemLabel(selected) }}</div>
    <div class="dropdown__list" :class="{'is-open' : isOpen}">
      <div class="dropdown__item" :class="[isSelectedItem(colorItem) ? 'hidden': '']" :style="getItemColor(colorItem)" @click="setSelected(colorItem)" v-for="(colorItem) in listData" :key="colorItem.value">
        {{ getFormattedItemLabel(colorItem) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';

// Helpers
import { firstLetterUpperCase } from '@/helpers/stringHelper';
import { EventBus } from '@/helpers/eventbus';

// Interfaces
import { IColorItem } from '@/interfaces/color';


export default Vue.extend({
  name: 'DropDown',

  props: {
    listData: Array,
    classModifier: String
  },

  data: () => {
    return {
      selected: {
        label: 'select a mood',
        value: '#999'
      } as IColorItem,
      isOpen: false
    };
  },

  methods: {
    getItemColor (colorSetting: IColorItem): string {
      return `color: ${colorSetting.value}`;
    },

    setSelected (colorItem: IColorItem): void {
      this.selected = colorItem;
      this.closeDropDown();
      this.$emit('onUpdate', colorItem);
    },

    getFormattedItemLabel (colorItem: IColorItem) {
      return firstLetterUpperCase(colorItem.label);
    },

    isSelectedItem (item: IColorItem) {
      return this.selected === item;
    },

    toggleDropdown (): void {
      (this.isOpen) ? this.closeDropDown() : this.openDropDown();
    },

    openDropDown (): void {
      console.log('open');
      this.isOpen = true;
    },

    closeDropDown (): void {
      this.isOpen = false;
    },

    resetDropdown (): void {
      this.selected = { label: 'Select a color', value: '#616161' };
    },

    addEvents (): void {
      document.addEventListener('click', (e) => this.handleOutsideClick(e));
      document.addEventListener('touchstart', (e) => this.handleOutsideClick(e));
      EventBus.$on('resetContentEditable', () => this.resetDropdown());
    },

    removeEvents (): void {
      document.removeEventListener('click', (e) => this.handleOutsideClick(e));
      document.removeEventListener('touchstart', (e) => this.handleOutsideClick(e));
    },

    handleOutsideClick (e: Event): void {
      const target = e.target as HTMLElement;

      e.stopPropagation();

      if (!target.closest('.dropDownWrapper')) this.closeDropDown();
    }
  },

  mounted () {
    this.addEvents();
  },

  beforeDestroy () {
    this.removeEvents();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
