
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
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


// if (event.headers.authorization !== "mtiToken") {
//     response.statusCode = 401;
//     response.body = JSON.stringify({
//       message: "認証されていません。HeaderにTokenを指定してください",
//     });

//     return response;
//   }

  // const body = event.body ? JSON.parse(event.body) : null;
   const userId = event.queryStringParameters.userId; 
   const password = event.queryStringParameters.password; 
   
  if (!userId || !password) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }
  // if (!body || !body.userId || !body.password) {
  //   response.statusCode = 400;
  //   response.body = JSON.stringify({
  //     message:
  //       "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
  //   });

  //   return response;
  // }

  // const param = {
  //   TableName,
  //   //キー、インデックスによる検索の定義
  //   KeyConditionExpression: "userId = :uid",
  //   //プライマリーキー以外の属性でのフィルタ
  //   FilterExpression: "password = :pkey",
  //   //検索値のプレースホルダの定義
  //   ExpressionAttributeValues: marshall({
  //     ":uid": body.userId,
  //     ":pkey": body.password,
  //   }),
  // };
  
  const params = {
    TableName,
    Key: marshall({
      userId: userId,
    }),
  };

  
  
  const command = new GetItemCommand(params)
  try {
    const result = (await client.send(command));
    const loginUser = result.Item
    const unmarshallLoginUser = unmarshall(loginUser);
    const { userId, familycode } = unmarshallLoginUser
    response.body = JSON.stringify({ userId, familycode})
    
  } catch (e) {
    if (e.message == "userIdまたはpasswordが一致しません") {
      response.statusCode = 401;
      response.body = JSON.stringify({ message: e.message });
    } else {
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "予期せぬエラーが発生しました。",
        errorDetail: e.toString(),
      });
    }
  }

  
  

  // const command = new QueryCommand(param);
  // try {
  //   const foundCount = (await client.send(command)).Count;
    
  //   if (foundCount == 0) {
  //     throw new Error("userIdまたはpasswordが一致しません");
  //   }
    
  //   response.body = JSON.stringify({ message: "success to login!!" });
  // } catch (e) {
  //   if (e.message == "userIdまたはpasswordが一致しません") {
  //     response.statusCode = 401;
  //     response.body = JSON.stringify({ message: e.message });
  //   } else {
  //     response.statusCode = 500;
  //     response.body = JSON.stringify({
  //       message: "予期せぬエラーが発生しました。",
  //       errorDetail: e.toString(),
  //     });
  //   }
  // }

  return response;
};
