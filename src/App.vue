<template>
  <f7-app :params="f7Params">
    <f7-view
      url="/"
      :main="true"
      :push-state="true"
      :push-state-root="root"
      :stack-pages="true"
      class="ios-edges"
    >
    </f7-view>
  </f7-app>
</template>

<script>
import { f7App, f7View } from "framework7-vue";
import routes from "./routes";

export default {
  components: {
    f7App,
    f7View
  },

  data() {
    let storageTheme = localStorage.getItem("theme");
    let theme = storageTheme || "auto";

    return {
      f7Params: {
        theme,
        routes,
        id: "m.hn"
      },
      root: "/"
    };
  },

  created() {
    this.root = process.env.VUE_APP_BASE_URL;
  }
};
</script>

<style lang="scss">
body {
  body {
    font-family: PingFang-SC-Regular, "Helvetica Neue", miui, Helvetica,
      sans-serif;
  }
}

pre {
  white-space: normal;
}

.ios,
.md {
  .block-title {
    text-transform: initial;
  }

  .topic-list {
    margin: 0;

    .media-item.top {
      background-color: #f3f2f7;
    }

    .item-media {
      img {
        width: 40px;
        border-radius: 4px;
      }
    }

    a.item-link {
      .item-title-row {
        padding-right: 0;
        background-image: none;

        &::before {
          display: none;
        }

        .item-title {
          white-space: initial;
        }
      }
    }

    .item-inner {
      .item-after {
        font-size: 14px;
      }
    }

    .chip-container {
      height: 20px;
    }
  }

  .theme-dark {
    .topic-list {
      .media-item.top {
        background-color: #333;
      }
    }
  }
}
</style>
