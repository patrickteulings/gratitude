<template>
  <div>
    <div class="hero hero--detail" :style="{ background: getGratitudeColor(getGratitude) }">
      <div class="hero hero--detail__inner" v-if="getGratitude.weather">
        <div><i :title="getWeatherInfo(getGratitude).description" class="hero--detail__weathericon" :class="getWeatherIcon(getGratitude.weather)" style="color: white;"></i></div>
        <div class="hero--detail__weather-description">
          <div style="color: white;">It was {{ getWeatherDescription(getGratitude) }}</div>
        </div>
      </div>
      <button-round @buttonClick="enterEditMode" buttonIcon="edit" :class="{ isActive: !this.editMode }" classModifier="hero--detail__edit" :iconColor="getGratitudeColor(getGratitude)" />
      <button-round @buttonClick="updateGratitude" buttonIcon="update" :class="{ isActive: this.editMode }" classModifier="hero--detail__update" :iconColor="getGratitudeColor(getGratitude)"/>
      <button-round @buttonClick="cancelUpdate" buttonIcon="close" :class="{ isActive: this.editMode }" classModifier="hero--detail__cancel btn--round-small" :iconColor="getGratitudeColor(getGratitude)"/>
      <button-round @buttonClick="backToHome" buttonIcon="back" :class="{ isActive: !this.editMode }" classModifier="hero--detail__home" :iconColor="getGratitudeColor(getGratitude)"/>
    </div>
    <article class="gratitude" v-if="this.getGratitude !== undefined">
      <div class="gratitudeWrapper">
        <div class="editableGratitude" :class="{isActive: this.editMode}">
          <content-editable @onUpdate="updateTitle" @onFocus="setFocus" class="detail__title" :content="getGratitude.title" textAreaType="title" :color="getGratitudeColor(getGratitude)"></content-editable>
          <small v-if="getGratitude.timeStamp !== undefined" class="detail__meta">{{ getCity(getGratitude) }}, {{ getReadableDate(getGratitude.timeStamp.toDate()) }} at {{ getReadableTime(getGratitude.timeStamp.toDate()) }}</small>
          <content-editable @onUpdate="updateBody" @onFocus="setFocus" class="detail__body" :content="getGratitude.body"></content-editable>
          <DropDown v-if="editMode" :listData="defaultColors" @onUpdate="updateColor"></DropDown>
        </div>
      </div>

      <!-- LOADING -->
      <div style="margin-top: 4rem">
        <loading-spinner v-if="isUpdating"></loading-spinner>
        <button v-if="editMode" @click="deleteGratitude" class="btn btn--reset btn--delete">delete</button>
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
import { getCustomWeatherDescription } from '@/helpers/weatherHelper';
import { EventBus } from '@/helpers/eventbus';

// Interfaces
import { IGratitude } from '@/interfaces/gratitude';
import { IWeather } from '@/interfaces/weather';
import { IColorItem } from '@/interfaces/color';

// Components
import ContentEditable from '@/components/UI/ContentEditable.vue';
import DropDown from '@/components/UI/DropDown.vue';
import ButtonRound from '@/components/UI/ButtonRound.vue';
import LoadingSpinner from '@/components/UI/loading-spinner.vue';


export default Vue.extend({
  name: 'DetailItem',
  props: {
    detailItemId: {
      type: String,
      default: '',
      required: true
    }
  },
  components: {
    ContentEditable,
    DropDown,
    ButtonRound,
    LoadingSpinner
  },

  data () {
    return {
      id: this.detailItemId,
      editMode: false,
      isUpdating: false,
      originalGratitude: this.$store.getters.selectedGratitude as IGratitude,
      newGratitude: this.$store.getters.selectedGratitude as IGratitude,
      placeHolders: [getBeastie(), getBeastie()],
      touchMovement: {startX: 0, endX: 0, isMoving: false}
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
    updateBody (body: string): void {
      this.newGratitude.body = body;
    },

    updateTitle (title: string): void {
      this.newGratitude.title = title;
    },

    updateColor (colorObject: IColorItem): void {
      if (!this.newGratitude.mood) {
        this.newGratitude.color = colorObject.value;
      }
      this.newGratitude.mood = colorObject;
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

    getWeatherInfo (gratitude: IGratitude ): IWeather {
      return gratitude.weather as IWeather;
    },

    getWeatherDescription (gratitude: IGratitude ) {
      const temperature = parseInt(this.getWeatherInfo(this.getGratitude).temp, 10);
      const plainDescription = this.getWeatherInfo(this.getGratitude).description;
      const funkyDescription = getCustomWeatherDescription(temperature);
      const noTemperatureDescription = 'No temperature info available';

      return (!isNaN(temperature)) ? `${temperature}°, ${funkyDescription}, ${plainDescription} ` : `${noTemperatureDescription}`;
    },

    getCity (gratitude: any): string {
      return (gratitude.location !== undefined) ? (gratitude.location.city.city !== undefined) ? gratitude.location.city.city : 'Looking...' : 'looking...';
    },

    getWeatherIcon (gratitudeWeather: any): string {
      return `wi wi-owm-day-${gratitudeWeather.id}`;
    },

    getColorData () {
      this.$store.dispatch('bindDefaultColors', { reference: db.collection('gratitudes')} );
    },

    getData (): void {
      this.$store.dispatch('setSelectedGratitude', this.detailItemId).then((response) => {
        this.originalGratitude = response.data();

        // Update the original Data to work with colorObject instead of a single color String
        if (!this.originalGratitude.mood) {
          const mood = {
            value: this.originalGratitude.color
          };
          this.originalGratitude.mood = { ...mood };
        }
        this.newGratitude = { ...this.originalGratitude };
      });
    },

    deleteGratitude (): void {
      this.$store.dispatch('deleteGratitude', this.detailItemId).then( (res) => {
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

      this.$store.dispatch('updateSelectedGratitude', {id: this.detailItemId, payload: this.newGratitude}).then( (response) => {
        this.isUpdating = false;
        this.originalGratitude = {...this.$store.getters.selectedGratitude};
        this.newGratitude = {...this.$store.getters.selectedGratitude};
        this.editMode = false;
      }).catch( (error) => {
        throw new Error(error); // @TODO need sitewide Toast message?
      });
    },

    toggleEditMode (): void {
      this.editMode = !this.editMode;
    },

    // Hard 'show edit controls'
    setFocus (): void {
      this.editMode = true;
    },

    backToHome (): void {
      this.$router.push({path: '/'});
    }
  },

  mounted () {
    this.getData();
    this.getColorData();
  },

  watch: {
    detailItemId (newVal, oldVal) { // watch it
      this.getData();
      this.getColorData();
    }
  }

});

</script>
