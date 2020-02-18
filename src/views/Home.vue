<template>
  <div class="home">
    <HomepageHero :gratitudes="gratitudes"/>
    <Clock />
    <GratitudeList @onDataLoaded="setGratitudes"/>
    <Location />
  </div>
</template>

<script lang="ts">
// Core
import Vue from 'vue';

// Components
import GratitudeList from '@/components/home/GratitudeList.vue';
import HomepageHero from '@/components/hero/HomepageHero.vue';
import Clock from '@/components/clock/Clock.vue';

// Helper, Semi-components
import Location from '@/components/location/Location.vue';


export default Vue.extend({
  name: 'home',
  data: () => {
    return {
      nrGratitudes: Number,
      gratitudes: new Array()
    };
  },

  components: {
    HomepageHero,
    GratitudeList,
    Clock,
    Location
  },

  methods: {
    setGratitudes (data: string[]): void {
      this.gratitudes = Array.from(data);
    }
  }
});
</script>
