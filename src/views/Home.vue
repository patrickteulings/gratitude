<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Clock />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Clock from '@/components/Clock.vue';

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
    Clock
  }
});
</script>
