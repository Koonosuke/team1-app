const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Guardians";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  try {
    const { userId, password, relation } = JSON.parse(event.body);

    const param = {
      TableName,
      Key: marshall({ userId }), // プライマリキーでアイテムを指定
      UpdateExpression: "SET #p = :p, #r = :r", // 更新する属性を指定
      ExpressionAttributeNames: {
        "#p": "password",
        "#r": "relation"
      },
      ExpressionAttributeValues: marshall({
        ":p": password,
        ":r": relation
      }),
      ReturnValues: "ALL_NEW" // 更新後の新しいアイテムを返す
    };

    const command = new UpdateItemCommand(param);
    const result = await client.send(command);

    response.statusCode = 200;
    response.body = JSON.stringify({
      message: "Profile updated successfully",
      updatedAttributes: result.Attributes
    });
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
