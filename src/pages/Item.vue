<template>
  <f7-page ref="page" @page:init="onPageInit" class="messages-page">
    <f7-navbar :title="title" back-link="返回" :subtitle="count">
      <f7-nav-right>
        <f7-toggle @toggle:change="onShowLinkToggle"></f7-toggle>
        <f7-link
          external
          :href="link"
          target="_blank"
          icon-ios="f7:link"
          icon-md="material:menu"
          class="notranslate"
        >
        </f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-block class="text-align-center" v-if="!isInit">
      <f7-preloader></f7-preloader>
    </f7-block>

    <div
      v-show="isInit && content !== ''"
      v-html="content"
      class="post-content"
      ref="post"
    ></div>

    <f7-messages
      ref="messages"
      :scroll-messages="false"
      class="hn-message-list"
    >
      <f7-message
        v-for="(message, index) in messagesData"
        :key="message.meta.id"
        :type="message.type"
        :name="message.name"
        :first="isFirstMessage(message, index)"
        :last="isLastMessage(message, index)"
        :tail="isTailMessage(message, index)"
      >
        <div slot="text" v-if="message.text" v-html="message.text"></div>
        <div slot="text-header">
          <template v-if="message.meta.floor">
            {{ message.meta.floor }}楼
            <template v-if="author === message.name">
              •&nbsp;楼主
            </template>
          </template>
        </div>
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
  f7Link,
  f7Toggle,
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
    f7Link,
    f7Toggle,
  },

  created() {
    const { id } = this.$f7route.params;
    const { all } = this.$f7route.query;
    this.id = id;
    this.all = all || "";
  },

  data() {
    return {
      messagesData: [],
      id: "",
      all: "",
      isInit: false,
      count: "",
      author: "",
      link: "",
      title: "群聊",
      content: "",
      filterLink: false,
      data: {},
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

    hasLink(text) {
      return text.includes("</a>");
    },

    renderView() {
      const { data } = this;
      this.title = data.title;
      this.author = data.author;
      this.link = data.link;
      this.content = data.content;

      let messagesData = [];
      if (data.text) {
        messagesData.push({
          type: "received",
          name: data.author,
          text: data.text,
          meta: {
            id: data.id,
          },
        });
      }

      data.comments.forEach((item, index) => {
        const info = {
          type: "received",
          name: item.author,
          text: item.text,
          meta: {
            id: item.id,
            floor: index + 1,
          },
        };

        if (!this.filterLink || this.hasLink(item.text)) {
          messagesData.push(info);
        }
      });

      this.count = `${messagesData.length} 条回复`;
      this.messagesData = messagesData;
    },

    async getData() {
      const resp = await fetch(
        `${process.env.VUE_APP_HOST}/api/v1/hn/item?id=${this.id}&all=${this.all}`
      );
      const { data } = await resp.json();
      this.data = data;
      this.renderView();
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
    },

    onShowLinkToggle() {
      this.filterLink = !this.filterLink;
      this.renderView();
      this.$nextTick(() => {
        const height = this.$refs.post.clientHeight;
        this.$refs.page.$el.querySelector(".page-content").scrollTop = height;
      });
    },
  },
};
</script>

<style lang="scss">
.ios,
.md {
  .view {
    .messages-page {
      background: initial;
      background-color: #d6e2ee;
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

.post-content {
  margin: 0;
  background-color: rgb(248, 241, 227);
  padding: 18px;
  font-family: -apple-system-font, Georgia, "Helvetica Neue",
    PingFang-SC-Regular, Helvetica, sans-serif;
  font-size: 17px;
  line-height: 1.74;
  color: rgb(79, 50, 28);
  word-break: break-word;
  margin-top: -1em;

  img,
  video,
  table {
    display: block;
    max-width: 100%;
  }

  blockquote {
    color: rgb(140, 112, 79);
    border-left: 3px solid rgba(154, 128, 92, 0.1);
    margin-left: 2px;
    margin-right: 6px;
    padding-left: 16px;
  }

  a {
    color: rgb(209, 150, 0);
    text-decoration: none;
  }

  code,
  pre {
    white-space: pre-wrap;
  }
}
</style>
