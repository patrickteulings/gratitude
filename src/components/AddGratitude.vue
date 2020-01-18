<!-- @TODO -->
<!-- Move 'ADD' button, AND, make it an actual button -->

<template>
  <div>
    <div role="button" class="add-gratitude__button" @click="toggleView">+</div>
    <div class="add-gratitude" :class="{'is-open': isViewOpen}">
      <div class="add-gratitude__inner">
        <div class="add-gratitude__form">
          <form @submit.prevent="addGratitude">
            <Input
              v-model="title"
              input-id="title"
              input-label="Your title"
              input-placeholder="Title"
            />
            <TextArea
              v-model="body"
              input-id="body"
              input-label="Your body"
              input-placeholder="Today I'm grateful for"
            />

            <DropDown :listData="defaultColors" @onUpdate="onColorSelected"></DropDown>

            <button>Add gratitude</button>
            <div v-if="isSavingGratitude">Saving...</div>
          </form>
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

      dayStamp.setHours(0, 0, 0); // Set to the date at 00:00:00 for easier comparison / filtering in FE

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
