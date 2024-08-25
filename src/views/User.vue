<template>
  <div class="user-container">
    <h3 class="ui dividing header">リマインダーの回答</h3>
    <div class="ui segment">
      <ul class="ui comments divided response-list">
        <li v-for="(response, index) in responses" :key="index" class="comment">
          <div class="message-content">
            <p class="text">{{ response.messageContent }}</p>
            <span class="ui green label">{{ response.reservationTime }}</span>
            <p v-if="response.elderResponse" class="responded-at">
              回答日時: {{ response.respondedAt }}
            </p>
          </div>
          <div class="response-status">
        
            <span class="ui label">{{ getElderResponse(response.elderResponse) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  
  import { baseUrl } from "@/assets/config.js";
export default {
  name: 'User',
  data() {
    return {
      responses: [],
    };
  },
  created() {
    this.loadResponses();
  },
  methods: {
    getElderResponse(value) {
      return value ? 'はい' : 'いいえ';
    },
    async updateResponse(response, elderResponse) {
      try {
        const responseData = await fetch(baseUrl + '/message/elder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            familycode: response.familycode,
            sentAt: response.sentAt,
            respondedAt: response.respondedAt,
            elderResponse,
          }),
        });

        const result = await responseData.json();
        if (responseData.ok) {
          this.loadResponses();
        } else {
          console.error('Failed to update response:', result.message);
        }
      } catch (error) {
        console.error('Error updating response:', error);
      }
    },
    loadResponses() {
      const storedResponses = localStorage.getItem('responses');
      this.responses = storedResponses ? JSON.parse(storedResponses) : [];
    }
  }
};
</script>

<style scoped>
.user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.ui.segment {
  width: 100%;
  max-width: 800px;
  padding: 20px;
}

.ui.comments {
  list-style-type: none;
  padding: 0;
  width: 100%;
}
.comment {
  padding: 10px 15px;
  border-radius: 15px;
  margin-bottom: 15px;
  background-color: #f1f1f1;
  position: relative;
  max-width: 80%;
  display: flex;
  justify-content: space-between; 
  align-items: center; 
}

.comment .message-content {
  display: flex;
  flex-direction: column;
}

.comment .text {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.comment .ui.green.label {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 10px;
}

.comment .responded-at {
  font-size: 14px;
  color: #666;
}

.comment .response-status {
  display: flex;
  justify-content: flex-end; 

}

.comment .response-status .ui.label {
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 12px;
  background-color: #ddd;
}

.comment::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 10px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent #f1f1f1 transparent;
}

</style>
