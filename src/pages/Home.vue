<template>
  <f7-page
    @page:init="onPageInit"
    @infinite="onInfinite"
    :infinite-preloader="hasNext"
    :infinite="true"
    ref="homePage"
  >
    <f7-navbar>
      <f7-nav-title class="notranslate">HN × 🌀</f7-nav-title>
      <f7-nav-right>
        <f7-link
          href="/random"
          icon-ios="f7:calendar"
          icon-md="material:menu"
          class="notranslate"
        >
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

    <TabView current="/"></TabView>

    <f7-list media-list class="topic-list">
      <f7-list-item
        v-for="item in listData"
        :link="'/item/' + item.id"
        :key="item.id"
      >
        <img
          slot="media"
          :src="'https://stateless-server.vercel.app/proxyimage?url=' + encodeURIComponent(`https://external-content.duckduckgo.com/ip3/${item.site}.ico`)"
        />
        <div slot="title">
          {{ item.title }}
        </div>
        <div class="notranslate" slot="text">
          {{ item.site }} • {{ item.time }}
        </div>
        <span slot="after">
          <f7-chip
            :text="item.comments + ''"
            class="notranslate chip-container"
          ></f7-chip>
        </span>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import {
  f7Page,
  f7Navbar,
  f7NavTitle,
  f7NavRight,
  f7Link,
  f7List,
  f7ListItem,
  f7Chip,
} from "framework7-vue";
import TabView from "@/components/TabView.vue";

export default {
  components: {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7NavRight,
    f7Link,
    f7List,
    f7ListItem,
    f7Chip,
    TabView,
  },

  data() {
    return {
      page: 1,
      listData: [],
      hasNext: true,
      allowInfinite: true,
    };
  },

  methods: {
    async onPageInit() {
      await this.getData(this.page);
    },

    async getData(page = 1) {
      const resp = await fetch(
        `${process.env.VUE_APP_HOST}/api/v1/hn/news?page=${page}`
      );
      const { data } = await resp.json();

      this.listData = this.listData.concat(data.list);
      this.hasNext = data.hasNext;
      this.page++;
    },

    async onInfinite() {
      if (!this.allowInfinite) return;

      this.allowInfinite = false;
      await this.getData(this.page);
      this.allowInfinite = true;
    },
  },
};
</script>

<style lang="scss"></style>
