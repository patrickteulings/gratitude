<template>
  <div class="splash">
    <h2 class="user__test" style="height: 80vh;">
      This page will be shown if a check has been done if a user exists, and none is found or logged in.<br><br>
      It should show information about the app, and provide links to a login / register page.
    </h2>
    <button @click="goToLogin">GoTo LoginForm</button>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';

export default Vue.extend({
  name: 'FrontPage',
  components: {
  },
  methods: {
    goToLogin () {
      this.$router.push({path: '/login'});
    }
  }
});
</script>
