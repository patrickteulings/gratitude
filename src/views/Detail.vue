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
      <button @click="deleteGratitude" class="btn-reset">delete</button>
      <button @click="toggleEditMode" class="btn-reset">edit</button>
    </article>
    <article class="gratitude" v-if="gratitude !== undefined">
      <form @submit.prevent="updateGratitude(gratitude)" class="editableForm " :class="{ isEditing: editMode }">
        <Input :style="{ color: getGratitudeColor(gratitude) }"
          v-model="gratitude.title"
          input-id="title"
          input-label=""
          input-placeholder="A title could be really usefull you know..."
          input-classname="title"
          :input-color=getGratitudeColor(gratitude)
        />
          <TextArea
            v-model="gratitude.body"
            input-id="body"
            input-label=""
            input-placeholder="Want to add some bodytext?"
            input-classname="body"
          />
          <Input
            v-model="gratitude.color"
            input-id="color"
            input-label=""
            input-placeholder="Let color brighten your life"
            input-classname="color"
          />
        <button class="btn-delete">update</button><span v-if="isUpdating">Aan het updaten</span>
      </form>
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
import TextArea from '@/components/UI/Input.vue';

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
      editMode: true,
      isUpdating: false
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
      this.isUpdating = true;

      this.$store.dispatch('updateSelectedGratitude', {id: this.$route.params.id, payload: gratitude}).then( (response) => {
        this.isUpdating = false;
      }).catch( (error) => {
        console.error('Error updating gratitide ', error);
      });
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
      return gratitude.weather;
    },

    getCity (gratitude: any) {
      return (gratitude.location !== undefined) ? gratitude.location.city.osmtags['name-en'] : 'looking...';
    },

    getWeatherIconOWM (gratitudeWeather: any) {
      return `wi wi-owm-day-${gratitudeWeather.id}`;
    },

    toggleEditMode () {
      this.editMode = !this.editMode;
    }
  },

  mounted () {
    this.getData();
  }
});

</script>
