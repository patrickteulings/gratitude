<template>
  <div class="navigation">
    <div class="navigation__bar">
      <div class="navigation__trigger-wrapper">
        <div class="navigation__trigger is-open">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
        <router-link to="/detail">Detail</router-link>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Navigation',
  components: {

  },
  data: () => {
    return {
      iets: 'alles'
    };
  }
});
</script>
