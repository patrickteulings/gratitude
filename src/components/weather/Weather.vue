<template>
  <div class="weather-bar">
    <div style="display: none;">{{ getLocation }}</div>
    <div v-if="isWeatherLoading === true">Loading weather (and location)</div>
    <div class="weather-bar__inner" v-else>
      <span>{{ getCity }}, currently it's {{ getWeather.main.temp }}{{ getWeatherSuffix() }} with {{ getWeatherDescription }}</span>
      <span><img class="weather-bar__icon" :alt="getWeatherDescription" :src="getWeatherIcon" /></span>
      <span><i :title="getWeatherDescription" :class="getWeatherIconOWM"></i></span>
    </div>
  </div>
</template>

<script lang="ts">
// Imports
import { ICoords } from '@/interfaces/coords';
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
        this.tryWeather({latitude: this.$store.getters.location.latitude, longitude: this.$store.getters.location.longitude});
      }
      return this.$store.getters.location;
    },
    getWeather () {
      return this.$store.getters.currentWeather;
    },
    getWeatherIcon () {
      return `http://openweathermap.org/img/wn/${this.$store.getters.currentWeather.weather[0].icon}@2x.png`;
    },

    getWeatherIconOWM () {
      return `wi wi-owm-day-${this.$store.getters.currentWeather.weather[0].id}`;
    },
    getWeatherDescription () {
      return this.$store.getters.currentWeather.weather[0].description;
    },
    getCity () {
      if (!isEmptyObject(this.$store.getters.currentCity) && this.$store.getters.currentCity !== undefined) {
        return this.$store.getters.currentCity.city;
      }
    }
  },
  methods: {
    tryWeather (coords: ICoords) {
      const weather = new WeatherService();
      weather.getRequest(coords)
        .then((data: any) => {
          if (data.cod === '404') {
            // this.showCitySearchError ();
            return;
          }
          this.isWeatherLoading = false;
          this.$store.dispatch('setCurrentWeather', { main: data.main, weather: data.weather });
        })
        .catch((err: string) => {
          console.log('Error: ', err);
        });
    },

    showWeatherAPIError () {
      console.log('error: showWeatherAPIError');
    },

    getWeatherSuffix () {
      return '\u00B0' + 'C';
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
