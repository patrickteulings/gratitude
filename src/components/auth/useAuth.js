import { toRefs, reactive } from "@vue/composition-api";


import { fb } from '@/services/firebaseConfigTypeScript';
import store from '@/store';

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
  fb.auth().onAuthStateChanged(function(_user) {
    if (_user) {
      state.user = _user;
      store.dispatch('setUser', _user); // Add it to the store!!
    } else {
      state.user = null;
      store.dispatch('setUser', null); // User is gone, nullify
    }
    state.loading = false;
  });

  // return all of the properties from the function
  return {
    ...toRefs(state)
  };
}
