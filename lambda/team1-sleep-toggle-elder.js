const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Elder";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // const userId = event.queryStringParameters?.userId;
  const { userId, sleep } = JSON.parse(event.body);

  if (!userId) {
    response.statusCode = 400;
    response.body = JSON.stringify({ message: "userIdが提供されていません。" });
    return response;
  }

  if (!sleep) {
    response.statusCode = 400;
    response.body = JSON.stringify({ message: "更新するsleepの値が提供されていません。" });
    return response;
  }

  const params = {
    TableName,
    Key: marshall({ userId }),
    UpdateExpression: "SET #S = :sleep",
    ExpressionAttributeNames: {
      "#S": "sleep",
    },
    ExpressionAttributeValues: marshall({
      ":sleep": sleep,
    }),
    ReturnValues: "UPDATED_NEW",  // 更新された値を返す
  };

  try {
    const result = await client.send(new UpdateItemCommand(params));
    const sleep = unmarshall(result.Attributes).sleep;
    response.body = JSON.stringify({ userId, sleep });
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
