import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { db } from '@/services/firebaseConfigTypeScript';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gratitudes: []
  },
  mutations: {
    ...vuexfireMutations
  },
  actions: {
    bindGratitudes: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef('gratitudes', db.collection('gratitudes'));
    })
  },
  getters: {
    getGratitudes: (state: any) => {
      return state.gratitudes;
    }
  }
});
