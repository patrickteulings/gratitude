<template>
  <div class="add-gratitude">
    <form @submit.prevent="addGratitude">
      <Input
        v-model="title"
        input-id="title"
        input-label="Your title"
        input-placeholder="Title"
      />
      <Input
        v-model="body"
        input-id="body"
        input-label="Your body"
        input-placeholder="Today I'm grateful for"
      />
      <Input
        v-model="color"
        input-id="color"
        input-label="Your mood"
        input-placeholder="#C18D18"
      />
      <button>Add gratitude</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Input from '@/components/UI/Input.vue';
import { mapActions, mapState } from 'vuex';
import { firestorePlugin } from 'vuefire';
import { db } from '@/services/firebaseConfigTypeScript';

Vue.use(firestorePlugin);

export default Vue.extend({
  name: 'AddGratitude',
  props: {
    msg: String
  },
  components: {
    Input
  },
  data: () => {
    return {
      title: '',
      body: '',
      color: ''
    };
  },
  methods: {
    addGratitude () {
      const title = this.title.trim();
      const body = this.body.trim();
      const color = this.color.trim().length !== 0 ? this.color.trim() : '#FFFFFF';
      const timeStamp: Date = new Date();
      const dayStamp: Date = new Date();

      dayStamp.setHours(0, 0, 0); // Set to the date at 00:00:00 for easier comparison / filtering in FE

      db.collection('gratitudes').add({
        title,
        body,
        color,
        timeStamp,
        dayStamp
      });
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
