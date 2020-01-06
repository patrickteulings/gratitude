<template>
  <div>
    <article class="gratitude" v-if="gratitude !== undefined">
      <h2 :style="{ color: getGratitudeColor(gratitude) }">{{gratitude.title}}</h2>
      <small v-if="gratitude.timeStamp !== undefined" class="gratitude__createdAt">Created on {{ getReadableDate(gratitude.timeStamp.toDate()) }} at {{ getReadableTime(gratitude.timeStamp.toDate()) }}</small>
      <small>{{ getCity(gratitude) }}</small>
      <p>{{gratitude.body}}</p>
      <div v-if="gratitude.weather">
        <div>{{ getWeatherInfo(gratitude).id }}{{ getWeatherInfo(gratitude).description }}</div>
        <div><i :title="getWeatherInfo(gratitude).description" :class="getWeatherIconOWM(gratitude.weather)"></i></div>
      </div>
      <button @click="deleteGratitude" class="btn-delete">delete</button>
      <button @click="updateGratitude(gratitude)" class="btn-delete">update</button>
    </article>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapState } from 'vuex';

// Helpers
import { readableDate, readableTime } from '@/helpers/dateHelper';

// Interfaces
import { IGratitude } from '@/interfaces/gratitude';

export default Vue.extend({
  name: 'Detail',
  components: {},
  data () {
    return {
      id: this.$route.params.id
    };
  },

  computed: {
    gratitude (): string {
      return this.$store.getters.selectedGratitude;
    }
  },

  methods: {
    getData () {
      this.$store.dispatch('setSelectedGratitude', this.$route.params.id);
    },

    deleteGratitude () {
      this.$store.dispatch('deleteGratitude', this.$route.params.id).then( (res) => {
        this.$router.push({path: '/home'});
      }).catch( (error) => {
        console.error('Document could not be deleted: ', error);
      });
    },

    updateGratitude (gratitude: IGratitude) {
      this.$store.dispatch('updateSelectedGratitude', {id: this.$route.params.id, payload: gratitude}).then( (response) => {
        console.log('Updated');
      }).catch( (error) => {
        console.error('Error updating gratitide ', error);
      });
      // Set the "capital" field of the city 'DC'

// db.collection("cities").doc("DC").update({
//     capital: true
// });
    },

    getGratitudeColor (gratitude: any) {
      return gratitude.color !== undefined ? gratitude.color : '#000000';
    },

    getReadableDate (date: Date, longNames: boolean = false) {
      return readableDate(date, longNames);
    },

    getReadableTime (date: Date, longNames: boolean = false) {
      return readableTime(date, longNames);
    },

    getWeatherInfo (gratitude: IGratitude ) {
      console.log(gratitude);
      return gratitude.weather;
    },

    getCity (gratitude: any) {
      return (gratitude.location !== undefined) ? gratitude.location.city.osmtags['name-en'] : 'looking...';
    },

    getWeatherIconOWM (gratitudeWeather: any) {
      return `wi wi-owm-day-${gratitudeWeather.id}`;
    }

  },

  mounted () {
    this.getData();
  }
});

</script>
