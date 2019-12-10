<template>
  <div class="home">
    <Clock />
    <Location />
    <GratitudeListGrouped />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GratitudeListGrouped from '@/components/GratitudeListGrouped.vue'; // @ is an alias to /src
import Clock from '@/components/Clock.vue';
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
