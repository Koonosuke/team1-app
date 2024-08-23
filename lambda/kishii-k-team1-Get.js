const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "Article";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する
  
  // TODO: paramに更新対象のテーブル名と更新内容を記述
  const param = {
    TableName,
  };

  const command = new ScanCommand(param);

  try {
    await client.send(command);
    // TODO: 更新に成功した場合の処理を記述(response bodyを設定する)
    const articles = (await client.send(command)).Items;

    //TODO: 全ユーザのpasswordを隠蔽する処理を記述

    //TODO: レスポンスボディを設定する
    const unmarshalledArticles = articles.map((item) => unmarshall(item));
    response.body = JSON.stringify({users: unmarshalledArticles});
    
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
