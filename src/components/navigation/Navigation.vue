<template>
  <div class="navigation">
    <div class="navigation__bar">
      <div class="navigation__trigger-wrapper">
        <div role="button" @click="this.toggleMenu" class="navigation__trigger" :class="{'is-open': menuIsOpen}">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav>
        <router-link class="navigation__item" to="/">Home</router-link>
        <router-link class="navigation__item" to="/about">About</router-link>
        <router-link class="navigation__item" to="/detail">Detail</router-link>
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
      iets: 'alles',
      menuIsOpen: false
    };
  },
  methods: {
    toggleMenu () {
      console.log('menu', this.menuIsOpen);
      this.menuIsOpen === true ? this.closeMenu() : this.openMenu();
    },

    closeMenu () {
      this.menuIsOpen = false;
    },

    openMenu () {
      this.menuIsOpen = true;
    }
  }
});
</script>
