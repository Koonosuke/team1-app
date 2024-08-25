<template>
  <div class="user-container">
    <h3 class="ui dividing header">リマインダーの回答</h3>
    <div class="ui segment">
      <ul class="ui comments divided response-list">
        <li v-for="(response, index) in responses" :key="index" class="comment">
          <div class="message-content">
            <p class="text">{{ response.messageContent }}</p>
            <span class="ui green label">{{ response.reservationTime }}</span>
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
export default {
  name: 'User',
  data() {
    return {
      responses: [],
    };
  },
  created() {
    const storedResponses = localStorage.getItem('responses');
    this.responses = storedResponses ? JSON.parse(storedResponses) : [];
  },
  methods: {
    getElderResponse(value) {
      return value ? 'はい' : 'いいえ';
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
  justify-content: space-between; /* Ensure the content is spread out */
  align-items: center; /* Center content vertically */
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

.comment .response-status {
  display: flex;
  justify-content: flex-end; /* Aligns the status label to the right */
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
