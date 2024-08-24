const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
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
    const { familycode } = event.queryStringParameters;

    // Query を使用して、familycode に基づくすべてのメッセージを取得
    const queryParams = {
      TableName,
      KeyConditionExpression: "familycode = :fc",
      ExpressionAttributeValues: {
        ":fc": { S: familycode },
      },
    };
    
    const queryResult = await client.send(new QueryCommand(queryParams));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      response.statusCode = 404;
      response.body = JSON.stringify({ message: "Messages not found" });
      return response;
    }

    // 取得したアイテムをすべてアンマーシャリングし、リストとして返す
    const messages = queryResult.Items.map((item) => unmarshall(item));

    response.statusCode = 200;
    response.body = JSON.stringify({
      message: "Messages retrieved successfully",
      data: messages,
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
