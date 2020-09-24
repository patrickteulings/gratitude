<template>

  <div class="loginPage">
    <div class="loginPage__inner">
    <h2 class="user__test">
      Well howdy, it appears you're not logged in yet?</h2>
    <div>
      <!-- <input type="text" placeholder="username" v-model="username" />
      <input type="password" placeholder="password" v-model="password" />
      <button @click="login" :disabled="!isValid">LOGIN</button> -->
      <button class="btn--reset" @click="loginWithGoogle">Login with Google</button>
      <p>{{error}}</p>
    </div>
    </div>
  </div>
</template>

<script>


import useLogin from '@/components/auth/useLogin';

export default {
  setup () {
    const state = useLogin();
    return {
        ...state
    }
  }
}
</script>
