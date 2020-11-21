<template>
  <f7-page
    @page:init="onPageInit"
    @infinite="onInfinite"
    :infinite-preloader="hasNext"
    :infinite="true"
    ref="homePage"
  >
    <f7-navbar>
      <f7-nav-title>hn-links</f7-nav-title>
    </f7-navbar>

    <TabView current="/hn-links"></TabView>

    <f7-list media-list class="topic-list">
      <f7-list-item
        v-for="item in listData"
        :link="'/hn-link/' + item.id"
        :key="item.id"
      >
        <img
          slot="media"
          :src="`https://www.dogedoge.com/favicon/${item.site}.ico`"
        />
        <div slot="title">
          {{ item.title }}
        </div>
        <div slot="text">{{ item.author }} • {{ item.time }}</div>
        <span slot="after">
          <f7-chip :text="item.comments + ''" class="chip-container"></f7-chip>
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
  f7List,
  f7ListItem,
  f7Chip
} from "framework7-vue";
import TabView from "@/components/TabView.vue";

export default {
  components: {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7List,
    f7ListItem,
    f7Chip,
    TabView
  },

  data() {
    return {
      page: 1,
      listData: [],
      hasNext: true,
      allowInfinite: true
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
    }
  }
};
</script>

<style lang="scss"></style>
