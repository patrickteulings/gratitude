<template>
  <div class="sidebarmenu" v-bind:class="{ isOpen: menuOpen }">
    <div class="sidebarmenu__topbar">
      <div class="navigation__trigger-wrapper">
        <div role="button" @click="this.closeMenu" class="navigation__trigger" :class="{'is-open': menuOpen}">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="sidebarmenu__inner">
      <div class="sidebarmenu__user">
        <h5 class="title">{{user.displayName}}</h5>
        <h6 class="title">{{user.email}}</h6>
        <div v-if="user.photoURL" class="sidebarmenu__user-image"><img :src="user.photoURL" /></div>
      </div>
      <ul style="margin-top: 100px;">
        <li>Settings</li>
        <li>Colors</li>
        <li>Tags</li>
        <li>Etc</li>
        <li><small>{{user.uid}}</small></li>
      </ul>
      <button @click="logout()">LOGOUT</button>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { fb, provider } from '@/services/firebaseConfigTypeScript';

export default Vue.extend ({
  name: 'SidebarMenu',
  data: () => {
    return ({
      iets: 'iets',
      error: ''
    });
  },

  computed: {
    menuOpen () {
      return this.$store.getters.menuState;
    },
    user () {
      return this.$store.getters.user;
    }
  },
  methods: {
    closeMenu () {
      this.$store.dispatch('setMenuState', false);
    },

    logout () {
    fb
      .auth()
      .signOut()
      .then(() => {
        console.log('logging out');
      }, (error) => (this.error = error))
      .catch((error) => {
        // Handle Errors here.
        this.error = error;
      });
    }
  }

});



</script>

<style lang="scss" src="@/styles/style.scss">

</style>
