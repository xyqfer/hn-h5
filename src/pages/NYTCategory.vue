<template>
  <f7-page
    @page:init="onPageInit"
    :infinite-preloader="isLoading"
    :infinite="isLoading"
    ref="nytCategory"
  >
    <f7-navbar :title="title" back-link="返回"> </f7-navbar>

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
import { f7Page, f7Navbar, f7List, f7ListItem } from "framework7-vue";

export default {
  components: {
    f7Page,
    f7Navbar,
    f7List,
    f7ListItem
  },

  created() {
    const { name } = this.$f7route.params;
    const { title } = this.$f7route.query;

    this.name = name;
    this.title = title;
  },

  data() {
    return {
      title: "加载中...",
      name: "",
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
        `${process.env.VUE_APP_HOST}/api/v1/poliwag/nyt-category?name=${
          this.name
        }&p=${this.getRandomPage()}`
      );
      const { data } = await resp.json();
      this.listData = data;
    },

    getRandomPage() {
      return Math.floor(1 + Math.random() * 50);
    }
  }
};
</script>

<style lang="scss"></style>
