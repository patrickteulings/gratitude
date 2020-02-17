<!-- @TODO -->
<!-- Move 'ADD' button, AND, make it an actual button -->

<template>
  <div>
    <button-round @buttonClick="toggleView" buttonIcon="add" :class="{'is-visible': !isViewOpen}" classModifier="add-gratitude__button" iconColor="#C8285C"/>
    <button-round @buttonClick="confirmAdd" buttonIcon="done" :class="{'is-visible': isViewOpen}" classModifier="add-gratitude__button-confirm" iconColor="#C8285C"/>

    <div class="add-gratitude" :class="{'is-open': isViewOpen}">
      <div class="add-gratitude__inner">
        <button-round @buttonClick="confirmCancel" buttonIcon="back" classModifier="btn--round-small add-gratitude__button--back" iconColor="#616161"/>
        <div class="add-gratitude__form">
          <content-editable ref="title" class="add-gratitude__title" @onUpdate="updateTitle" content="" textAreaType="title" :color="mood.value"></content-editable>
          <content-editable ref="body" class="add-gratitude__body" @onUpdate="updateBody" content="" textAreaType="body"></content-editable>
          <DropDown :listData="defaultColors" @onUpdate="onColorSelected"></DropDown>
          <div v-if="isSavingGratitude">
            <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';

// Firestore
import { firestorePlugin } from 'vuefire';
import { db } from '@/services/firebaseConfigTypeScript';

// Components
import Input from '@/components/UI/Input.vue';
import TextArea from '@/components/UI/TextArea.vue';
import ContentEditable from '@/components/UI/ContentEditable.vue';
import DropDown from '@/components/UI/DropDown.vue';
import ButtonRound from '@/components/UI/ButtonRound.vue';

// Interfaces
import { IColorItem } from '@/interfaces/color';

// Helpers
import { EventBus } from '@/helpers/eventbus';

// Store
import { mapActions, mapState } from 'vuex';

Vue.use(firestorePlugin);

export default Vue.extend({
  name: 'AddGratitude',

  props: {
    msg: String
  },

  components: {
    Input,
    TextArea,
    ContentEditable,
    DropDown,
    ButtonRound
  },

  data: () => {
    return {
      title: '',
      body: '',
      color: '#444548',
      mood: {label: 'Neutral', value: '#999999'},
      colors: [{label: 'Happy', colorValue: '#D996C7'}, {label: 'Strong', colorValue: '#C6C150'}, {label: 'Hard times but learning', colorValue: '#942C3F'}, {label: 'Pretty ok', colorValue: '#68B2D0'}], // Move to user-store!!
      defaultColorArray: [],
      picked: '',
      isViewOpen: false,
      isSavingGratitude: false
    };
  },

  methods: {
    getColorData () {
      this.$store.dispatch('bindDefaultColors', { reference: db.collection('gratitudes')} );
    },

    confirmAdd () {
      this.addGratitude(); // @TODO Why not call this directly?
    },

    confirmCancel () {
      this.resetView();
      this.closeView(); // @TODO Why not call this directly?
    },

    addGratitude () {
      this.isSavingGratitude = true; // Loading state

      const title = this.title.trim();
      const body = this.body.trim();
      const color = this.color.trim().length !== 0 ? this.color.trim() : '#000000';
      const mood: IColorItem = {label: this.mood.label, value: this.mood.value};

      const timeStamp: Date = new Date();
      const dayStamp: Date = new Date();

      const weather: object = {
        id: this.$store.getters.currentWeather.weather[0].id,
        description: this.$store.getters.currentWeather.weather[0].description,
        temp: this.$store.getters.currentWeather.main.temp
      };

      const location: object = {
        city: this.$store.getters.currentCity
      };

      dayStamp.setHours(0, 0, 0, 0); // Set to the date at 00:00:00 for easier comparison / filtering in FE

      db.collection('users').doc(this.$store.getters.user.uid).collection('gratitudes').add({
        title,
        body,
        color,
        weather,
        location,
        timeStamp,
        dayStamp,
        mood
      }).then ( () => {
        this.isSavingGratitude = false; // LOADING STATE
        this.resetView();
      })
      .catch( ( error ) => {
        console.error('Error writing document: ', error);
      });

      // Reset form
      this.title = '';
      this.body = '';
      this.color = '';
      this.mood = {label: 'Neutral', value: '#999999'};
    },

    updateTitle (title: string): void {
      this.title = title.trim();
    },

    updateBody (body: string): void {
      this.body = body.trim();
    },

    toggleView () {
      (this.isViewOpen) ? this.closeView() : this.openView();
    },

    openView () {
      this.isViewOpen = true;
    },

    closeView () {
      this.isViewOpen = false;
    },

    resetView () {
      EventBus.$emit('resetContentEditable', 'my-test-parameter');
    },

    backToHome (): void {
      this.$router.push({path: '/'});
    },

    onColorSelected (selectedColor: IColorItem) {
      this.color = selectedColor.value; // @TODO refactor color Strings to color Objects
      this.mood = selectedColor; // @TODO refactor color Strings to color Objects
    }
  },

  computed: mapState({
    defaultColors: (state: any) => {
      return state.defaultColors;
    }
  }),

  watch: {
    // whenever question changes, this function will run
    picked (val) {
      this.color = val;
    }
  },
  created () {
    this.getColorData();
  },
  mounted () {
    // console.log('mounted', this.getRandomPlaceHolder());
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
