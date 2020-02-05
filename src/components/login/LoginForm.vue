<template>

  <div class="splash">
    <h2 class="user__test" style="height: 80vh;">
      This page will be shown if a check has been done if a user exists, and none is found or logged in.<br><br>
      It should show information about the app, and provide links to a login / register page.
    </h2>
    <div>
      <input type="text" placeholder="username" v-model="username" />
      <input type="password" placeholder="password" v-model="password" />
      <button @click="login" :disabled="!isValid">LOGIN</button>
      <button @click="loginWithGoogle">Google</button>
      <p>{{error}}</p>
    </div>
  </div>
</template>

<script>
// import { reactive, toRefs } from "@vue/composition-api";
import useLogin from '@/components/auth/useLogin';
export default {
  setup () {
    const state = useLogin();
    return {
        ...state
    };
  }
};
</script>
