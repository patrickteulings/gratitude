<template>
  <div class="navigation">
    <div class="navigation__bar">
      <div class="navigation__trigger-wrapper">
        <div role="button" @click="this.toggleMenu" class="navigation__trigger" :class="{'is-open': menuState}">
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
      <div @click="handleLogout" role="button" class="navigation__user">
        <img class="navigation__user-image" :src="getUserImage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Navigation',
  props: {
    testvalue: {
      type: String,
      default: 'hoi'
    }
  },
  components: {

  },

  data: () => {
    return {
      iets: 'alles',
      menuIsOpen: false
    };
  },

  computed: {
    hasUser (): boolean {
      return this.$store.getters.user !== null;
    },

    getUserImage (): string {
      return this.$store.getters.user.photoURL;
    },

    isOpen (): boolean {
      return this.$store.getters.isMenuOpen;
    },

    menuState (): boolean {
      return this.$store.getters.menuState;
    }
  },

  methods: {
    toggleMenu () {
      if (this.$store.getters.menuState === true) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    },

    openMenu (): void {
      this.$store.dispatch('setMenuState', true);
    },

    closeMenu (): void {
      this.$store.dispatch('setMenuState', false);
    },

    handleLogout (): void {
      this.$emit('onLogout');
    }
  }
});
</script>


