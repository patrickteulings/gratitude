<template>
  <article class="card" @click="gotoDetail(gratitude.id)">
    <div class="card__inner">
      <small class="id">{{ gratitude.id }}</small>
      <h2 class="card__title" :style="{ color: getGratitudeColor(gratitude) }" v-html="gratitude.title"></h2>
      <p class="card__body" v-html="gratitude.body"></p>
      <small class="card__createdAt">Created on {{ getReadableDate(gratitude.timeStamp.toDate()) }} at {{ getReadableTime(gratitude.timeStamp.toDate()) }}</small>
    <div class="card__moodstrip" :style="{ background: getGratitudeColor(gratitude) }"></div>
    </div>
  </article>
</template>

<script lang="ts">

// Core
import Vue from 'vue';

// Helpers
import { readableDate, readableTime } from '@/helpers/dateHelper';
import { getGratitudesByDay } from '@/helpers/gratitudeHelper';
import { isEmptyArray } from '@/helpers/emptyHelper';


export default Vue.extend({
  name: 'GratitudeCard',
  components: {

  },

  props: {
    gratitude: Object
  },

  data: () => {
    return {

    };
  },

  methods: {
    getGratitudeColor (gratitude: any) {
      // console.log(process.env);
      // console.log(process.env.VUE_APP_MY_ENV_VARIABLE);
      let colorValue;

      if (gratitude.mood) {
        colorValue = gratitude.mood.value;
      } else if (gratitude.color !== undefined) {
        colorValue = gratitude.color;
      } else {
        colorValue = '#616161';
      }
      return colorValue;
    },

    getReadableDate (date: Date, longNames: boolean = false) {
      return readableDate(date, longNames);
    },

    getReadableTime (date: Date, longNames: boolean = false) {
      return readableTime(date, longNames);
    },

    gotoDetail (id: string) {
     this.$router.push({ path: `/details/gratitude/${id}` });
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
