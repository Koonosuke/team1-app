const { DynamoDBClient, PutItemCommand, GetItemCommand  } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall  } = require("@aws-sdk/util-dynamodb");//marshall: JavaScript オブジェクトを DynamoDB が理解できる形式（DynamoDB マップオブジェクト）に変換します。
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const GuardiansTable = "Guardians";
const TableName = "Elder";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  try {
    // 高齢者の情報をリクエストボディから取得
    const { nickname, userId, familycode } = JSON.parse(event.body);

    // DynamoDBから保護者情報を取得して、randomNumberが一致するか確認
    const getParam = {
      TableName: GuardiansTable,
      Key: marshall({ userId }, { removeUndefinedValues: true }),
    };
    const getCommand = new GetItemCommand(getParam);
    const getResult = await client.send(getCommand);

    if (!getResult.Item) {
      response.statusCode = 400;
      response.body = JSON.stringify({ message: "Invalid userId or keyword." });
      return response;
    }

    const guardian = unmarshall(getResult.Item);

    // 保護者のrandomNumberと入力されたrandomNumberが一致するか確認
    if (guardian.familycode.toString() !== familycode.toString()) {
      response.statusCode = 400;
      response.body = JSON.stringify({ message: "Invalid randomNumber." });
      return response;
    }

    // 高齢者の情報をDynamoDBに登録
    const elderParam = {
      TableName,
      Item: marshall({
        userId,
        nickname,
        familycode,
        sleep: false
      }, { removeUndefinedValues: true }),
    };
    const elderCommand = new PutItemCommand(elderParam);
    await client.send(elderCommand);

    // 成功時のレスポンス設定
    response.statusCode = 201;
    response.body = JSON.stringify({ userId, familycode});

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