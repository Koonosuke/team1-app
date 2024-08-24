const { DynamoDBClient, PutItemCommand, scanCommad } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall  } = require("@aws-sdk/util-dynamodb");//marshall: JavaScript オブジェクトを DynamoDB が理解できる形式（DynamoDB マップオブジェクト）に変換します。
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Messages";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  const currentTime = new Date().toISOString();

    // スケジュール時間が現在の時間より前のメッセージを取得
    const params = {
        TableName,
        FilterExpression: 'ScheduledTime <= :current_time',
        ExpressionAttributeValues: {
            ':current_time': currentTime
        }
    };

    try {
        const data = await scanCommad(params);

        // メッセージを送信し、DynamoDBから削除
        for (const item of data.Items) {
            await sendMessage(item.Message);
            await deleteMessage(item.MessageID);
        }

        return { statusCode: 200, body: 'Messages processed successfully' };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: 'Error processing messages' };
    }
};

async function sendMessage(messageId) {
  console.log("leave to messeage!")
}

async function deleteMessage(messageId) {
  const params =  {
    TableName,
    key: {
      messageId: messageId, 
    }
  }
  
}

