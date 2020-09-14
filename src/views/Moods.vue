<template>
  <div>
    Moods {{userName()}}
    <div class="dropdown__item" v-for="(colorItem) in colors" :key="colorItem.value">
      <div :style="{color: getColorValue(colorItem)}"><span class="bolleke" :style="{background: getColorValue(colorItem)}"></span>{{ colorItem.label }}</div>
    </div>
    <hr>
    <div>
      <input type="text" :value="newColor.value">
      <input type="text" :value="newColor.label">
      <button @click="submitColor()">Add</button>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { computed, reactive, ref, onMounted, toRefs } from '@vue/composition-api';
import defineComponent from '@vue/composition-api';
import { db } from '@/services/firebaseConfigTypeScript';
import { IColorItem } from '@/interfaces/color';



export default defineComponent({
  name: 'Moods',
  setup (props: any, {emit, root}: any) {


    const newColor = reactive<IColorItem>({
      label: 'oranje',
      value: '#ff9900'
    })

    onMounted(() => {
      root.$store.dispatch('bindDefaultColors', { reference: db.collection('gratitudes'), userID: root.$store.getters.user.uid} );
    });

    const colors = computed(() => root.$store.getters.defaultColors );

    const userName = () => root.$store.getters.user.displayName;

    const getColorValue = (color: IColorItem) => color.value;

    const submitColor = () => {
      console.log('submit!', newColor.value, newColor.label);
    };

    return {
      newColor,
      userName,
      colors,
      getColorValue,
      submitColor
    };

  }
});
</script>

<style lang="scss" scoped>
  .bolleke {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ff9900;
  }
</style>
