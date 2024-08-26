<template>
  <div class="container" >
    <div class="ui main container">
      <button class="time-block ui green button">
        <h3>現在の時刻</h3>
        <p>{{ currentTime }}</p>
      </button>
      <div class="button-group">
        <button class="ui green button" @click="toggleSleep(false)">起きる</button>
        <button class="ui blue button" @click="toggleSleep(true)">寝る</button>
      </div>
    </div>

    <!-- リマインダー一覧 -->
    <h3 class="ui dividing header">リマインダー</h3>
    <div class="ui segment">
      <ul class="ui comments divided article-list">
        <template v-for="(message, index) in messages" :key="index">
          <li class="comment">
            <div class="message-guardian">
              <div class="content-container">
                <span class="author">{{ message.userId }}</span>
                <p class="text">{{ message.messageContent }}</p>
                <span v-if="message.messageContent" class="ui green label reservationTime">{{ message.reservationTime }}</span>
              </div>
              <div class="button-container">
                <button class="ui button yes-button"  @click="handleResponse(message, true)">はい</button>
                <button class="ui button no-button" @click="handleResponse(message, false)">いいえ</button>
              </div>
              <div class="ui divider"></div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
  
</template>

<script>
import { baseUrl } from "@/assets/config.js";

export default {
  name: 'Template',

  data() {
    return {
      sleep: false,
      userId: null,
      elderResponse: null,
      familycode: null,
      messages: [],
      currentTime: "",
      errorMsg: "",  
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

  mounted() {
    this.updateTime();
 
      this.getMessages();
    
  },

  beforeDestroy() {
    clearInterval(this.messagesInterval); // コンポーネントが破棄される際にタイマーをクリア
  },

  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString('ja-JP'); 
    },

    async getMessages() {
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
        this.errorMsg = `記事一覧取得時にエラーが発生しました: ${e}`;
      }
    },
    
async handleResponse(message, value) {
    const { familycode, sentAt, senderId, messageContent, reservationTime } = message;
    const reqbody = {
        familycode: this.familycode,
        sentAt,
        senderId,
        messageContent,
        elderResponse: value,
        reservationTime,
    };
  
    try {
        const res = await fetch(baseUrl + `/message/elder`, {
            method: "PUT",
            body: JSON.stringify(reqbody),
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {};
  
        if (!res.ok) {
            const errorMessage = await res.text();
            console.error(`Error: ${res.status} - ${errorMessage}`);
            throw new Error(errorMessage);
        }
        

    
        let responses = JSON.parse(localStorage.getItem('responses')) || [];
        responses.push(jsonData.updatedItem);
        localStorage.setItem('responses', JSON.stringify(responses));
       
       console.log(jsonData.updatedItem)

    } catch (error) {
        console.error("Error in handleResponse:", error);
    }
},

  async toggleSleep( status ) {
      const reqbody = {
        userId: this.userId,
        sleep: status ? "寝た" : "起きた",
      };

      try {
        const res = await fetch(baseUrl + `/user/elder/sleeptoggle`, {
          method: "PUT",
          body: JSON.stringify(reqbody),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage);
        }
      
        
        console.log("Update successful!");
      } catch (error) {
        console.error("Error:", error);
      }
    },

    convertToLocaleString(timestamp) {
      return new Date(timestamp).toLocaleString('ja-JP');
    },
  },
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-block {
  background-color: lightgreen;
  width:  350px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time-block h3 {
  font-size: 35px; 
}
.time-block p {
  font-size: 70px; 
  font-weight: bold;
  color: #333;
}
.ui.green.label {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 40px;
  font-size: 50px!important; 
  font-weight: bold;
  display: inline-block;
  margin: 5px 0;
  text-align: center;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.ui.green.button {
  background-color: #4caf50;
  color: white;
  font-size: 25px;
}



.ui.blue.button {
  background-color: #2196f3;
  color: white;
  font-size: 25px;
}

.ui.green.button:hover {
  background-color: #388e3c;
}

.ui.blue.button:hover {
  background-color: #1976d2;
}

.ui.segment {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ui.comments {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.comment {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%;
}

.message-guardian {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.text {
  font-size: 60px !important; 
  color: #333 !important;
}

.ui.green.label {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  margin: 5px 0;
  text-align: center;
}

.button-container {
  display: flex;
  gap: 20px;
}

.yes-button {
  background-color: #4caf50;
  color: white;
  font-size: 25px;
   padding: 25px 40px; 
}

.yes-button:hover {
  background-color: #388e3c;
}

.no-button {
  background-color: #f44336;
  color: white;
  font-size: 25px;
   padding: 25px 40px; 
}

.no-button:hover {
  background-color: #d32f2f;
}


</style>



