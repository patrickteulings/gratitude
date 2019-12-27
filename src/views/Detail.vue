<template>
  <div>
    <div class="about">
      <h1>This is a Detail page</h1>
    </div>
    <div>
      <div>detail {{ $route.params.id }}</div>
      <div>{{ id }}</div>
      Post details such as time, weather conditions, location(?)
    </div>
    <br><br>
    <div v-if="gratitude !== undefined">
      <small v-if="gratitude.timeStamp !== undefined" class="card__createdAt">Created on {{ getReadableDate(gratitude.timeStamp.toDate()) }} at {{ getReadableTime(gratitude.timeStamp.toDate()) }}</small>
      <br><br>
      <h2 :style="{ color: getGratitudeColor(gratitude) }">{{gratitude.title}}</h2>
      {{gratitude.body}}
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { mapState } from 'vuex';

import { readableDate, readableTime } from '@/helpers/dateHelper';

export default Vue.extend({
  name: 'Detail',
  components: {},
  data () {
    return {
      id: this.$route.params.id
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

    getGratitudeColor (gratitude: any) {
      return gratitude.color !== undefined ? gratitude.color : '#000000';
    },

    getReadableDate (date: Date, longNames: boolean = false) {
      return readableDate(date, longNames);
    },

    getReadableTime (date: Date, longNames: boolean = false) {
      return readableTime(date, longNames);
    }
  },

  mounted () {
    this.getData();
  }
});

</script>
