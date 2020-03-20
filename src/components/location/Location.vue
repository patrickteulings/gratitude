<template>
  <div>
    <p style="display: none;">
      Let us locate you for better results...
      <button @click="locateMe">Get location</button>
    </p>

    <div v-if="errorStr" style="display: none;">
      Sorry, but the following error
      occurred: {{errorStr}}
    </div>

    <div v-if="gettingLocation" style="display: none;">
      <i>Getting your location...</i>
    </div>

    <div v-if="location" style="display: none;">

    </div>

    <Weather style="display: none;"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Weather from '@/components/weather/Weather.vue';
import GeocodeService from '@/services/geocodeService.ts'; // @TODO Refactor to Composition API - Renderless Component

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

        navigator.geolocation.getCurrentPosition (
          (pos) => {
            resolve(pos);
          },
          (err) => {
            // showGeolocationError();
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
        this.getCityName(this.location);
        this.$store.dispatch('setUserLocation', this.location);

      } catch (e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
    },

    getCityName (location: any) {
      const geocode = new GeocodeService();

      geocode.getCityName(location.coords)
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

  },
  mounted () {
    this.locateMe();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
