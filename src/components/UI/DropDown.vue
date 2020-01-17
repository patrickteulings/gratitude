<template>
  <div class="dropDownWrapper" :class="classModifier">
    <div class="dropdown__trigger" :style="getItemColor(selected)" @click="toggleDropdown">{{selected.label}}</div>
    <div class="dropdown__list" :class="{'is-open' : isOpen}" v-for="(colorItem) in listData" :key="colorItem.value">
      <div :style="getItemColor(colorItem)" @click="setSelected(colorItem)">{{ colorItem.label }}</div>

      {{ colorItem.value }}
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
    },

    toggleDropdown (): void {
      (this.isOpen) ? this.closeDropDown() : this.openDropDown();
    },

    openDropDown (): void {
      this.isOpen = true;
    },

    closeDropDown (): void {
      this.isOpen = false;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
