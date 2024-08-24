const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "User";

exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const userId = event.queryStringParameters.userId; //見たいユーザのuserId

  //TODO: 取得対象のテーブル名と検索に使うキーをparamに宣言
  const param = {
    TableName,
    Key:marshall({//Key: DynamoDB で検索するためのプライマリキーを指定します。ここでは userId をキー
      userId,
    }),
  };
  
  // 指定したアイテムを取得するコマンドを用意
  const command = new GetItemCommand(param);


  try {
    //client.send()の実行でDBからデータを取得
    const user = (await client.send(command)).Item;

    //TODO: 条件に該当するデータがあればパスワードを隠蔽をする処理を記述
    delete user?.password;

    //TODO: レスポンスボディに取得したUserの情報を設定する
    response.body=JSON.stringify(unmarshall(user));
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

//➀Dynamodbにこれが格納されている
//   {
//   "userId": "12345",
//   "age": 30,
//   "nickname": "JohnDoe",
//   "password": "secret"
// }

//➁GetItemCommandで呼び出すと
// {
//   "Item": {
//     "userId": { "S": "12345" },
//     "age": { "N": "30" },
//     "nickname": { "S": "JohnDoe" },
//     "password": { "S": "secret" }
//   }
// }


//➂const user = (await client.send(command)).Item;で
// {
//   "userId": { "S": "12345" },
//   "age": { "N": "30" },
//   "nickname": { "S": "JohnDoe" },
//   "password": { "S": "secret" }
// }

//➃(unmarshall(user))で
// //{
//   "userId": "12345",
//   "age": 30,
//   "nickname": "JohnDoe",
//   "password": "secret"
// }


