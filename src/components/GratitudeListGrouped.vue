<template>
  <div class="hello">
    <AddGratitude />
    <div class="listWrapper">
      <GratitudeCardGroup v-for="(gratitudeGroup, index) in groupedGratitudes()" :gratitude-group="gratitudeGroup" :key="index" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import { firestorePlugin } from 'vuefire';

import { db } from '@/services/firebaseConfigTypeScript';
import AddGratitude from '@/components/AddGratitude.vue';
import GratitudeCardGroup from '@/components/cards/GratitudeCardGroup.vue';
import GratitudeCard from '@/components/cards/GratitudeCard.vue';
import { readableDate, getUniqueDates, readableTime } from '@/helpers/dateHelper';
import { isEmptyArray } from '@/helpers/emptyHelper';


Vue.use(firestorePlugin);

export default Vue.extend({
  name: 'GratitudeListGrouped',
  components: {
    AddGratitude,
    GratitudeCard,
    GratitudeCardGroup
  },
  data: () => {
    return {
      color: '#C18D18'
    };
  },
  firestore: () => {
    return {
      // gratitudes: db.collection('gratitudes').orderBy('timeStamp', 'desc')
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

    groupedGratitudes () {
      const iets = Array.from(getUniqueDates (this.gratitudes));
      const test = ['1', '2'];
      return iets;
    },

    isEmptyArr (obj: object[]) {
      return isEmptyArray(obj);
    },
    testData () {
      this.$store.dispatch('bindGratitudes', { reference: db.collection('gratitudes'), userID: '123456'} );
    },
    ...mapActions({
      getData: 'bindGratitudes' // Initializes firebase state-binding in Vuex Store
    })
  },
  created () {
    this.testData();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .articleWrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 3rem;
  }

  .article {
    &__item {
      padding: 1rem;
    }
  }
</style>
