<!-- @TODO -->
<!-- Move 'ADD' button, AND, make it an actual button -->

<template>
  <div>
    <div role="button" class="add-gratitude__button" :class="{'is-visible': !isViewOpen}" @click="toggleView"><span class="gratitude-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span></div>
    <div role="button" class="add-gratitude__button add-gratitude__button-confirm" :class="{'is-visible': isViewOpen}" @click="confirmAdd"><span class="gratitude-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></span></div>
    <div role="button" class="add-gratitude__button button-cancel" :class="{'is-visible': isViewOpen}" @click="confirmCancel"><span class="gratitude-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span></div>
    <div class="add-gratitude" :class="{'is-open': isViewOpen}">
      <div class="add-gratitude__inner">
        <div class="add-gratitude__form">
          <content-editable class="add-gratitude__title" @onUpdate="updateTitle" content="" placeholder="Five million stones" color="#D996C7"></content-editable>
          <content-editable class="add-gratitude__body" @onUpdate="updateBody" content="" placeholder="Five million body stones" color="#D996C7"></content-editable>
          <DropDown :listData="defaultColors" @onUpdate="onColorSelected"></DropDown>
          <button @click="addGratitude">Add gratitude</button>
          <div v-if="isSavingGratitude">Saving...</div>
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

// Interfaces
interface IColorItem {
  label: string;
  value: string;
}

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
    DropDown
  },

  data: () => {
    return {
      title: '',
      body: '',
      color: '',
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
      this.addGratitude();
    },

    confirmCancel () {
      this.closeView();
    },

    addGratitude () {
      this.isSavingGratitude = true; // Loading state

      const title = this.title.trim();
      const body = this.body.trim();
      const color = this.color.trim().length !== 0 ? this.color.trim() : '#000000';

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
        dayStamp
      }).then ( () => {
        this.isSavingGratitude = false; // LOADING STATE
      })
      .catch( ( error ) => {
        console.error('Error writing document: ', error);
      });

      // Reset form
      this.title = '';
      this.body = '';
      this.color = '';
    },

    updateTitle (title: string): void {
      this.title = title.trim();
    },

    updateBody (body: string): void {
      this.body = body.trim();
    },

    getColorPalletteItem (colorItem: any) {
      return `color: ${colorItem.colorValue}`;
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

    onColorSelected (selectedColor: IColorItem) {
      this.color = selectedColor.value;
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
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
