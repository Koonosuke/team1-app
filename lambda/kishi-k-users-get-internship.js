const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "User";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  //TODO: 取得対象のテーブル名をparamに宣言
  const param = {
    TableName,
  };

  const command = new ScanCommand(param);



  try {
    // client.send()で全件取得するコマンドを実行
    const users = (await client.send(command)).Items;

    //TODO: 全ユーザのpasswordを隠蔽する処理を記述
    users?.forEach((item)=> delete item?.password);//users?: この部分はオプショナルチェイニング
    //null や undefined の場合には、forEach 処理をスキップ
    const unmarshalledUsersItems=users.map((item)=> unmarshall(item));
    //map メソッドは、配列内の各要素に対して指定した処理を行い、その結果を新しい配列として返す
    response.body=JSON.stringify({users: unmarshalledUsersItems});
    

    //TODO: レスポンスボディを設定する
    
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
