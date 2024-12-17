<template>
  <q-expansion-item
    expand-separator
    :icon="icon"
    :label="title"
    :caption="caption"
    :header-inset-level="insetLevel"
    v-if="subMenu.length > 0"
  >
    <q-list>
      <essential-link
        v-for="(link, index) in subMenu"
        :key="index"
        v-bind="link"
        :inset-level="insetLevel + 0.5"
      />
    </q-list>
  </q-expansion-item>
  <q-item
    clickable
    tag="a"
    :href="link"
    v-else
    :inset-level="insetLevel"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  },

  insetLevel: {
    type: Number,
    default: 0
  },

  subMenu: {
    type: Array<any>,
    default: () => []
  }
});
</script>
