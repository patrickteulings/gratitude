<template>
  <div class="homepage-hero">
    <div class="numberbar">
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount">{{ streakDays }} </span>
          <span class="numberbar-item__description">Current streak (days)</span>
        </div>
      </div>
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount" v-if="gratitudes">{{gratitudes.length}}</span>
          <span class="numberbar-item__description">gratitudes</span>
        </div>
      </div>
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount" v-if="gratitudes">{{dataObject.length}}</span>
          <span class="numberbar-item__description">days of gratitude</span>
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
      menuIsOpen: false,
      dataObject: []
    };
  },

  methods: {
    getStreak (data: IGratitude[]) {
      const arr = Array.from(getUniqueDates (data));
      const today = new Date();

      let startDay = new Date();
      let streak: number = 0;
      let todayHasGratitude = false;
      let yesterdayHasGratitude = false;

      let dayBefore = new Date();
      dayBefore = getDayBefore(dayBefore);


      // First we need to find out if the user has posted today
      // If there is a post today, it should count in the streak
      // If not, we start by checking 'yesterday', because the user
      // might have just opened the app, so 'today' COULD NEVER have a post
      // and the streak would always be zero
      const latest = arr[0] as IGratitude[];
      const latestDate = latest[0] as IGratitude;

      if (isEqualDate(latestDate.dayStamp.toDate(), today)) {
        streak += 1;
        todayHasGratitude = true;
        startDay = today;
      }


      // If the above is not true, check to see if yesterday had any gratitudes,
      // otherwise there is no 'Current streak', so ony continue if one of these is true;

      if (!todayHasGratitude) {
        const yesterday = getDayBefore(today);

        if (isEqualDate(latestDate.dayStamp.toDate(), yesterday)) {
          streak += 1;
          yesterdayHasGratitude = true;
          startDay = today;
        }
      }


      // If both today and yesterday have no Gratitudes, theres not really a streak,
      // so abort. If only today has a Gratitude return only today

      if (!todayHasGratitude && !yesterdayHasGratitude) return streak;
      if (todayHasGratitude && !yesterdayHasGratitude) { this.streakDays = 1; }


      // Now we know at which point to start counting for you streak
      // Simple check every day 'before', or yesterday, until the quation is false

      // firt reset
      streak = 0;

      let dayToCheck = startDay;

      for (let i = 0; i < 8; i++) {
        let mayContinue = false;

        for (const item of arr) {

          const dayArry = item as IGratitude[];
          const dayEntry = dayArry[0] as IGratitude;
          const found = isEqualDate(dayEntry.dayStamp.toDate(), dayToCheck);
          if (found) streak = streak + 1;
          if (found) mayContinue = true;
        }

        // Finish up, set new day (always yesterday)
        // Update view
        // Check if we can continue
        dayToCheck = getDayBefore(dayToCheck);
        this.streakDays = streak;
        if (!mayContinue) return;
      }
    },

    setTotalDaysOfGratitudes (data: IGratitude[]) {
      this.dataObject = Array.from(getUniqueDates (data));
    }
  },

  mounted () {
    if (this.gratitudes.length) {
      this.getStreak(this.gratitudes as IGratitude[]);
      this.setTotalDaysOfGratitudes(this.gratitudes as IGratitude[]);
    }
  },

  watch: {
    gratitudes () {
      this.getStreak(this.gratitudes as IGratitude[]);
      this.setTotalDaysOfGratitudes(this.gratitudes as IGratitude[]);
    }
  }
});
</script>


