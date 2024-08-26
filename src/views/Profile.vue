<template>
  <div>
    <div class="ui main container">
      <!-- loading表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>

      <!-- エラーメッセージ用 -->
      <p class="ui negative message" v-if="errorMsg">
        <i class="close icon" @click="clearMsg('error')"></i>
        <span class="header">リマインダーがまだ設定されていません</span>
      </p>

      <!-- 成功メッセージ用 -->
      <p class="ui positive message" v-if="successMsg">
        <i class="close icon" @click="clearMsg"></i>
        <span class="header">成功！</span>
        {{ successMsg }}
      </p>

      <!-- 投稿一覧 -->

      <h3 class="ui dividing header">リマインダー</h3>

      <div class="ui segment">
        <ul class="ui comments divided article-list">
          <template v-for="(message, index) in messages" :key="index">
            <li class="comment">
              <div class="content">
                <span class="author">{{ message.userId }}</span>
                <div class="metadata">
                  <span class="date">{{ convertToLocaleString(message.sentAt) }}</span>
                </div>
                <button
                  
                  class="ui negative mini button right floated"
                  @click="deleteMessage(message)"
                >
                  削除
                </button>
                <div class="contents">
                  <span v-if="message.messageContent" class="ui green label">{{ message.reservationTime }}</span>
                  <div class="ui divider"></div>
                  <p class="text">
                    {{ message.messageContent }}
                  </p>
                  
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Profile",
  
  data() {
    return {
      messages: [],

      userId: "",
      familycode: "",

      successMsg: "",
      errorMsg: "",
      isCallingApi: false,
    };
  },

  created: async function () {
    if (
      window.localStorage.getItem("userId") &&
      window.localStorage.getItem("familycode")
    ) {
      this.userId = window.localStorage.getItem("userId");
      this.familycode = window.localStorage.getItem("familycode");

      await this.getMessages();

    } else {
      window.localStorage.clear();
      this.$router.push({ name: "Login" });
    }
  },

  methods: {
    clearMsg(target) {
      if (target === "error") {
        this.errorMsg = "";
      } else {
        this.successMsg = "";
      }
    },


    async getMessages() {
      this.isCallingApi = true;

      try {

        const res = await fetch(baseUrl + `/message/gardian?familycode=${this.familycode}`, {
          method: "GET",
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }


        this.messages = jsonData ?? [];

      } catch (e) {
        this.errorMsg = `リマインダーがまだ設定されていません: ${e}`;
      } finally {
        this.isCallingApi = false;
      }
    },

    async deleteMessage(article) {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;

      const { userId, timestamp } = article;
      try {
        const res = await fetch(
          `${baseUrl}/message/gardian?userId=${userId}&timestamp=${timestamp}`,
          {
            method: "DELETE",
            headers,
          }
        );

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        const deleted = this.articles.findIndex(
          (a) => a.userId === userId && a.timestamp === timestamp
        );
        this.articles.splice(deleted, 1);
        this.successMsg = "記事が削除されました！";
      } catch (e) {
        console.error(e);
        this.errorMsg = e;
      } finally {
        this.isCallingApi = false;
      }
    },

    convertToLocaleString(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
  },
};
</script>

<style scoped>
.article-list {
  list-style: none;
  margin-bottom: 10px;
  padding: 0;
  max-width: 100%;
}

.contents {
  display: flex;

  align-itmes: center;
}

.contents span {
  width: 80px;
  margin-right: auto;
}

.contents .text {
  display: block;
  width: 100%;
  text-aligin: start;
  margin-right: 50px;
  font-size: 20px;
  font-weight: bold;
}
</style>
