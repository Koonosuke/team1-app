<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
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
          
          <div class="field" v-if="!isLogin">
            <i class="tag icon"></i>
            <input type="text" placeholder="Nickname" v-model="user.nickname">
          </div>
          
          <div class="field"  v-if="!isLogin">
            <i class="calendar icon"></i>
            <input type="text" placeholder="Age" v-model.number="user.age">
          </div>
           <button class="ui huge green fluid button" type="submit">
        {{submitText}}
        </button>
        </form>
      </div>
     
    </div>
    <button @click="toggleMode()" class="ui huge gray fluid button" type="submit">
    {{toggleText}}
    </button>
  </div>
</template>

<script>
// 必要なものはここでインポートします
import { baseUrl } from "@/assets/config.js";
// @は/srcの同じ意味です
// import something from '@/components/something.vue';

export default {
  name: 'Login',
 
  components: {
    // 読み込んだコンポーネント名をここに記述する
  },
 
  data() {
    // Vue.jsで使う変数はここに記述する
    return {
    isLogin: true,
    user: {
        userId: null,
        password: null,
        nickname: null,
        age: null,
      },
    };
  },
 
  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    submitText() {
      return this.isLogin ? "ログイン" : "新規登録"
    },
    toggleText() {
      return this.isLogin ? "新規登録" : "ログイン"
    }
  },
 
  methods: {
    // Vue.jsで使う関数はここで記述する
    toggleMode() {
      this.isLogin = !this.isLogin
    },
    
    
 async submit() {
  if (this.isLogin) {
    // ログイン処理
    const headers = { "Authorization": "mtiToken" };
    const reqBody = {
      userId: this.user.userId,
      password: this.user.password,
    };

    try {
      const res = await fetch(baseUrl + "/user/login", {
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

      // トークンとユーザーIDを保存
      window.localStorage.setItem('token', jsonData.token);
      window.localStorage.setItem('userId', this.user.userId);

      // 成功時の処理
      this.$router.push({ path: "/Home" }); // ホームページにリダイレクト
    } catch (e) {
      console.error(e);
      // エラー時の処理
      alert(`ログインエラー: ${e.message}`);
    }
  } else {
    // 新規登録処理
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'mtiToken'
    };
    const reqBody = {
      userId: this.user.userId,
      password: this.user.password,
      nickname: this.user.nickname,
      age: this.user.age
    };

    try {
      const res = await fetch(baseUrl + "/user/signup", {
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

      // 成功時の処理
      alert("新規登録が成功しました。ログイン画面に戻ります。");
      this.isLogin = true; // モードをログインに戻す
    } catch (e) {
      console.error(e);
      // エラー時の処理
      alert(`新規登録エラー: ${e.message}`);
    }
  }
}

  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述します */
</style>