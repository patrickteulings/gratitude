<template>
  <div>
    <div class="hero hero--detail" :style="{ background: getGratitudeColor(getGratitude) }">
      <div class="hero hero--detail__inner" v-if="getGratitude.weather">
        <div><i :title="getWeatherInfo(getGratitude).description" class="hero--detail__weathericon" :class="getWeatherIconOWM(getGratitude.weather)" style="color: white;"></i></div>
        <div class="hero--detail__weather-description">
          <div style="color: white;">It was {{ getWeatherDescription(getGratitude) }}</div>
        </div>
      </div>
      <div role="button" class="btn btn--round hero--detail__edit" @click="enterEditMode"><span class="gratitude-icon" :style="{ fill: getGratitudeColor(getGratitude) }"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span></div>
    </div>
    <article class="gratitude" v-if="this.getGratitude !== undefined">
      <div class="gratitudeWrapper">
        <div class="editableGratitude" :class="{isActive: this.editMode}">
          <content-editable id="editableTitle" @onUpdate="updateTitle" class="detail__title" :content="getGratitude.title" textAreaType="title" :color="getGratitudeColor(getGratitude)"></content-editable>
          <small v-if="getGratitude.timeStamp !== undefined" class="detail__meta">{{ getCity(getGratitude) }}, {{ getReadableDate(getGratitude.timeStamp.toDate()) }} at {{ getReadableTime(getGratitude.timeStamp.toDate()) }}</small>
          <content-editable class="detail__body" @onUpdate="updateBody" :content="getGratitude.body"></content-editable>
          <DropDown v-if="editMode" :listData="defaultColors" @onUpdate="updateColor"></DropDown>
        </div>
      </div>
      <div style="margin-top: 4rem">
        <!-- Loading -->
        <div v-if="isUpdating">
          <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
          </svg>
        </div>

        <!-- buttons -->
        <button type="button" @click.prevent="cancelUpdate()" class="btn-delete" v-if="editMode">cancel</button>&nbsp;
        <button type="button" @click="updateGratitude()" class="btn-delete" v-if="editMode">update</button>
        <br>
        <button @click="enterEditMode" class="btn-delete">edit</button>&nbsp;
        <button @click="deleteGratitude" class="btn-delete">delete</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';
import { mapState } from 'vuex';
import { db } from '@/services/firebaseConfigTypeScript';

// Helpers
import { readableDate, readableTime } from '@/helpers/dateHelper';
import { getBeastie } from '@/helpers/beastie';
import { EventBus } from '@/helpers/eventbus';

// Interfaces
import { IGratitude } from '@/interfaces/gratitude';
import { IWeather } from '@/interfaces/weather';
import { IColorItem } from '../interfaces/color';

// Components
import ContentEditable from '@/components/UI/ContentEditable.vue';
import DropDown from '@/components/UI/DropDown.vue';

export default Vue.extend({
  name: 'Detail',
  components: {
    ContentEditable,
    DropDown
  },

  data () {
    return {
      id: this.$route.params.id,
      editMode: false,
      isUpdating: false,
      originalGratitude: this.$store.getters.selectedGratitude as IGratitude,
      newGratitude: this.$store.getters.selectedGratitude as IGratitude,
      placeHolders: [getBeastie(), getBeastie()]
    };
  },

  computed: {
    getOriginalGratitude (): IGratitude {
      return this.originalGratitude;
    },

    getGratitude (): IGratitude {
      return this.newGratitude;
    },

    defaultColors (): IColorItem[] {
      return this.$store.getters.defaultColors;
    }
  },

  methods: {
    updateBody (body: any): void {
      this.newGratitude.body = body;
    },

    updateTitle (title: string): void {
      this.newGratitude.title = title;
    },

    updateColor (colorObject: IColorItem): void {
      // If a Gratitude didn't have a mood yet, update the original color as well, otherwise the
      // gratitude's color won't be reactive
      // Should we run a function over the entire DB to update this?
      if (!this.newGratitude.mood) {
        this.newGratitude.color = colorObject.value;
      }
      this.newGratitude.mood = colorObject;
    },

    // Initial method to get specific Gratitude from database
    getData (): void {
      this.$store.dispatch('setSelectedGratitude', this.$route.params.id).then((response) => {
        this.originalGratitude = response.data();

        // Update the original Data to work with colorObject instead of a single color String
        if (!this.originalGratitude.mood) this.originalGratitude.mood.value = this.originalGratitude.color;

        this.newGratitude = { ...this.originalGratitude };
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
      this.editMode = true;
    },

    // Cancels update/edit and reverts to last saved version
    cancelUpdate () {
      EventBus.$emit('resetContentEditable', 'my-test-parameter');
      this.newGratitude = { ...this.originalGratitude }
      this.editMode = false;
    },

    // Update item and save to database
    updateGratitude () {

      this.isUpdating = true;
      this.$store.dispatch('updateSelectedGratitude', {id: this.$route.params.id, payload: this.newGratitude}).then( (response) => {
        this.isUpdating = false; // Spinner
        this.originalGratitude = {...this.$store.getters.selectedGratitude};
        this.newGratitude = {...this.$store.getters.selectedGratitude};
        this.editMode = false; // Edit state, hides cancel / update buttons
      }).catch( (error) => {
        throw new Error(error);
      });
    },

    getGratitudeColor (): string {
      return (this.newGratitude.mood) ? this.newGratitude.mood.value : this.newGratitude.color;
    },

    getRandomPlaceholder (): string {
      return getBeastie();
    },

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
      const temp = parseInt(this.getWeatherInfo(this.getGratitude).temp, 10);
      const desc = this.getWeatherInfo(this.getGratitude).description;
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

    getColorData () {
      this.$store.dispatch('bindDefaultColors', { reference: db.collection('gratitudes')} );
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
    this.getColorData();
  }
});

</script>
