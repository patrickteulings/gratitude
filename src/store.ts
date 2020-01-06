
// @TODO
// CREATE MODULES FOR:
// - USER
// - USER SETTINGS
// - GRATITUDES

import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { db } from '@/services/firebaseConfigTypeScript';
import { User } from '@/interfaces/user';
import { IGratitude } from '@/interfaces/gratitude';

Vue.use(Vuex);

// interface User {

// }

export default new Vuex.Store({
  state: {
    gratitudes: [],
    userLocation: {} as object,
    user: {} as object,
    currentWeather: {} as object,
    currentCity: {} as object,
    selectedGratitude: {} as IGratitude
  },

  mutations: {
    ...vuexfireMutations,
    SET_USER_LOCATION: (state: any, location: object) => {
      state.userLocation = location;
    },

    SET_USER: (state: any, user: object) => {
      console.log(user);
      state.user = user;
    },

    SET_CURRENT_WEATHER: (state: any, weather: object) => {
      state.currentWeather = weather;
    },

    SET_CURRENT_CITY: (state: any, weather: object) => {
      state.currentCity = weather;
    },

    SET_SELECTED_GRATITUDE: (state: any, gratitude: IGratitude) => {
      state.selectedGratitude = gratitude;
      console.log('hoezee', gratitude);
    },

    UPDATE_SELECTED_GRATITUDE: (state: any) => {
      console.log('updated');
    }
  },

  actions: {
    bindGratitudes: firestoreAction(({ bindFirestoreRef }, ref) => {
      const { reference, userID } = ref;
      console.log('hier', reference, userID);
      // return the promise returned by `bindFirestoreRef`
      // return bindFirestoreRef('gratitudes', reference);
      return bindFirestoreRef('gratitudes', db.collection('users').doc('1RwEzkhpPEYGJxBCNb9enEg6CZr1').collection('gratitudes'));
    }),

    setUserLocation: (context: any, location: any) => {
      context.commit('SET_USER_LOCATION', { latitude: location.coords.latitude, longitude: location.coords.longitude });
    },

    setUser: (context: any, user: any) => {
      console.log('setting user', user);
      context.commit('SET_USER', user);
    },

    setCurrentWeather: (context: any, weather: object) => {
      context.commit('SET_CURRENT_WEATHER', weather);
    },

    setCurrentCity: (context: any, data: object) => {
      context.commit('SET_CURRENT_CITY', data);
    },

    setSelectedGratitude: (context: any, id: string) => {
      const {commit, state} = context;
      const user = state.user as User;
      console.log('selected', user);
      const ref = db.collection('users').doc(user.uid).collection('gratitudes').doc(id);

      ref.get().then( (res) => {
        commit('SET_SELECTED_GRATITUDE', res.data());
      });
    },

    deleteGratitude: (context: any, id: string) => {
      const { commit, state } = context;
      const user = state.user as User;

      const ref = db.collection('users').doc(user.uid).collection('gratitudes').doc(id);

      return ref.delete();
    },

    updateSelectedGratitude: (context: any, gratitudeObject: any) => {
      console.log(gratitudeObject);
      const { commit, state } = context;
      const user = state.user as User;
      const {id, payload} = gratitudeObject;
      const ref = db.collection('users').doc(user.uid).collection('gratitudes').doc(id);
      payload.title = 'tadaa';
      return ref.update(payload);
    }
  },

  getters: {
    getGratitudes: (state: any) => {
      return state.gratitudes;
    },

    location: (state: any) => {
      return state.userLocation;
    },

    currentWeather: (state: any) => {
      return state.currentWeather;
    },

    currentCity: (state: any) => {
      return state.currentCity;
    },

    user: (state: any) => {
      return state.user;
    },

    selectedGratitude: (state: any) => {
      return state.selectedGratitude;
    }
  }
});
