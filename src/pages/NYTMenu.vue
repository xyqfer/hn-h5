<template>
  <f7-page>
    <f7-block-title>分类</f7-block-title>
    <f7-list>
      <f7-list-item
        v-for="item in pageData"
        panel-close
        :key="item.name"
        :link="
          `/nyt-category/${item.name}?title=${encodeURIComponent(item.title)}`
        "
        :title="item.title"
      >
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { f7Page, f7BlockTitle, f7List, f7ListItem } from "framework7-vue";

export default {
  components: {
    f7Page,
    f7BlockTitle,
    f7List,
    f7ListItem
  },

  data() {
    return {
      pageData: [
        {
          name: "world",
          title: "国际"
        },
        {
          name: "china",
          title: "中国"
        },
        {
          name: "business",
          title: "商业与经济"
        },
        {
          name: "lens",
          title: "镜头"
        },
        {
          name: "technology",
          title: "科技"
        },
        {
          name: "science",
          title: "科学"
        },
        {
          name: "health",
          title: "健康"
        },
        {
          name: "education",
          title: "教育"
        },
        {
          name: "culture",
          title: "文化"
        },
        {
          name: "style",
          title: "风尚"
        },
        {
          name: "travel",
          title: "旅游"
        },
        {
          name: "real-estate",
          title: "房地产"
        },
        {
          name: "opinion",
          title: "观点与评论"
        }
      ]
    };
  }
};
</script>
