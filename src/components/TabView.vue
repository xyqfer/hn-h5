<template>
  <f7-toolbar :position="'bottom'" tabbar labels>
    <f7-link
      v-for="tab in tabs"
      :tab-link-active="tab.link === current"
      :key="tab.link"
      tab-link=""
      :href="tab.link"
      :animate="false"
      :icon-ios="tab.icon"
      class="notranslate"
    >
    </f7-link>
  </f7-toolbar>
</template>

<script>
import { f7Link, f7Toolbar } from "framework7-vue";

export default {
  components: {
    f7Link,
    f7Toolbar,
  },

  extends: f7Toolbar,

  data() {
    return {
      tabs: [
        {
          link: "/",
          icon: "f7:chat_bubble",
        },
        {
          link: "/story",
          icon: "f7:equal_square",
        },
      ],
    };
  },

  props: {
    current: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss"></style>
