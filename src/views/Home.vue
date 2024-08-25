<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <!-- loading表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>

      <!-- エラーメッセージ用 -->
      <p class="ui negative message" v-if="errorMsg">
        <i class="close icon" @click="clearMsg('error')"></i>
        <span class="header">エラーが発生しました！</span>
        {{ errorMsg }}
      </p>

      <!-- 成功メッセージ用 -->
      <p class="ui positive message" v-if="successMsg">
        <i class="close icon" @click="clearMsg('success')"></i>
        <span class="header">成功！</span>
        {{ successMsg }}
      </p>

      <!-- 投稿ボックス -->
      <div class="ui segment">
        <form class="ui form" @submit.prevent="postMessage">
          <div class="field">
            <textarea
              v-model="message.messageContent"
              name="article-content"
              placeholder="伝えたいメッセージ(20文字まで)"
              @input="limitMessageContent"
            />
          </div>

          <div class="inline field">
            <label for="reservationTime">通知時間</label>
            <input type="time" id="reservationTime" v-model="message.reservationTime" name="reservationTime"/>
          </div>
          <div class="right-align">
            <button
              class="ui green button"
              v-bind:disabled="isPostButtonDisabled"
              type="submit"
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: "Home",
  
  data() {
    return {
      message: {
        messageContent: "",
        reservationTime: "",
      },
      articles: [],
      userId: "",
      familycode: "",
      successMsg: "",
      errorMsg: "",
      isCallingApi: false,
    };
  },

  computed: {
    isPostButtonDisabled() {
      return !this.message.messageContent || !this.message.reservationTime;  // メッセージと時間が入力されていない場合は無効
    },
  },
  

  created() {
    if (window.localStorage.getItem("userId") && window.localStorage.getItem("familycode")) {
      this.userId = window.localStorage.getItem("userId");
      this.familycode = window.localStorage.getItem("familycode");
      console.log(this.userId, this.familycode);
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
    
    limitMessageContent() {
      const maxLength = 20;
      if (this.message.messageContent.length > maxLength) {
        this.message.messageContent = this.message.messageContent.slice(0, maxLength);
      }
    },

    async postMessage() {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;
      
      const reqBody = {
        familycode: this.familycode,
        userId: this.userId,
        messageContent: this.message.messageContent,
        reservationTime: this.message.reservationTime,
      };
      
      try {
        const res = await fetch(baseUrl + "/message/gardian", {
          method: "POST",

          body: JSON.stringify(reqBody),
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message || "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
        
        console.log(this.message.reservationTime)
        this.successMsg = "リマインダーを追加しました";
        this.message.messageContent = "";  // 修正点
      } catch (e) {
        console.error(e);
        this.errorMsg = e.message;  // 修正点
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
  margin: 0;
  padding: 0;
  max-width: 100%;
}
.right-align {
  text-align: right;
}
</style>
