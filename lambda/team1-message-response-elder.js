const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "FamilyMessages";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({}),
  };
  
    try {
    const { familycode, sentAt, senderId, messageContent, elderResponse, reservationTime } = JSON.parse(event.body);
    const respondedAt = new Date().toISOString();

    // 既存のメッセージが存在するか確認
    // const getParam = {
    //   TableName,
    //   Key: marshall({ familycode, sentAt }),
    // };
    // const getCommand = new GetItemCommand(getParam);
    // const getResult = await client.send(getCommand);

    // if (!getResult.Item) {
    //   throw new Error("Message does not exist");
    // }

    // メッセージを更新
    const updateParam = {
      TableName,
      Key: marshall({ familycode, sentAt }),
      UpdateExpression: "set elderResponse = :response, respondedAt = :respondedAt, #st = :status",
      ExpressionAttributeValues: marshall({
        ":response": elderResponse,
        ":respondedAt": respondedAt,
        ":status": "回答済み",
      }),
      ExpressionAttributeNames: {
        "#st": "status", // "status"は予約語なので、エイリアスを使う必要があります
      },
      ReturnValues: "ALL_NEW",
      
    };
    const updateCommand = new UpdateItemCommand(updateParam);
    const updateResult = await client.send(updateCommand);

    // 成功時のレスポンス
    response.body = JSON.stringify({
      message: "Message updated successfully",
      updatedItem: unmarshall(updateResult.Attributes),
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
