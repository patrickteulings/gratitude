<template>
  <div>
<p>
    Let us locate you for better results...
    <button @click="locateMe">Get location</button>
  </p>

  <div v-if="errorStr">
    Sorry, but the following error
    occurred: {{errorStr}}
  </div>

  <div v-if="gettingLocation">
    <i>Getting your location...</i>
  </div>

  <div v-if="location">
    Your location data is {{ location.coords.latitude }}, {{ location.coords.longitude}}
  </div>

  <Weather />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Weather from '@/components/weather/Weather.vue';
import GeocodeService from '@/services/geocodeService.ts';

export default Vue.extend({
  name: 'Location',
  components: {
    Weather
  },
   data: () => {
    return {
      location: '',
      gettingLocation: false,
      errorStr: null
    };
  },
  methods: {
    async getLocation () {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    async locateMe () {
      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation() as any;
        this.getCityName({lat: 52.0609792, lon: 4.2565631999999995});
        this.$store.dispatch('setUserLocation', this.location);
      } catch (e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
    },
    getCityName (coords: any) {
      const geocode = new GeocodeService();

      geocode.getCityName(coords)
        .then((data: any) => {
          if (data.cod === '404') {
            return;
          }
          this.$store.dispatch('setCurrentCity', data);
        })
        .catch((err: string) => {
          console.log('Error: ', err);
        });
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
