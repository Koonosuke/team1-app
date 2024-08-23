<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
   

      <div class="ui segment">
        <form class="ui form">
          <div class="field">
            <label for="nickname">ユーザー名</label>
            <input v-model="nickname" type="text" name="nickname" placeholder="Nickname" />
          </div>

          <div class="field">
            <label>年齢</label>
            <div class="inline fields">
              <div class="field">
                <input v-model.number="start" type="text" name="agestart" />
                <label for="agestart">歳から</label>
              </div>

              <div class="field">
                <input v-model.number="end" type="text" name="ageend" />
                <label for="ageend">歳まで</label>
              </div>
            </div>
          </div>
        </form>
      </div>
        <!-- ユーザー一覧 -->
      <ul class="ui three column grid">
        <template v-for="(item, index) in filteredUsers" :key="index">
          <li class="column">
            <div class="ui card fluid">
              <div class="content">
                <h2 class="header">
                  {{ item.nickname }}
                  <span class="ui green label">{{ item.age }}</span>
                </h2>
                <span class="meta">{{ item.userId }} </span>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>


<script>
  
  import { baseUrl } from "@/assets/config.js";
  const headers = { Authorization: "mtiToken" };
export default {
  name: 'User',

  data() {
    return {
      users: [],
      nickname: "",
      start: 0,
      end: 100,
    };
  },

  async created() {
    try {
      const res = await fetch(baseUrl + '/users', {
        method: 'GET',
        headers
      });

      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {};

      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }

      this.users = jsonData.users ?? [];
    } catch (e) {
      console.error(e);
    }
  },

  mounted() {

    console.log("Filtered Users:", this.filteredUsers);
  },

  computed: {
    filteredUsers() {
      return this.users.filter(e => {
        const matchNickname = this.nickname ? e.nickname?.match(this.nickname) : true;
        const withinAgeRange = (
          (this.start ? e.age >= this.start : true) &&
          (this.end ? e.age <= this.end : true)
        );

        return matchNickname && withinAgeRange;
      });
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
  },
}
</script>


<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
