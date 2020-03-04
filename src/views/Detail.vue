<template>
  <div style="overflow-x: hidden">
    <detail-item :detailItemId="detailItemID" />
    <div class="detail__navigation" :style="wrapperStyle">
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

// Helpers
import { getDescendingGratitudes } from '@/helpers/gratitudeHelper';

// Interfaces
import { IGratitude } from '../interfaces/gratitude';


export default Vue.extend({
  name: 'Detail',
  components: {
    ButtonRound,
    DetailItem
  },

  data () {
    return {
      detailItemID: this.$route.params.id,
      gratitudes: getDescendingGratitudes(this.$store.state.gratitudes),
      touchMovement: {
        startX: 0,
        endX: 0,
        isMoving: false,
        direction: 'left',
        horizontalMovement: 0,
        verticalMovement: 0
      },
      windowWidth: 0
    };
  },

  computed: {
    getStyleNext (): string {
      const start = window.innerWidth + 8; // Small offset for button shadows
      const newPosition = (this.touchMovement.direction === 'left') ? start - (this.touchMovement.horizontalMovement * 0.5) : start;

      return `transform: translateX(${newPosition}px)`;
    },

    getStylePrev (): string {
      const start = -72; // Buttonwidth + small offset for button shadows
      const newPosition = (this.touchMovement.direction === 'right') ? start + (this.touchMovement.horizontalMovement * 0.5) : start;

      return `transform: translateX(${newPosition}px)`;
    },

    wrapperStyle (): string {
      return `position: absolute; top: 0; transform: translateY(${ this.touchMovement.verticalMovement - 50 }px); width: ${ window.innerWidth }px; height: 100px; overflow-x: hidden;`;
    }
  },

  methods: {
    getWindowWidth (): number {
      return this.windowWidth;
    },

    navigateTo (newIndex: number): void {
      const newItemIndex = (newIndex < 0) ? 0 : (newIndex > this.gratitudes.length) ? this.gratitudes.length - 2 : newIndex;
      const newItemID = this.gratitudes[newItemIndex].id;

      this.detailItemID = newItemID;
      this.$router.push({ path: `/details/gratitude/${newItemID}` });
    },

    handleTouchStart (e: TouchEvent): void {
      this.touchMovement.startX = e.touches[0].pageX;
    },

    handleTouchEnd (e: TouchEvent): void {
      this.touchMovement.endX = e.changedTouches[0].pageX;

      if (Math.abs(this.touchMovement.endX - this.touchMovement.startX) < 30) return; // Threshold

      const currentItem = this.gratitudes.find((item) => item.id === this.detailItemID) as IGratitude;
      const currentItemIndex = this.gratitudes.indexOf(currentItem);
      const newIndex = (this.touchMovement.endX < this.touchMovement.startX) ? currentItemIndex + 1 : currentItemIndex - 1;

      this.navigateTo(newIndex);
      this.resetTouch();
    },

    handleTouchMove (e: TouchEvent): void {
      this.touchMovement.isMoving = true;

      this.touchMovement.direction = (e.changedTouches[0].pageX <= this.touchMovement.startX) ? 'left' : 'right';
      this.touchMovement.verticalMovement = e.changedTouches[0].pageY;
      this.touchMovement.horizontalMovement = Math.abs(this.touchMovement.startX - e.changedTouches[0].pageX);
    },

    handleTouchCancel (e: TouchEvent): void {
      console.log('handleTouchCancel ', e);
    },

    resetTouch (): void {
      this.touchMovement.startX = 0;
      this.touchMovement.endX = 0;
      this.touchMovement.isMoving = false;
      this.touchMovement.horizontalMovement = 0;
      this.touchMovement.verticalMovement = 0;
    }
  },

  mounted () {
    this.windowWidth = window.innerWidth;
    this.gratitudes = getDescendingGratitudes(this.$store.state.gratitudes);

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
