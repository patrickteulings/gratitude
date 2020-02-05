<template>
  <div class="clock clocktext">
    <div class="clock__block clock__hours">
      <span class="clocktext">{{ getHours[0] }}</span>
      <span class="clocktext">{{ getHours[1] }}</span>
    </div>
    <div class="clock__block clock__minutes">
      <span class="clocktext">{{ getMinutes[0] }}</span>
    </div>
    <div class="clock__block clock__minutes">
      <span class="clocktext clocktext--light">{{ getMinutes[1] }}</span>
    </div>
    <div class="clock__block clock__seconds">
      <span class="clocktext">{{ getSeconds[0] }}</span>
      <span class="clocktext clocktext--light">{{ getSeconds[1] }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import { clockSeconds } from '@/helpers/clockHelper';

export default Vue.extend({
  name: 'Clock',
  components: {
  },
  data: () => {
    return {
      color: '#C18D18',
      date: new Date(),
      seconds: 0,
      hoursArray: [] as string[],
      minutesArray: [] as string[],
      secondsArray: [] as string[],
      minutes: 0,
      hours: 0
    };
  },
  computed: {
    getHours () {
      return (this.hours === 0) ? ['Twelve', ''] : this.hoursArray;
    },
    getMinutes () {
      if (this.minutes === 0) {
        return [`O'`, `Clock`];
      } else if (this.minutes < 10) {
        return ['Oh', this.minutesArray[0]];
      } else {
        return this.minutesArray;
      }
    },
    getMinutesTest () {
      return this.minutesArray;
    },
    getSeconds () {
      return this.secondsArray;
    }
  },
  methods: {
    startTimer () {
      setInterval(() => {
        this.date = new Date();
        this.hours = this.date.getHours();
        this.minutes = this.date.getMinutes();
        this.seconds = this.date.getSeconds();
        this.hoursArray = clockSeconds[this.hours].split(' ');
        this.minutesArray = clockSeconds[this.minutes].split(' ');
        this.secondsArray = clockSeconds[this.seconds].split(' ');
      }, 1000);
    }
  },
  created () {
    this.startTimer();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $vueBlue: #34495d;

  .articleWrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 3rem;
  }

  .clock {
    position: fixed;
    right: 0rem;
    width: 8em;
    bottom: 0rem;
    font-family: Helvetica;
    font-weight: 700;
    color: $vueBlue;
    font-size: 12px;
    z-index: 200;
    background: #fff;
    padding: 1rem;

    &__block {
      margin-left: 0;
    }

    &__seconds {
      opacity: 0.2;
    }
  }

  .clocktext {
    &--light {
      color: lighten($vueBlue, 30%);
    }
  }

  .clock__seconds {
    .clocktext {
      &:last-child {
        margin-left: 0.2em;
      }
    }
  }
</style>
