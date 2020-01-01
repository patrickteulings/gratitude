<!-- @TODO -->
<!-- Move 'ADD' button, AND, make it an actual button -->

<template>
  <div>
    <div role="button" class="add-gratitude__button" @click="toggleView">ADD</div>
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
            <Input
              v-model="color"
              input-id="color"
              input-label="Your mood"
              input-placeholder="#C18D18"
            />
            <div class="color-dropdown">
              <div v-for="(colorItem) in colors" :key="colorItem.colorValue" style="margin-bottom: 1rem;">
                <label :for="colorItem.colorValue" :style="getColorPalletteItem(colorItem)">{{colorItem.label}}</label>
                <input :id="colorItem.colorValue" v-model="picked" type="radio" name="colorValue" :value="colorItem.colorValue">
              </div>
              <div>{{ picked }}</div>
            </div>
            <button>Add gratitude</button>
            <div v-if="isSavingGratitude">Saving...</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Input from '@/components/UI/Input.vue';
import TextArea from '@/components/UI/TextArea.vue';
import { mapActions, mapState } from 'vuex';
import { firestorePlugin } from 'vuefire';
import { db } from '@/services/firebaseConfigTypeScript';

Vue.use(firestorePlugin);

export default Vue.extend({
  name: 'AddGratitude',
  props: {
    msg: String
  },
  data: () => {
    return {
      title: '',
      body: '',
      color: '',
      colors: [{label: 'Happy', colorValue: '#E8486F'}, {label: 'Strong', colorValue: '#C6C150'}, {label: 'Hard times but learning', colorValue: '#942C3F'}, {label: 'Pretty ok', colorValue: '#68B2D0'}], // Move to user-store!!
      picked: '',
      isViewOpen: false,
      isSavingGratitude: false
    };
  },
  components: {
    Input,
    TextArea
  },
  methods: {
    addGratitude () {
      const title = this.title.trim();
      const body = this.body.trim();
      const color = this.color.trim().length !== 0 ? this.color.trim() : '#000000';
      const timeStamp: Date = new Date();
      const dayStamp: Date = new Date();
      const weather: object = {
        id: this.$store.getters.currentWeather.weather[0].id,
        description: this.$store.getters.currentWeather.weather[0].description
      };
      const location: object = {
        city: this.$store.getters.currentCity
      };

      dayStamp.setHours(0, 0, 0); // Set to the date at 00:00:00 for easier comparison / filtering in FE

      this.isSavingGratitude = true;

      db.collection('users').doc(this.$store.getters.user.uid).collection('gratitudes').add({
        title,
        body,
        color,
        weather,
        location,
        timeStamp,
        dayStamp
      }).then ( () => {
        this.isSavingGratitude = false;
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
    }
  },
  watch: {
    // whenever question changes, this function will run
    picked (val) {
      this.color = val;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
