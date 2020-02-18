<template>
  <div style="overflow-x: hidden">
    <detail-item :detailItemId="this.$route.params.id" />

    <!-- PREV NEXT BUTTONS -->
    <!-- <button-round @buttonClick="enterEditMode" buttonIcon="back" classModifier="hero--detail__prev" :iconColor="getGratitudeColor(getGratitude)" />
    <button-round @buttonClick="updateGratitude" buttonIcon="forward" classModifier="hero--detail__next" :iconColor="getGratitudeColor(getGratitude)"/> -->
    <div class="buttonWrapper" :style="wrapperStyle">
      <button-round buttonIcon="back" classModifier="hero--detail__prev" :style="getStylePrev" style="position: absolute; top:0;"/>
      <button-round buttonIcon="forward" classModifier="hero--detail__next" :style="getStyleNext" style="position: absolute; top:0;"/>
    </div>
  </div>
</template>

<script lang="ts">

// Core
import Vue from 'vue';

// Components
import DetailItem from '@/components/detail/DetailItem.vue';
import ButtonRound from '@/components/UI/ButtonRound.vue';



export default Vue.extend({
  name: 'Detail',
  components: {
    ButtonRound,
    DetailItem
  },

  data () {
    return {
      id: this.$route.params.id,
      touchMovement: {startX: 0, endX: 0, isMoving: false, direction: 'left'},
      horizontalMovement: 0,
      verticalMovement: 0,
      windowWidth: 0
    };
  },

  computed: {
    getStyleNext (): string {
      const start = window.innerWidth + 8;
      const newPosition = (this.touchMovement.direction === 'left') ? start - (this.horizontalMovement * 0.3) : start;
      return `transform: translateX(${newPosition}px)`;
    },

    getStylePrev (): string {
      const start = -72;
      const newPosition = (this.touchMovement.direction === 'right') ? start + (this.horizontalMovement * 0.3) : start;
      return `transform: translateX(${newPosition}px)`;
    },

    wrapperStyle (): string {
      return `position: absolute; top: 0; transform: translateY(${this.verticalMovement - 50}px); width: ${ window.innerWidth }px; height: 100px; overflow-x: hidden;`;
    }
  },

  methods: {
    getWindowWidth () {
      return this.windowWidth;
    },

    handleTouchStart (e: TouchEvent): void {
      this.touchMovement.startX = e.touches[0].pageX;
    },

    handleTouchEnd (e: TouchEvent): void {
      if (this.touchMovement.endX < this.touchMovement.startX) {
        this.touchMovement.direction = 'left';
      } else if (this.touchMovement.endX > this.touchMovement.startX) {
        this.touchMovement.direction = 'right';
      }
      this.resetTouch();
    },

    handleTouchMove (e: TouchEvent): void {
      this.touchMovement.isMoving = true;
      this.touchMovement.direction = (e.changedTouches[0].pageX <= this.touchMovement.startX) ? 'left' : 'right';
      this.verticalMovement = e.changedTouches[0].pageY;
      this.horizontalMovement = Math.abs(this.touchMovement.startX - e.changedTouches[0].pageX);
    },

    handleTouchCancel (e: TouchEvent): void {
      console.log('handleTouchCancel ', e);
    },

    resetTouch (): void {
      this.touchMovement.startX = 0;
      this.touchMovement.endX = 0;
      this.touchMovement.isMoving = false;
      this.horizontalMovement = 0;
      this.verticalMovement = 0;
    }
  },

  mounted () {
    this.windowWidth = window.innerWidth;

    this.$el.addEventListener('touchstart', (e) => this.handleTouchStart(e as TouchEvent), false);
    this.$el.addEventListener('touchend', (e) => this.handleTouchEnd(e as TouchEvent), false);
    this.$el.addEventListener('touchcancel', (e) => this.handleTouchCancel(e as TouchEvent), false);
    this.$el.addEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent), false);
  },

  beforeDestroy () {
    this.$el.removeEventListener('touchstart', (e) => this.handleTouchStart(e as TouchEvent), false);
    this.$el.removeEventListener('touchend', (e) => this.handleTouchEnd(e as TouchEvent));
    this.$el.removeEventListener('touchcancel', (e) => this.handleTouchCancel(e as TouchEvent));
    this.$el.removeEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent));

  }
});

</script>
