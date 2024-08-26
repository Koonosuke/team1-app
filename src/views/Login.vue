<!--見守り人ログイン画面-->
<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <!-- ここにセグメントの中身を記述する -->
        <h1>高齢者ログイン</h1>

        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="elder.userId" />
            </div>
          </div>

          <!--<div class="field">-->
          <!--  <div class="ui left icon input">-->
          <!--    <i class="user icon"></i>-->
          <!--    <input type="text" placeholder="nickname" v-model="elder.nickname" />-->
          <!--  </div>-->
          <!--</div>-->

          <div class="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input type="text" placeholder="familycode" v-model="elder.familycode" />
            </div>
          </div>
          <button class="ui green button" type="submit">
            <i class="sign-in icon"></i>
            ログイン
          </button>
        </form>
      </div>
       <button @click="redirectToElderLogin" class="ui huge gray fluid button">
        見守り人ログインはこちら
      </button>
      <button @click="redirectToRegister" class="ui huge gray fluid button">
        <i class="user circle icon"></i>
        新規登録
      </button>
    </div>
  </div>
</template>


<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: 'ElderLogin',

  data() {
    return {
      elder: {
        userId: null,
        nickname: null,
        familycode: null,
      },
    };
  },

  methods: {
    async submit() {
      try {
        const res = await fetch(`${baseUrl}/user/gardian/login?userId=${this.elder.userId}&password=${this.elder.familycode}`, {
          method: "GET",
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};

        if (!res.ok) {
          const errorMessage = jsonData.error || "userIdもしくはpasswordが正しくありません";
          throw new Error(errorMessage);
        }

        // トークンとユーザーIDを保存
        window.localStorage.setItem("userId", jsonData.userId);
        window.localStorage.setItem("familycode", jsonData.familycode);

        // ログイン成功後、別のページにリダイレクト
        this.$router.push({ path: "/HomeElder" });
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    },

    redirectToRegister() {
      this.$router.push({ path: "/Register" }); // 新規登録ページにリダイレクト
    },
    
    redirectToElderLogin() {
      this.$router.push({ path: "/ElderLogin" });
    },
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
