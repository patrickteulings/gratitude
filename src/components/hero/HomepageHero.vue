<template>
  <div class="homepage-hero">
    <div class="numberbar">
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount">{{gratitudes.length}}</span>
          <span class="numberbar-item__description">gratitudes</span>
        </div>
      </div>
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount">{{ streakDays }} </span>
          <span class="numberbar-item__description">streak</span>
        </div>
      </div>
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount">{{gratitudes.length}}</span>
          <span class="numberbar-item__description">gratitudes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

interface Gratitude {
  timeStamp: any;
  dayStamp?: any;
  title: string;
  body: string;
  color?: string;
}

// Core
import Vue from 'vue';

// Helpers
import { getStreak, getUniqueDates, getDayBefore, isEqualDate } from '@/helpers/dateHelper';

import { IGratitude } from '@/interfaces/gratitude';

export default Vue.extend({
  name: 'HomepageHero',
  props: {
    testvalue: {
      type: String,
      default: 'hoi'
    },
    gratitudes: {
      type: Array,
      default: []
    }
  },

  components: {},

  data: () => {
    return {
      streakDays: 0,
      iets: 'alles',
      menuIsOpen: false
    };
  },

  methods: {
    getStreak (data: IGratitude[]) {
      let streak: number = 0;
      const arr = Array.from(getUniqueDates (data));

      const today = new Date();
      let dayBefore = new Date();
      dayBefore = getDayBefore(dayBefore);

      for (const item of arr) {
        const el = item as [];
        const el2 =  [...el];
        const el3 = el2[0] as IGratitude;

        console.log(dayBefore, el3.dayStamp.toDate());
        // console.log(dayBefore.getTime(), el3.dayStamp.toDate().getTime())
        console.log(isEqualDate(dayBefore, el3.dayStamp.toDate()));
        console.log('--');
        if (dayBefore.getTime() === el3.dayStamp.toDate().getTime()) {
          console.log('jee');
        }
        let x = 0;
        while (x < 10) {
          x += 1;
          streak += 1;
          console.log('huh');
        }

        // while (isEqualDate(dayBefore, el3.dayStamp.toDate())) {
        //   streak += 1;
        // }
          // console.log('hier niet', dayBefore, el3.dayStamp.toDate());

        // const arrr: IGratitude[0] = item[0] as IGratitude
        // const myItem: IGratitude = item[0] as IGratitude;
        // if (item[0].dayStamp.toDate() === dayBefore) {
        //   console.log()
        // }
        // const found = arr.find((ite: any) => ite[0].dayStamp.toDate() === dayBefore);
        // console.log(el3);
      }

      this.streakDays = streak;
    }
  },

  mounted () {
    this.getStreak(this.gratitudes as IGratitude[]);
  }
});
</script>


