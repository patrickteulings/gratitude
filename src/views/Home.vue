<template>
  <div class="home">
    <div class="home__hero"></div>
    <Clock />
    <GratitudeListGrouped />
    <Location />
  </div>
</template>

<script lang="ts">
// Core
import Vue from 'vue';

// Components
import GratitudeListGrouped from '@/components/GratitudeListGrouped.vue';
import Clock from '@/components/Clock.vue';

// Helper, Semi-components
import Location from '@/components/location/Location.vue';


export default Vue.extend({
  name: 'home',
  components: {
    GratitudeListGrouped,
    Clock,
    Location
  }
});
</script>
