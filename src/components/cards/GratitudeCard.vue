<template>
  <article class="card">
    <div class="card__inner">
      <small class="id">{{ gratitude.id }}</small>
      <h2 class="card__title" @click="gotoDetail(gratitude.id)" :style="{ color: getGratitudeColor(gratitude) }" v-html="gratitude.title"></h2>
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
import { readableDate, getUniqueDates, readableTime } from '@/helpers/dateHelper';
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
      return gratitude.color !== undefined ? gratitude.color : '#999';
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
