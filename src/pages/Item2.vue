<template>
  <f7-page @page:init="onPageInit" class="messages-page">
    <f7-navbar :title="title" back-link="返回"></f7-navbar>

    <f7-block class="text-align-center" v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <f7-messages
      ref="messages"
      :scroll-messages="false"
      class="hn-message-list"
    >
      <f7-message
        v-for="(message, index) in messagesData"
        :key="index"
        :type="message.type"
        :first="isFirstMessage(message, index)"
        :last="isLastMessage(message, index)"
        :tail="isTailMessage(message, index)"
      >
        <div slot="text" v-html="message.text"></div>
      </f7-message>
    </f7-messages>
  </f7-page>
</template>

<script>
import {
  f7Navbar,
  f7Page,
  f7Messages,
  f7Message,
  f7Preloader,
  f7Block
} from "framework7-vue";

export default {
  components: {
    f7Navbar,
    f7Page,
    f7Messages,
    f7Message,
    f7Preloader,
    f7Block
  },

  created() {
    const { url } = this.$f7route.query;
    this.url = url;
  },

  data() {
    return {
      messagesData: [],
      url: "",
      isInit: false,
      title: "加载中..."
    };
  },
  methods: {
    async onPageInit() {
      await this.getData();
      this.isInit = true;
    },

    getText(html) {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.innerText;
    },

    async getData() {
      const resp = await fetch(
        `${
          process.env.VUE_APP_HOST
        }/api/v1/poliwag/content?url=${encodeURIComponent(
          this.url
        )}&region=nyt-cn`
      );
      const { data } = await resp.json();

      this.title = data.title;

      this.messagesData = data.content.reduce((acc, item) => {
        acc.push({
          type: "received",
          text: item.en
        });

        acc.push({
          type: "sent",
          text: item.zh
        });

        return acc;
      }, []);
    },

    isFirstMessage(message, index) {
      const self = this;
      const previousMessage = self.messagesData[index - 1];
      if (message.isTitle) return false;
      if (
        !previousMessage ||
        previousMessage.type !== message.type ||
        previousMessage.name !== message.name
      )
        return true;
      return false;
    },

    isLastMessage(message, index) {
      const self = this;
      const nextMessage = self.messagesData[index + 1];
      if (message.isTitle) return false;
      if (
        !nextMessage ||
        nextMessage.type !== message.type ||
        nextMessage.name !== message.name
      )
        return true;
      return false;
    },

    isTailMessage(message, index) {
      const self = this;
      const nextMessage = self.messagesData[index + 1];
      if (message.isTitle) return false;
      if (
        !nextMessage ||
        nextMessage.type !== message.type ||
        nextMessage.name !== message.name
      )
        return true;
      return false;
    }
  }
};
</script>
