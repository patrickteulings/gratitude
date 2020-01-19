<template>
  <div class="homepage-hero">
    <div class="numberbar">
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount">{{gratitudes.length}}</span>
          <span class="numberbar-item__description">gratitudes</span>
        </div>
      </div>
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount">{{gratitudes.length}}</span>
          <span class="numberbar-item__description">gratitudes</span>
        </div>
      </div>
      <div class="numberbar-item">
        <div class="numberbar-item__inner">
          <span class="numberbar-item__amount">{{gratitudes.length}}</span>
          <span class="numberbar-item__description">gratitudes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';


export default Vue.extend({
  name: 'HomepageHero',
  props: {
    testvalue: {
      type: String,
      default: 'hoi'
    },
    gratitudes: {
      type: Array,
      default: []
    }

  },

  components: {},

  data: () => {
    return {
      iets: 'alles',
      menuIsOpen: false
    };
  }
});
</script>


