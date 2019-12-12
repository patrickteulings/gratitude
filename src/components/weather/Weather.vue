<template>
  <article class="card">
    <div class="weather-bar">
      <div>Weather Location {{ getLocation }}</div>
      <div v-if="isWeatherLoading === true">Loading weather (and location)</div>
      <div v-else>
        {{ getWeather.main }}
        {{ getWeather.weather[0] }}


        <div style="background-color: #000;"><img :alt="getWeatherDescription" :src="getWeatherIcon" /></div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
interface Coords {
  lat: any;
  lon: any;
}
import Vue from 'vue';
import WeatherService from '@/services/weatherService';
import { isEmptyObject } from '@/helpers/emptyHelper';

export default Vue.extend({
  name: 'Weather',
  components: {

  },
  props: {

  },
  data: () => {
    return {
      isWeatherLoading: true
    };
  },
  computed: {
    getLocation () {
      if (!isEmptyObject(this.$store.getters.location)) {
        this.tryWeather({lat: this.$store.getters.location.latitude, lon: this.$store.getters.location.longitude});
      }
      return this.$store.getters.location;
    },
    getWeather () {
      return this.$store.getters.currentWeather;
    },
    getWeatherIcon () {
      return `http://openweathermap.org/img/wn/${this.$store.getters.currentWeather.weather[0].icon}@2x.png`;
    },
    getWeatherDescription () {
      return this.$store.getters.currentWeather.weather[0].description;
    }
  },
  methods: {
    tryWeather (coords: Coords) {
      const weather = new WeatherService();
      console.log('weatherLat', coords);
      weather.getRequest(coords)
        .then((data: any) => {
          if (data.cod === '404') {
            // this.showCitySearchError ();
            return;
          }
          console.log(data);
          this.isWeatherLoading = false;
          this.$store.dispatch('setCurrentWeather', { main: data.main, weather: data.weather });
        })
        .catch((err: string) => {
          console.log('Error: ', err);
        });
    },

    showWeatherAPIError () {
      console.log('error: showWeatherAPIError');
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .weather-bar {

  }
</style>
