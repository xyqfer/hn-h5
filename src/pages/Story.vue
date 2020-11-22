<template>
  <f7-page
    @page:init="onPageInit"
    @infinite="onInfinite"
    :infinite-preloader="hasNext"
    :infinite="true"
    ref="storyPage"
  >
    <f7-navbar>
      <f7-nav-title class="notranslate">HN 🌀 Ask</f7-nav-title>
      <f7-nav-right>
        <f7-link
          class="notranslate"
          popover-open=".popover-menu"
          icon-ios="f7:bars"
        >
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

    <TabView current="/story"></TabView>

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
        <div class="notranslate" slot="text">
          {{ item.author }} • {{ item.time }}
        </div>
      </f7-list-item>
    </f7-list>

    <f7-popover ref="popover" class="popover-menu">
      <f7-list inline-labels no-hairlines-md>
        <f7-list-input
          type="text"
          placeholder="Id"
          :value="id"
          clear-button
          @keydown.enter.native="goItem"
          @input="onIdInput"
        >
        </f7-list-input>
      </f7-list>
    </f7-popover>
  </f7-page>
</template>

<script>
import {
  f7Page,
  f7Navbar,
  f7NavTitle,
  f7List,
  f7ListItem,
  f7ListInput,
  f7NavRight,
  f7Link,
  f7Popover,
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
    f7NavRight,
    f7Link,
    f7Popover,
    f7ListInput,
  },

  data() {
    return {
      page: 1,
      listData: [],
      hasNext: true,
      allowInfinite: true,
      id: "",
    };
  },

  methods: {
    async onPageInit() {
      await this.getData(this.page);
    },

    async getData(page = 1) {
      const resp = await fetch(
        `${process.env.VUE_APP_HOST}/api/v1/hn/ask?page=${page}`
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

    onIdInput(event) {
      this.id = event.target.value;
    },

    goItem() {
      this.$refs.popover.close();
      this.$f7router.navigate(`/item/${this.id}?all=1`);
      this.id = "";
    },
  },
};
</script>

<style lang="scss"></style>
