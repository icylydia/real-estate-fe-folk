<template>
  <q-layout>
    <q-page-container>
      <ConstructingPage />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ConstructingPage from 'pages/ConstructingPage.vue';

export default defineComponent({
  name: 'ResetPasswordPage',
  components: {ConstructingPage},
});
</script>
