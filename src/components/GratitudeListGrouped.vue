<template>
  <div class="hello">
    <h1>Add</h1>
    <hr />
    <!-- <button @click="groupItemsByDate">Try grouping</button> -->
    <AddGratitude />
    <div class="articleWrapper">
      <div class="articleColumn" v-if="!isEmptyArr(gratitudes)">
        <article class="article__item"
          v-for="(gratitude, index) in gratitudes"
          :key="gratitude.id"
          :style="{ background: getGratitudeColor(gratitude) }"
        >
          <h1>{{index}}</h1>
          <h5>{{ gratitude.id }}</h5>
          <h2>{{ gratitude.title }}</h2>
          <h3>{{ gratitude.body }}</h3>
          <h4>TIMESTAMP: {{ gratitude.timeStamp.toDate() }}</h4>
          <h4 v-if="gratitude.dayStamp && gratitude.dayStamp !== undefined">
            DAYSTAMP: {{ gratitude.dayStamp.toDate() }}<br>
            DAYSTAMP: {{ getReadableDate(gratitude.dayStamp.toDate()) }}
          </h4>
        </article>
      </div>
      <!-- Grouped Column -->
      <div class="articleColumn">
        <div class="article__item"
          v-for="(gratitudeGroup, index) in groupedGratitudes()"
          v-bind:key="index"
        >
          <div class="gratitude-group__date">
            {{ getReadableDate(gratitudeGroup[0].dayStamp.toDate(), true) }}
          </div>
          <div v-for="item in gratitudeGroup" :key="item.id" :style="{ background: getGratitudeColor(item) }">
            <h1>{{index}}</h1>
            <h5>{{ item.id }}</h5>
            <h2>{{ item.title }}</h2>
            <h3>{{ item.body }}</h3>
            <small>Created on {{ getReadableDate(item.timeStamp.toDate()) }} at {{ getReadableTime(item.timeStamp.toDate()) }}</small>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import { firestorePlugin } from 'vuefire';

import { db } from '@/services/firebaseConfigTypeScript';
import AddGratitude from '@/components/AddGratitude.vue';
import { readableDate, getUniqueDates, readableTime } from '@/helpers/dateHelper';
import { isEmptyArray } from '@/helpers/emptyHelper';


Vue.use(firestorePlugin);

export default Vue.extend({
  name: 'GratitudeListGrouped',
  components: {
    AddGratitude
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
    gratitudes: (state: any) => state.gratitudes
  }),
  methods: {
    getGratitudeColor (gratitude: any) {
      return gratitude.color !== undefined ? gratitude.color : '#FFFFFF';
    },

    getReadableDate (date: Date, longNames: boolean = false) {
      return readableDate(date, longNames);
    },

    getReadableTime (date: Date, longNames: boolean = false) {
      return readableTime(date, longNames);
    },

    groupedGratitudes () {
      const iets = Array.from(getUniqueDates (this.gratitudes));
      console.log(iets.length);
      const test = ['1', '2'];
      return iets;
    },

    isEmptyArr (obj: object[]) {
      return isEmptyArray(obj);
    },

    ...mapActions({
      getData: 'bindGratitudes' // Initializes firebase state-binding in Vuex Store
    })
  },
  created () {
    this.getData();
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
