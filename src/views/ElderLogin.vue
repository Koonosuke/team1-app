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

  name: 'ElderRegister',


  data() {
    return {
      elder: {
        userId: null,
        nickname: null,
        familycode: null
      },
    };
  },

  methods: {
    async submit() {


      try {
        const res = await fetch(baseUrl + `/user/gardian/login?userId=${this.elder.userId}&password=${this.elder.familycode}`, {
          method: "GET",
        });
  
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};
  
        if (!res.ok) {
          const errorMessage = "userIdもしくはpasswordが正しくありません"?? "エラーメッセージがありません";
          throw new Error(errorMessage);
        }
  
        // トークンとユーザーIDを保存
          window.localStorage.setItem("userId", jsonData.userId);
          window.localStorage.setItem("familycode", jsonData.familycode);
  
        // 成功時の処理
     
        // 登録成功後、別のページにリダイレクトするなど
        this.$router.push({ path: "/HomeElder" });
      } catch (e) {
        console.log(e);
        // エラー時の処理
      }
    },

  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
