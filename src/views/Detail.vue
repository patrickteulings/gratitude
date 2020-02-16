<template>
  <div>
    <div class="hero hero--detail" :style="{ background: getGratitudeColor(getGratitude) }">
      <div class="hero hero--detail__inner" v-if="getGratitude.weather">
        <div><i :title="getWeatherInfo(getGratitude).description" class="hero--detail__weathericon" :class="getWeatherIcon(getGratitude.weather)" style="color: white;"></i></div>
        <div class="hero--detail__weather-description">
          <div style="color: white;">It was {{ getWeatherDescription(getGratitude) }}</div>
        </div>
      </div>
      <button-round v-if="!editMode" @buttonClick="enterEditMode" buttonIcon="edit" classModifier="hero--detail__edit" :iconColor="getGratitudeColor(getGratitude)" />
      <button-round v-if="editMode" @buttonClick="updateGratitude" buttonIcon="update" classModifier="hero--detail__update" :iconColor="getGratitudeColor(getGratitude)"/>
      <button-round v-if="editMode" @buttonClick="cancelUpdate" buttonIcon="close" classModifier="hero--detail__back" :iconColor="getGratitudeColor(getGratitude)"/>
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
        <loading-spinner v-if="isUpdating"></loading-spinner>
        <button v-if="editMode" @click="deleteGratitude" class="btn btn--reset btn--delete">delete</button>
      </div>
    </article>

    <!-- PREV NEXT BUTTONS -->
    <button-round @buttonClick="enterEditMode" buttonIcon="back" classModifier="hero--detail__prev" :iconColor="getGratitudeColor(getGratitude)" />
    <button-round @buttonClick="updateGratitude" buttonIcon="forward" classModifier="hero--detail__next" :iconColor="getGratitudeColor(getGratitude)"/>

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
import { getCustomWeatherDescription } from '@/helpers/weatherHelper';
import { EventBus } from '@/helpers/eventbus';

// Interfaces
import { IGratitude } from '@/interfaces/gratitude';
import { IWeather } from '@/interfaces/weather';
import { IColorItem } from '../interfaces/color';

// Components
import ContentEditable from '@/components/UI/ContentEditable.vue';
import DropDown from '@/components/UI/DropDown.vue';
import ButtonRound from '@/components/UI/ButtonRound.vue';
import LoadingSpinner from '@/components/UI/loading-spinner.vue';


export default Vue.extend({
  name: 'Detail',
  components: {
    ContentEditable,
    DropDown,
    ButtonRound,
    LoadingSpinner
  },

  data () {
    return {
      id: this.$route.params.id,
      editMode: false,
      isUpdating: false,
      originalGratitude: this.$store.getters.selectedGratitude as IGratitude,
      newGratitude: this.$store.getters.selectedGratitude as IGratitude,
      placeHolders: [getBeastie(), getBeastie()],
      touchMovement: {startX: 0, endX: 0, isMoving: true}
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

    deleteGratitude (): void {
      this.$store.dispatch('deleteGratitude', this.$route.params.id).then( (res) => {
        this.$router.push({path: '/'});
      }).catch( (error) => {
        console.error('Document could not be deleted: ', error);
      });
    },

    // Used to highlight, show or hide elements in the template
    enterEditMode () {
      this.editMode = true;
    },

    // Cancels update/edit and reverts to last saved version
    cancelUpdate () {
      EventBus.$emit('resetContentEditable', 'my-test-parameter');
      this.newGratitude = { ...this.originalGratitude };
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
        throw new Error(error); // @TODO need sitewide Toast message?
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
      const plainDescription = this.getWeatherInfo(this.getGratitude).description;
      const funkyDescription = getCustomWeatherDescription(temp);
      const noTempDescription = 'No temperature info available';

      return (!isNaN(temp)) ? `${temp}°, ${funkyDescription}, ${plainDescription} ` : `${noTempDescription}`;
    },

    getCity (gratitude: any): string {
      return (gratitude.location !== undefined) ? gratitude.location.city.osmtags.name : 'looking...';
    },

    getWeatherIcon (gratitudeWeather: any): string {
      return `wi wi-owm-day-${gratitudeWeather.id}`;
    },

    getColorData () {
      this.$store.dispatch('bindDefaultColors', { reference: db.collection('gratitudes')} );
    },

    // Will trigger controls to edit or cancel edit
    toggleEditMode (): void {
      this.editMode = !this.editMode;
    },

    // Hard 'show edit controls'
    setFocus (): void {
      this.editMode = true;
    },

    //
    // TESTING SWIPE
    //

    handleTouchStart (e: TouchEvent): void {
      this.touchMovement.startX = e.touches[0].pageX;
    },

    handleTouchEnd (e: TouchEvent): void {
      this.touchMovement.endX = e.changedTouches[0].pageX;
      if (this.touchMovement.endX < this.touchMovement.startX) {
        console.log('links');
      } else if (this.touchMovement.endX > this.touchMovement.startX) {
        console.log('rechts');
      }
      this.resetTouch();
    },

    handleTouchMove (e: TouchEvent): void {
      this.touchMovement.isMoving = true;

      if (e.changedTouches[0].pageX < this.touchMovement.startX) {
        console.log('going left');
      }
    },

    handleTouchCancel (e: TouchEvent): void {
      console.log(e);
    },

    resetTouch (): void {
      this.touchMovement.startX = 0;
      this.touchMovement.endX = 0;
      this.touchMovement.isMoving = false;
    }
  },

  mounted () {
    this.getData();
    this.getColorData();

    this.$el.addEventListener('touchstart', (e) => this.handleTouchStart(e as TouchEvent), false);
    this.$el.addEventListener('touchend', (e) => this.handleTouchEnd(e as TouchEvent), false);
    this.$el.addEventListener('touchcancel', (e) => this.handleTouchCancel(e as TouchEvent), false);
    this.$el.addEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent), false);
  },

  beforeDestroy () {
    this.$el.removeEventListener('touchstart', (e) => this.handleTouchStart(e as TouchEvent), false);
    this.$el.removeEventListener('touchend', (e) => this.handleTouchEnd(e as TouchEvent));
    this.$el.removeEventListener('touchcancel', (e) => this.handleTouchCancel(e as TouchEvent));
    this.$el.removeEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent));

  }
});

</script>
