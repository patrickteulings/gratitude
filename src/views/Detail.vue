<template>
  <div>
    <div class="hero hero--detail" :style="{ background: getGratitudeColor(gratitude) }">
      <div class="hero hero--detail__inner" v-if="gratitude.weather">
        <div><i :title="getWeatherInfo(gratitude).description" class="hero--detail__weathericon" :class="getWeatherIconOWM(gratitude.weather)" style="color: white;"></i></div>
        <div style="color: white;">{{ getWeatherInfo(gratitude).temp }}</div>
        <div style="color: white;">{{ getWeatherDescription(gratitude) }}</div>
      </div>
    </div>
    <article class="gratitude" v-if="gratitude !== undefined">
      <form id="detailform" @submit.prevent="updateGratitude(gratitude)" class="editableForm " :class="{ isEditing: editMode }">
        <small v-if="gratitude.timeStamp !== undefined" class="gratitude__createdAt">Created on {{ getReadableDate(gratitude.timeStamp.toDate()) }} at {{ getReadableTime(gratitude.timeStamp.toDate()) }}</small>
        <small>{{ getCity(gratitude) }}</small>

        <div v-if="gratitude.weather">
          <div>{{ getWeatherInfo(gratitude).id }}{{ getWeatherInfo(gratitude).description }}</div>
          <div><i :title="getWeatherInfo(gratitude).description" :class="getWeatherIconOWM(gratitude.weather)"></i></div>
        </div>

        <Input
          v-model = "gratitude.title"
          input-id = "title"
          input-label = ""
          input-placeholder = "A title could be really usefull you know..."
          input-classname = "title"
          v-on:focus = "setFocus"
          :input-color = getGratitudeColor(gratitude)
        />
        <TextArea
          v-model="gratitude.body"
          input-id = "body"
          input-label = ""
          input-placeholder = "Today I'm grateful for"
          input-resize = "true"
          v-on:focus = "setFocus"
          :input-color = getGratitudeColor(gratitude)

        />
        <Input
          v-model = "gratitude.color"
          input-id = "color"
          input-label = ""
          input-placeholder = "Let color brighten your life"
          input-classname = "color"
          v-on:focus = "setFocus"
        />

        <button type="button" @click.prevent="cancelUpdate()" class="btn-delete" v-if="editMode">cancel</button>
        <button type="submit" class="btn-delete" v-if="editMode">update</button>

        <span v-if="isUpdating">Aan het updaten</span>
      </form>

      <button @click="deleteGratitude" class="btn-reset">delete</button>
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

// Components
import Input from '@/components/UI/Input.vue';
import TextArea from '@/components/UI/TextArea.vue';

interface IWeather {
  description: string;
  id: string;
  temp: string;
}

export default Vue.extend({
  name: 'Detail',
  components: {
    Input,
    TextArea
  },

  data () {
    return {
      id: this.$route.params.id,
      responsiveGratitude: {},
      editMode: false,
      isUpdating: false,
      testG: {}
    };
  },

  computed: {
    gratitude (): IGratitude {
      this.testG = this.$store.getters.selectedGratitude;
      console.log(this.testG);
      return this.$store.getters.selectedGratitude;
    }
  },

  methods: {
    // Initial method to get specific Gratitude from database
    getData () {
      this.$store.dispatch('setSelectedGratitude', this.$route.params.id);
    },

    // Well, delete gratitude
    deleteGratitude () {
      this.$store.dispatch('deleteGratitude', this.$route.params.id).then( (res) => {
        this.$router.push({path: '/home'});
      }).catch( (error) => {
        console.error('Document could not be deleted: ', error);
      });
    },

    // Cancels update/edit and reverts to last saved version
    cancelUpdate () {
      this.$store.dispatch('resetSelectedGratitude');
      this.editMode = false;
    },

    // Update item and save to database
    updateGratitude (gratitude: IGratitude) {
      this.isUpdating = true;

      this.$store.dispatch('updateSelectedGratitude', {id: this.$route.params.id, payload: gratitude}).then( (response) => {
        this.isUpdating = false; // Spinner
        this.editMode = false; // Edit state, hides cancel / update buttons
      }).catch( (error) => {
        throw new Error(error);
      });
    },

    getGratitudeColor (gratitude: any) {
      return gratitude.color !== undefined ? gratitude.color : '#000000';
    },

    // Date / Time helpers to convert timestamp
    getReadableDate (date: Date, longNames: boolean = false) {
      return readableDate(date, longNames);
    },

    getReadableTime (date: Date, longNames: boolean = false) {
      return readableTime(date, longNames);
    },

    // Weather and city functions
    getWeatherInfo (gratitude: IGratitude ): IWeather {
      return gratitude.weather as IWeather;
    },

    getWeatherDescription (gratitude: IGratitude ): string {
      const temp = parseInt(this.getWeatherInfo(gratitude).temp, 10);
      const noTempDescription = 'No temperature info available';
      let body = '';

      if (temp > 25)  body = `Icecream time`;
      if (temp < 25)  body = `Ray Ban weather`;
      if (temp < 20)  body = `Really nice Outside`;
      if (temp < 15)  body = `Kinda Ok Outside`;
      if (temp < 10)  body = `Like, Sweater cold`;
      if (temp < 5)  body = `So Cold You'd want UGGS`;
      if (temp < 0)  body = `Friggin Cold`;
      return (!isNaN(temp)) ? `${body} ${temp}` : `${noTempDescription}`;
    },

    getCity (gratitude: any) {
      return (gratitude.location !== undefined) ? gratitude.location.city.osmtags['name-en'] : 'looking...';
    },

    getWeatherIconOWM (gratitudeWeather: any) {
      return `wi wi-owm-day-${gratitudeWeather.id}`;
    },

    // Will trigger controls to edit or cancel edit
    toggleEditMode () {
      this.editMode = !this.editMode;
    },

    // Hard 'show edit controls'
    setFocus () {
      this.editMode = true;
    }
  },

  mounted () {
    this.getData();
  }
});

</script>
