const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall  } = require("@aws-sdk/util-dynamodb");//marshall: JavaScript オブジェクトを DynamoDB が理解できる形式（DynamoDB マップオブジェクト）に変換します。
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Elder";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  const { userId, sleep } = JSON.parse(event.body);

  const param = {
    TableName,
    Item: marshall({
      userId,
      sleep
    }),
  };

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.body = JSON.stringify({ userId, sleep});
    
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};