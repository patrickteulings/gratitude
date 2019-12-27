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
    <article class="gratitude" v-if="gratitude !== undefined">
      <h2 :style="{ color: getGratitudeColor(gratitude) }">{{gratitude.title}}</h2>
      <small v-if="gratitude.timeStamp !== undefined" class="gratitude__createdAt">Created on {{ getReadableDate(gratitude.timeStamp.toDate()) }} at {{ getReadableTime(gratitude.timeStamp.toDate()) }}</small>
      <p>{{gratitude.body}}</p>
    </article>
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
