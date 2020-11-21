<template>
  <f7-page
    @page:init="onPageInit"
    :infinite-preloader="isLoading"
    :infinite="isLoading"
    ref="nytPage"
  >
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" panel-open="left"> </f7-link>
      </f7-nav-left>
      <f7-nav-title>NYT</f7-nav-title>
    </f7-navbar>

    <TabView current="/nyt"></TabView>

    <f7-list media-list class="topic-list">
      <f7-list-item
        v-for="item in listData"
        :link="'/nyt-item?url=' + encodeURIComponent(item.url)"
        :key="item.url"
      >
        <div slot="title">
          {{ item.title }}
        </div>
        <div slot="text">{{ item.summary }}</div>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import {
  f7Page,
  f7Navbar,
  f7NavTitle,
  f7List,
  f7ListItem,
  f7NavLeft,
  f7Link
} from "framework7-vue";
import TabView from "@/components/TabView.vue";

export default {
  components: {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7List,
    f7ListItem,
    TabView,
    f7NavLeft,
    f7Link
  },

  data() {
    return {
      listData: [],
      isLoading: true
    };
  },

  methods: {
    async onPageInit() {
      await this.getData();
      this.isLoading = false;
    },

    async getData() {
      const resp = await fetch(
        `${process.env.VUE_APP_HOST}/api/v1/poliwag/nyt-cn`
      );
      const { data } = await resp.json();
      this.listData = data;
    }
  }
};
</script>

<style lang="scss"></style>
