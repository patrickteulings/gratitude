<template>
  <div>
    <AddGratitude />
    <div class="listWrapper">
      <div class="listWrapper__loading" v-if="!gratitudes.length">
        <loading-spinner />
      </div>
      <GratitudeCardGroup v-for="(gratitudeGroup, index) in groupedGratitudes()" :gratitude-group="gratitudeGroup" :key="index" />
    </div>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';

// FireStore
import { firestorePlugin } from 'vuefire';
import { db } from '@/services/firebaseConfigTypeScript';

// Helpers
import { readableDate, readableTime } from '@/helpers/dateHelper';
import { getGratitudesByDay } from '@/helpers/gratitudeHelper';
import { isEmptyArray } from '@/helpers/emptyHelper';

// Store
import { mapActions, mapState } from 'vuex';

// Comnponents
import AddGratitude from '@/components/home/AddGratitude.vue';
import GratitudeCardGroup from '@/components/cards/GratitudeCardGroup.vue';
import GratitudeCard from '@/components/cards/GratitudeCard.vue';
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue';


export default Vue.extend({
  name: 'GratitudeList',
  components: {
    AddGratitude,
    GratitudeCard,
    GratitudeCardGroup,
    LoadingSpinner
  },

  data: () => {
    return {
      color: '#C18D18'
    };
  },

  computed: mapState({
    gratitudes: (state: any) => state.gratitudes,
    user: (state: any) => state.user
  }),

  methods: {
    getReadableDate (date: Date, longNames: boolean = false) {
      return readableDate(date, longNames);
    },

    getReadableTime (date: Date, longNames: boolean = false) {
      return readableTime(date, longNames);
    },

    // @TODO - Add check before returning data, return a nice error please
    groupedGratitudes () {
      return Array.from(getGratitudesByDay (this.gratitudes));
    },

    isEmptyArr (obj: object[]) {
      return isEmptyArray(obj);
    },

    loadData () {
      this.$store.dispatch('bindGratitudes', { reference: db.collection('gratitudes'), userID: this.$store.getters.user.uid} ).then(() => {
        this.$emit('onDataLoaded', this.gratitudes);
      });
    }
  },

  created () {
    this.loadData();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
