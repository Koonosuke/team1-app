
// /user/gardianでメッセージと時間をFamilyMessagesテーブルに格納
//POST


const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "FamilyMessages";
const GuardiansTable = "Guardians";
const ElderTable = "Elder";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  try {
    const { familycode, userId, messageContent } = JSON.parse(event.body);
 // 一意のメッセージIDを生成
    const sentAt = new Date().toISOString(); // 送信時刻をISO形式で記録
    
    // const { nickname, userId, familycode } = JSON.parse(event.body);

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

    const param = {
      TableName,
      Item: marshall({
        familycode, // 家族を識別するためのコード
        senderId: userId, // メッセージを送った保護者のuserId
        messageContent,
        sentAt,
        respondedAt: null, // 高齢者が応答した時間
        status: "未回答",
      }),
    };

    await client.send(new PutItemCommand(param));

    response.statusCode = 201;
    response.body = JSON.stringify({ message: "Message sent successfully" });

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
