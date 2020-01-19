<template>
  <div class="home">
    <HomepageHero :gratitudes="gratitudes"/>
    <Clock />
    <GratitudeListGrouped @onDataLoaded="setGratitudes"/>
    <Location />
  </div>
</template>

<script lang="ts">
// Core
import Vue from 'vue';

// Components
import GratitudeListGrouped from '@/components/GratitudeListGrouped.vue';
import HomepageHero from '@/components/hero/HomepageHero.vue';
import Clock from '@/components/Clock.vue';

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
    GratitudeListGrouped,
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
