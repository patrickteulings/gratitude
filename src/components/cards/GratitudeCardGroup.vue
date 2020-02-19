<template>
  <div class="gratitude-group">
    <div class="gratitude-group__date">{{ getReadableDate(gratitudeGroup[0].dayStamp.toDate(), true) }}</div>
    <GratitudeCard v-for="item in gratitudeGroup" :gratitude="item" :key="item.id" />
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';

// Components
import GratitudeCard from '@/components/cards/GratitudeCard.vue';

// Helpers
import { readableDate, readableTime } from '@/helpers/dateHelper';
import { getGratitudesByDay } from '@/helpers/gratitudeHelper';
import { isEmptyArray } from '@/helpers/emptyHelper';


export default Vue.extend({
  name: 'GratitudeCardGroup',
  components: {
    GratitudeCard
  },

  props: {
    gratitudeGroup: Array
  },

  data: () => {
    return {

    };
  },

  methods: {
    getReadableDate (date: Date, longNames: boolean = false) {
      return readableDate(date, longNames);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
