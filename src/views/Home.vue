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
        <i class="close icon" @click="clearMsg"></i>
        <span class="header">成功！</span>
        {{ successMsg }}
      </p>

      <!-- 投稿ボックス -->
      <div class="ui segment">
        <form class="ui form" @submit.prevent="postArticle">
          <div class="field">
            <textarea
              v-model="post.text"
              name="article-content"
              placeholder="伝えたいメッセージ"
            />
          </div>

          <div class="inline field">
            <label for="article-time">伝える時間</label>
            <input type="time" id="article-time" v-model="post.time" name="article-time"/>
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

      <!-- 投稿一覧 -->
      <h3 class="ui dividing header">投稿一覧</h3>
      <div class="ui segment">
        <ul class="ui comments divided article-list">
          <template v-for="(article, index) in articles" :key="index">
            <li class="comment">
              <div class="content">
                <span class="author">{{ article.userId }}</span>
                <div class="metadata">
                  <span class="date">{{ convertToLocaleString(article.timestamp) }}</span>
                </div>
                <button
                  v-if="isMyArticle(article.userId)"
                  class="ui negative mini button right floated"
                  @click="deleteArticle(article)"
                >
                  削除
                </button>
                <p class="text">
                  {{ article.text }}
                </p>
                <span v-if="article.category" class="ui green label">{{ article.category }}</span>
                <div class="ui divider"></div>
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

const headers = { Authorization: "mtiToken" };

export default {
  name: "Home",
  
  data() {
    return {
      post: {
        text: null,
        category: null,
        time: null,  // timeフィールドを追加
      },
      articles: [],
      iam: null,
      successMsg: "",
      errorMsg: "",
      isCallingApi: false,
    };
  },

  computed: {
    isPostButtonDisabled() {
      return !this.post.text || !this.post.time;  // メッセージと時間が入力されていない場合は無効
    },
  },

  created: async function () {
    if (
      window.localStorage.getItem("userId") &&
      window.localStorage.getItem("token")
    ) {
      this.iam = window.localStorage.getItem("userId");
      await this.getArticles();
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

    isMyArticle(id) {
      return this.iam === id;
    },

    async getArticles() {
      this.isCallingApi = true;

      try {
        const res = await fetch(baseUrl + "/articles", {
          method: "GET",
          headers,
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        this.articles = jsonData.articles ?? [];
      } catch (e) {
        this.errorMsg = `記事一覧取得時にエラーが発生しました: ${e}`;
      } finally {
        this.isCallingApi = false;
      }
    },

    async postArticle() {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;

      const reqBody = {
        userId: this.iam,
        text: this.post.text,
        category: this.post.category,
        time: this.post.time,
      };
      try {
        const res = await fetch(baseUrl + "/article", {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers,
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message ?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        this.articles.unshift({ ...reqBody, timestamp: Date.now() });
        this.successMsg = "記事が投稿されました！";
        this.post.text = "";
        this.post.category = "";
        this.post.time = "";  // 投稿後に時間をリセット
      } catch (e) {
        console.error(e);
        this.errorMsg = e;
      } finally {
        this.isCallingApi = false;
      }
    },

    async deleteArticle(article) {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;

      const { userId, timestamp } = article;
      try {
        const res = await fetch(
          `${baseUrl}/article?userId=${userId}&timestamp=${timestamp}`,
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
  margin: 0;
  padding: 0;
  max-width: 100%;
}
.right-align {
  text-align: right;
}
</style>
