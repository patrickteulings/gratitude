<template>
  <div class="dropdown dropDownWrapper" :class="classModifier">
    <div class="dropdown__trigger" :class="{'is-open' : isOpen}" :style="getItemColor(selected)" @click="toggleDropdown">{{selected.label}}</div>
    <div class="dropdown__list" :class="{'is-open' : isOpen}">
      <div class="dropdown__item" :style="getItemColor(colorItem)" @click="setSelected(colorItem)" v-for="(colorItem) in listData" :key="colorItem.value">
      {{ colorItem.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';


interface IColorItem {
  label: string;
  value: string;
}

export default Vue.extend({
  name: 'DropDown',
  props: {
    listData: Array,
    classModifier: String
  },

  data: () => {
    return {
      selected: {
        label: 'select a color',
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
      // this.closeDropDown();
      this.$emit('onUpdate', colorItem);
    },

    toggleDropdown (): void {
      (this.isOpen) ? this.closeDropDown() : this.openDropDown();
    },

    openDropDown (): void {
      this.isOpen = true;
    },

    closeDropDown (): void {
      this.isOpen = false;
    },

    addEvents (): void {
      document.addEventListener('click', (e) => this.handleOutsideClick(e));
      document.addEventListener('touchstart', (e) => this.handleOutsideClick(e));
    },

    removeEvents (): void {
      document.removeEventListener('click', (e) => this.handleOutsideClick(e));
      document.removeEventListener('touchstart', (e) => this.handleOutsideClick(e));
    },

    handleOutsideClick (e: Event): void {
      e.stopPropagation();
      const wrapper = document.querySelectorAll('.dropDownWrapper');
      const target = e.target as HTMLElement;
      console.log(target.closest('.dropDownWrapper'));
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
