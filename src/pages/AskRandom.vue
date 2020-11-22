<template>
  <f7-page
    @page:init="onPageInit"
    @infinite="onInfinite"
    :infinite-preloader="hasNext"
    :infinite="true"
    ref="randomPage"
  >
    <f7-navbar back-link="返回">
      <f7-nav-title>Random</f7-nav-title>
    </f7-navbar>

    <f7-list media-list class="topic-list">
      <f7-list-item
        v-for="item in listData"
        :link="`/item/${item.id}?all=1`"
        :key="item.id"
      >
        <img
          slot="media"
          :src="`https://www.dogedoge.com/favicon/${item.site}.ico`"
        />
        <div slot="title">
          {{ item.title }}
        </div>
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
} from "framework7-vue";

export default {
  components: {
    f7Page,
    f7Navbar,
    f7NavTitle,
    f7List,
    f7ListItem,
  },

  data() {
    return {
      listData: [],
      hasNext: true,
      allowInfinite: true,
    };
  },

  methods: {
    async onPageInit() {
      await this.getData();
    },

    async getData() {
      const resp = await fetch(
        `${process.env.VUE_APP_HOST}/api/v1/hn/askRandom`
      );

      const { data } = await resp.json();
      this.listData = this.listData.concat(data.list);
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
