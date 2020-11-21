<template>
  <f7-page @page:init="onPageInit" class="messages-page">
    <f7-navbar :title="title" back-link="返回" :subtitle="count"> </f7-navbar>

    <f7-block class="text-align-center" v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-list media-list>
      <f7-list-item
        v-for="(item, index) in links"
        target="_blank"
        external
        :no-chevron="true"
        :key="item.url + index"
        :text="item.title"
        :link="item.url"
      >
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import {
  f7Navbar,
  f7Page,
  f7Preloader,
  f7Block,
  f7List,
  f7ListItem
} from "framework7-vue";

export default {
  components: {
    f7Navbar,
    f7Page,
    f7Preloader,
    f7Block,
    f7List,
    f7ListItem
  },

  created() {
    const { id } = this.$f7route.params;
    this.id = id;
  },

  data() {
    return {
      links: [],
      id: "",
      isInit: false,
      count: "",
      title: "加载中..."
    };
  },
  methods: {
    async onPageInit() {
      await this.getData();
      this.isInit = true;
    },

    async getData() {
      const resp = await fetch(
        `${process.env.VUE_APP_HOST}/api/v1/hn/links?id=${this.id}`
      );
      const { data } = await resp.json();

      this.count = `${data.links.length} links`;
      this.title = data.title;
      this.links = data.links;
    }
  }
};
</script>

<style lang="scss"></style>
