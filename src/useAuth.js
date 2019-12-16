import { toRefs, reactive } from "@vue/composition-api";
// // import { firestorePlugin } from 'vuefire';
// import firebase from "firebase";
// // // Required for side-effects
// import "firebase/firestore";

import { fb } from '@/services/firebaseConfigTypeScript';


// initialize firebase, this is directly from the firebase documentation
// regarding getting started for the web
// if (firebase.apps.length === 0) {
//   const firebaseConfig = {
//     /* YOUR CONFIGURATION GOES HERE */
//   };
//   firebase.initializeApp(firebaseConfig);
// }

export default function() {
  // our reactive properties...
  let state = reactive({
    user: null,
    loading: true,
    error: null
  });

  // make the firebase call to listen for change in auth state,
  // we have set initial loading status to true so nothing happens on UI
  // side until loading is set to false
  fb.auth().onAuthStateChanged(_user => {
    if (_user) {
      state.user = _user;
      console.log(state.user);
    } else {
      state.user = null;
    }
    state.loading = false;
  });

  // return all of the properties from the function
  return {
    ...toRefs(state)
  };
}
