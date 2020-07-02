<template>
  <f7-page @page:init="onPageInit" class="messages-page">
    <f7-navbar :title="title" back-link="返回" :subtitle="count">
      <f7-nav-right>
        <f7-link
          external
          :href="link"
          target="_blank"
          icon-ios="f7:link"
          icon-md="material:menu"
        >
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

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
        :key="message.meta.id + index"
        :type="message.type"
        :name="message.name"
        :first="isFirstMessage(message, index)"
        :last="isLastMessage(message, index)"
        :tail="isTailMessage(message, index)"
      >
        <div
          slot="text"
          v-if="message.text"
          v-html="(message.quoteHtml || '') + message.text"
        ></div>
        <div slot="text-header">
          <template v-if="message.meta.floor">
            {{ message.meta.floor }}楼
            <template v-if="author === message.name">
              •&nbsp;楼主
            </template>
          </template>
        </div>
        <div slot="text-footer"></div>
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
  f7Block,
  f7NavRight,
  f7Link
} from "framework7-vue";

export default {
  components: {
    f7Navbar,
    f7Page,
    f7Messages,
    f7Message,
    f7Preloader,
    f7Block,
    f7NavRight,
    f7Link
  },

  created() {
    const { id } = this.$f7route.params;
    this.id = id;
  },

  data() {
    return {
      messagesData: [],
      id: "",
      isInit: false,
      count: "",
      author: "",
      link: "",
      title: "群聊"
    };
  },
  methods: {
    async onPageInit() {
      await this.getData();
      this.isInit = true;
    },

    onShowChatClick() {
      this.$f7router.navigate(
        `/dialog/${encodeURIComponent(JSON.stringify(this.dialogData))}`
      );
    },

    getText(html) {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.innerText;
    },

    async getData() {
      const resp = await fetch(
        `${process.env.VUE_APP_HOST}/api/v1/hn/item?id=${this.id}`
      );
      const { data } = await resp.json();

      this.count = `${data.comments.length} 条回复`;
      this.title = data.title;
      this.author = data.author;
      this.link = data.link;

      let messagesData = [
        {
          type: "received",
          name: data.author,
          text: data.title,
          meta: {
            id: data.id
          }
        }
      ];
      if (data.text) {
        messagesData.push({
          type: "received",
          name: data.author,
          text: data.text,
          meta: {
            id: data.id
          }
        });
      }

      data.comments.forEach((item, index) => {
        const info = {
          type: "received",
          name: item.author,
          text: item.text,
          meta: {
            id: item.id,
            floor: index + 1
          }
        };

        if (item.parent !== 0) {
          let quoteHtml = "";
          for (let i = index - 1; i >= 0; i--) {
            if (data.comments[i].id === item.parent) {
              quoteHtml = `<div class="quote-html">${this.getText(
                data.comments[i].text
              )}</div>`;
              break;
            }
          }

          info.quoteHtml = quoteHtml;
        }
        messagesData.push(info);
      });

      this.messagesData = messagesData;
    },

    onMessageClick(index, floor, e) {
      let nodeName = e.target.nodeName.toLowerCase();

      if (nodeName === "img") {
        let url = e.target.getAttribute("src");

        if (url) {
          this.photos = [url];
          this.photoBrowserKey = +new Date();

          this.$nextTick(() => {
            this.$refs.photoBrowser.open(0);
          });
        }
      } else if (nodeName !== "a") {
        this.showPopover(index, e);
      }
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

<style lang="scss">
.ios,
.md {
  .view {
    .messages-page {
      background: initial;
      background-image: url(~@/assets/img/background_1.jpg);
      background-repeat: repeat;
      background-size: contain;
      background-position: center;

      .messages-content {
        background: initial;

        .hn-message-list {
          background: initial;

          .message-text {
            font-size: 16px;
          }

          .message-received {
            .message-bubble {
              background-color: #fff;
            }
          }

          .embedded_image {
            max-width: 100%;
          }
        }
      }
    }
  }
}

.ios {
  .theme-dark {
    .view {
      .messages-page {
        .messages-content {
          .message-received {
            .message-bubble {
              background-color: #333;
            }
          }
        }
      }
    }
  }
}

.md {
  .theme-dark {
    .view {
      .messages-page {
        .messages-content {
          .message-received {
            .message-bubble {
              background-color: #fff;
            }
          }
        }
      }
    }
  }
}

.popup {
  .embedded_image {
    max-width: 100%;
  }

  .markdown_body {
    img {
      width: 100%;
    }
  }

  iframe {
    width: 100%;
  }

  .popup-block-content {
    word-break: break-all;
  }
}

.quote-html {
  font-size: 14px;
  border-left: 2px solid #2196f3;
  padding-left: 6px;
  margin-bottom: 5px;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.message-text {
  p {
    margin-bottom: 0;
  }
}
</style>
