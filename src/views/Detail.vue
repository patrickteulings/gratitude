<template>
  <div>
    <div class="hero hero--detail" :style="{ background: getGratitudeColor(gratitude) }">
      <div class="hero hero--detail__inner" v-if="this.myGratitude.weather">
        <div><i :title="getWeatherInfo(this.myGratitude).description" class="hero--detail__weathericon" :class="getWeatherIconOWM(this.myGratitude.weather)" style="color: white;"></i></div>
        <div class="hero--detail__weather-description">
          <div style="color: white;">It was {{ getWeatherDescription(this.myGratitude) }}</div>
        </div>
      </div>
    </div>
    <article class="gratitude" v-if="this.myGratitude !== undefined">
      <div class="gratitudeWrapper">
        <div class="editableGratitude" :class="{isActive: this.editMode}">
          <content-editable id="editableTitle" @onUpdate="updateTitle" class="detail__title" :placeholder="getRandomPlaceholder()" :content="getOriginalGratitude.title" :color="myGratitude.color"></content-editable>
          <small v-if="this.myGratitude.timeStamp !== undefined" class="detail__meta">{{ getCity(this.myGratitude) }}, {{ getReadableDate(this.myGratitude.timeStamp.toDate()) }} at {{ getReadableTime(this.myGratitude.timeStamp.toDate()) }}</small>
          <content-editable class="detail__body" @onUpdate="updateBody" :placeholder="getRandomPlaceholder()" :content="getOriginalGratitude.body"></content-editable>
        </div>
        <div class="staticGratitude" :class="{isActive: !this.editMode}">
          <div ref="title" v-html="getOriginalGratitude.title" @mousedown="enterEditMode" class="detail__title" :style="{color: getGratitudeColor()}"></div>
          <small v-if="this.myGratitude.timeStamp !== undefined" class="detail__meta">Created on {{ getReadableDate(this.myGratitude.timeStamp.toDate()) }} at {{ getReadableTime(this.myGratitude.timeStamp.toDate()) }} in {{ getCity(this.myGratitude) }}</small>
          <div ref="body" v-html="getOriginalGratitude.body" :mousedown="enterEditMode" class="detail__body"></div>
        </div>
      </div>
      <button type="button" @click.prevent="cancelUpdate()" class="btn-delete" v-if="editMode">cancel</button>
      <button type="button" @click="updateGratitude()" class="btn-delete" v-if="editMode">update</button>

      <span v-if="isUpdating">Aan het updaten</span>
      <br>
      <button @click="enterEditMode" class="btn-delete">edit</button>
      <button @click="deleteGratitude" class="btn-delete">delete</button>
    </article>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapState } from 'vuex';

// Helpers
import { readableDate, readableTime } from '@/helpers/dateHelper';
import { getBeastie } from '@/helpers/beastie';

// Interfaces
import { IGratitude } from '@/interfaces/gratitude';
import { IWeather } from '@/interfaces/weather';

// Components
import ContentEditable from '@/components/UI/ContentEditable.vue';

/*  @TODO
* Behaviour is not perfect yet...
* Reproduce:
* 1. Click edit
* 2. Edit text and click CANCEL
* 3. Click Edit again,
* 4. The previously typed text is shown again.
* Having a hard time (at 01:30) to ficure out why the data won't update or how to connect to computed..
* Tip to self, clean up Store Mutations for these ContentEditable field and 'selectedGratitude' and reset functions
*/

export default Vue.extend({
  name: 'Detail',
  components: {
    ContentEditable
  },

  data () {
    return {
      id: this.$route.params.id,
      editMode: false,
      isUpdating: false,
      myGratitude: this.$store.getters.selectedGratitude as IGratitude,
      originalGratitude: this.$store.getters.selectedGratitude as IGratitude,
      newGratitude: this.$store.getters.selectedGratitude as IGratitude
    };
  },

  computed: {
    gratitude (): void {
      this.myGratitude = this.$store.getters.selectedGratitude;
    },

    getOriginalGratitude (): IGratitude {
      return this.originalGratitude;
    }
  },

  methods: {
    updateBody (body: any): void {
      this.newGratitude.body = body;
    },

    updateTitle (title: string): void {
      this.newGratitude.title = title;
    },

    updateColor (e: { target: HTMLInputElement; }): void {
      console.log(e);
    },

    // Initial method to get specific Gratitude from database
    getData (): void {
      this.$store.dispatch('setSelectedGratitude', this.$route.params.id).then((response) => {
        this.newGratitude = response.data();
        this.originalGratitude = response.data();
        this.myGratitude = response.data();
        console.log('getData', this.originalGratitude);
      });
    },

    // Well, delete gratitude
    deleteGratitude (): void {
      this.$store.dispatch('deleteGratitude', this.$route.params.id).then( (res) => {
        this.$router.push({path: '/'});
      }).catch( (error) => {
        console.error('Document could not be deleted: ', error);
      });
    },

    enterEditMode () {
      const titleEl = document.getElementById('editableTitle');
      if (titleEl) titleEl.focus();
      this.editMode = true;
    },

    // Cancels update/edit and reverts to last saved version
    cancelUpdate () {
      this.editMode = false;
    },

    // Update item and save to database
    updateGratitude () {

      console.log(this.newGratitude);

      this.isUpdating = true;
      this.$store.dispatch('updateSelectedGratitude', {id: this.$route.params.id, payload: this.newGratitude}).then( (response) => {
        this.isUpdating = false; // Spinner
        // this.originalGratitude = {...this.$store.getters.selectedGratitude};
        this.myGratitude = {...this.$store.getters.selectedGratitude};
        this.newGratitude = {...this.$store.getters.selectedGratitude};
        this.editMode = false; // Edit state, hides cancel / update buttons
      }).catch( (error) => {
        throw new Error(error);
      });
    },

    getGratitudeColor () {
      return this.myGratitude.color !== undefined ? this.myGratitude.color : '#000000';
    },

    getRandomPlaceholder (): string {
      return getBeastie().toString();
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

    getWeatherDescription (gratitude: IGratitude ) {
      const temp = parseInt(this.getWeatherInfo(this.myGratitude).temp, 10);
      const desc = this.getWeatherInfo(this.myGratitude).description;
      const noTempDescription = 'No temperature info available';
      let body = '';

      if (temp > 25)  body = `Icecream time`;
      if (temp < 25)  body = `Ray Ban weather`;
      if (temp < 20)  body = `Really nice Outside`;
      if (temp < 15)  body = `Kinda Ok Outside`;
      if (temp < 10)  body = `Like, Sweater cold`;
      if (temp < 5)  body = `So Cold You'd want UGGS`;
      if (temp < 0)  body = `Friggin Cold`;
      return (!isNaN(temp)) ? `${temp}°, ${body}, ${desc} ` : `${noTempDescription}`;
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
