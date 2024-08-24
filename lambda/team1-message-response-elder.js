const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
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
    const { familycode, sentAt, senderId, messageContent } = JSON.parse(event.body);

    // メッセージが存在するか確認し、取得
    const respondedAt = new Date().toISOString();

    const getParam = {
      TableName,
      Key: marshall({ familycode, sentAt }, { removeUndefinedValues: true }),
    };
    const getCommand = new GetItemCommand(getParam);
    const getResult = await client.send(getCommand);
    
    const param = {
      TableName,
      Item: marshall({
        familycode,// 家族を識別するためのコード
        sentAt,
        senderId, // メッセージを送った保護者のuserId
        messageContent,
        respondedAt, // 高齢者が応答した時間
        status: "回答済み",
      }),
    };
    
    // const messageData = unmarshall(getResult.Item);
    
    //____________更新(status)__________
    
    const putResult = await client.send(new PutItemCommand(param))
    // 必要なフィールドだけを返す

    response.statusCode = 200;
    response.body = JSON.stringify({
      message: "Message leave successfully"});

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
