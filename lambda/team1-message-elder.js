const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "FamilyMessages";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({}),
  };

  try {
    const { familycode, sentAt } = JSON.parse(event.body);

    // メッセージが存在するか確認し、取得
    const getParam = {
      TableName,
      Key: marshall({ familycode, sentAt }),
    };
    
    const getResult = await client.send(new GetItemCommand(getParam));

    if (!getResult.Item) {
      response.statusCode = 404;
      response.body = JSON.stringify({ message: "Message not found" });
      return response;
    }

    const messageData = unmarshall(getResult.Item);
    
    // 必要なフィールドだけを返す
    response.body = JSON.stringify({
      familycode: messageData.familycode,
      sentAt: messageData.sentAt,
      messageContent: messageData.messageContent,
    
    });

    response.statusCode = 200;
    response.body = JSON.stringify({
      message: "Message retrieved successfully",
      data: {
        familycode: messageData.familycode,
        sentAt: messageData.sentAt,
       messageContent: messageData.messageContent,
       
      },
    });

  } catch (e) {
    console.error("Error details:", e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "An unexpected error occurred.",
      errorDetail: e.toString(),
    });
  }

  return response;
};
