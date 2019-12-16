<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <router-link to="/detail">Detail</router-link>
    </div>
    <div v-if="loading">Checking if there is a valid login / should be the splash page</div>
    <div v-else-if="error">{{error}}</div>
    <div v-else-if="user">
      <h5>{{user.displayName}}&nbsp;&nbsp;{{user.email}}</h5>
      <div v-if="user.photoURL" class="user__image"><img :src="user.photoURL" /></div>
      <h4>
        <button @click="logout()">LOGOUT</button>
      </h4>
      <hr />
      <br />
      <div>there is a user, show the routes</div>
    </div>
    <div v-else>
      <div>show login / splash / home</div>
      <LoginForm></LoginForm>
    </div>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import LoginForm from './components/login/LoginForm.vue';

import { computed } from '@vue/composition-api';

// our custom composition functions for firebase auth check
// and for logging in and logging out of firebase
import useAuth from './useAuth';
import useLogin from './useLogin';

export default {
  name: 'app',
  components: {
    LoginForm
  },
  setup () {
    // load in the authentication properties
    const { user, loading, error } = useAuth();

    // load in the login function
    const loginState = useLogin();


    return {
      user,
      loading,

      // here we need to ensure that we get the error from
      // either the loginState or the error returned from the useAuth
      // function
      error : computed(() => (loginState.error  || error).value),

      // set the logout function from the usLogin composition function
      logout: loginState.logout
    };
  }
};
</script>
<style lang="scss" src="@/styles/style.scss">

body, html {
  padding: 0;
  margin: 0;
  font-size: 18px;
  box-sizing: border-box;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #1f1f1c;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/* ----------------------------------------
  BUTTON RESET
---------------------------------------- */

button {
  display: inline-block;
  border: none;
  border-radius: 2px;
  padding: 1rem 2rem;
  margin: 0;
  text-decoration: none;
  background: #1f1f1c;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  text-align: center;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
}

button:hover,
button:focus {
  background: darken(#1f1f1c, 10%);
}

button:focus {
  outline: 0px;
  background: darken(#1f1f1c, 20%);
}

button:active {
    transform: scale(0.99);
}

</style>
