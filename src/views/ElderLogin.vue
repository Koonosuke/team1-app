<template>
  <div>
    <div class="ui main container">
      <h1 class="ui header">見守り人ログイン</h1>
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <i class="user icon"></i>
            <input type="text" placeholder="ID" v-model="user.userId">
          </div>
          
          <div class="field">
            <i class="lock icon"></i>
            <input type="password" placeholder="Password" v-model="user.password">
          </div>
          <button class="ui huge green fluid button" type="submit">
            <i class="sign-in icon"></i>
            ログイン
          </button>
        </form>
      </div>
     
     
    </div>
  </div>
</template>
<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: 'Login',
 
  data() {
    return {
      user: {
        userId: null,
        password: null,
      },
    };
  },

  methods: { // methods ブロックを追加
    async submit() {
      try {
        const res = await fetch(`${baseUrl}/user/gardian/login?userId=${this.user.userId}&password=${this.user.password}`, {
          method: "GET",
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.message || "エラーメッセージがありません";
          throw new Error(errorMessage);
        }

        // トークンとユーザーIDを保存
        window.localStorage.setItem("userId", jsonData.userId);
        window.localStorage.setItem("familycode", jsonData.familycode);

        // 成功時の処理
        this.$router.push({ path: "/Home" }); // ホームページにリダイレクト
      } catch (e) {
        console.error(e);
        // エラー時の処理
        alert(`ログインエラー: ${e.message}`);
      }
    }
  } // methods ブロックの閉じ
}
</script>


<style scoped>
.ui.header {
  text-align: center;
  margin-bottom: 20px; /* 修正しました */
}
</style>
