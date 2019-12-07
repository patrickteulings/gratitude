<template>
  <div class="clock clocktext">
    <div class="clock__block clock__hours">
      <span class="clocktext">{{ getHours[0] }}</span>
      <span class="clocktext">{{ getHours[1] }}</span>
    </div>
    <div class="clock__block clock__minutes">
      <span class="clocktext">{{ getMinutes[0] }}</span><br>
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
      hoursArray: [] as any,
      minutesArray: [] as any,
      secondsArray: [] as any,
      minutes: 0,
      hours: 0
    };
  },
  computed: {
    getHours () {
      return this.hoursArray;
    },
    getMinutes () {
      if (this.minutes === 0) {
        return ['', ''];
      } else if (this.minutes < 10) { // @todo add logic for round numbers eg Thirty, Fourty
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
        this.hours = new Date().getHours();
        this.minutes = new Date().getMinutes();
        this.seconds = new Date().getSeconds();
        this.hoursArray = clockSeconds[this.hours - 1].split(' ');
        this.minutesArray = clockSeconds[this.minutes - 1].split(' ');
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
    right: 4rem;
    width: 4em;
    bottom: 2rem;
    font-family: Helvetica;
    font-weight: 700;
    color: $vueBlue;
    font-size: 12px;

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
