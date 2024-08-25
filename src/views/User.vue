<template>
  <div>
    <div class="ui main container main-container">
      <div class="message-cards">
        <div class="message-gardian">
          <p class="time">11:00</p>
          <p class="text">おはよう! 起きた？</p>
        </div>
        
        <div class="message-elder">
          <p class="time">11:00</p>
          <p class="elder-response">はい!</p>
        </div>
      </div>
            <div class="message-cards">
        <div class="message-gardian">
          <p class="time">11:00</p>
          <p class="text">おはよう!</p>
        </div>
        
        <div class="message-elder">
          <p class="time">11:00</p>
          <p class="elder-response">いいえ!</p>
        </div>
      </div>
      <!-- 基本的なコンテンツはここに記載する -->
      <!--<div class="ui segment">-->
      <!--  <form class="ui form">-->
      <!--    <div class="field">-->
      <!--      <label for="nickname">ユーザー名</label>-->
      <!--      <input v-model="nickname" type="text" name="nickname" placeholder="Nickname" />-->
      <!--    </div>-->

      <!--    <div class="field">-->
      <!--      <label>年齢</label>-->
      <!--      <div class="inline fields">-->
      <!--        <div class="field">-->
      <!--          <input v-model.number="start" type="text" name="agestart" />-->
      <!--          <label for="agestart">歳から</label>-->
      <!--        </div>-->

      <!--        <div class="field">-->
      <!--          <input v-model.number="end" type="text" name="ageend" />-->
      <!--          <label for="ageend">歳まで</label>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--  </form>-->
      <!--</div>-->
        <!-- ユーザー一覧 -->
      <!--<ul class="ui three column grid">-->
      <!--  <template v-for="(item, index) in filteredUsers" :key="index">-->
      <!--    <li class="column">-->
      <!--      <div class="ui card fluid">-->
      <!--        <div class="content">-->
      <!--          <h2 class="header">-->
      <!--            {{ item.nickname }}-->
      <!--            <span class="ui green label">{{ item.age }}</span>-->
      <!--          </h2>-->
      <!--          <span class="meta">{{ item.userId }} </span>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </li>-->
      <!--  </template>-->
      <!--</ul>-->
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
.main-container {
  width: 80%;
  height: 700px;
  background-color: white;
  margin: 0 auto; /* 中央に配置するため */
  padding: 20px; /* 内側の余白 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 影をつける */
  border-radius: 8px; /* 角を丸くする */
}

.message-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.message-gardian {
  width: 50%;
  background-color: lightgreen;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 2px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.time {
  font-weight: bold;
  padding: 10px 8px;
  width: 30%;
  height: 100%;
  margin: 0 5px;
  border-radius: 20px;
}

.text {
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: start;
  width: 100%;
  height: 100%;
  padding: 5px;
}

.message-elder {
  width: 30%;
  height: auto;
  background-color: lightgreen;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 2px;
  border-radius: 30px;
  margin-left: auto;
}
.elder-response {
  width: 70%;
  text-align: start;
  font-weight: bold;
}
</style>
