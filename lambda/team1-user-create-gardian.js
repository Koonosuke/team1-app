const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");//marshall: JavaScript オブジェクトを DynamoDB が理解できる形式（DynamoDB マップオブジェクト）に変換します。
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

  const { userId, password, relation }= JSON.parse(event.body);// JavaScript オブジェクトに変
  
  const length = 2
  const familyCodeArray = Array.from({ length }, () => Math.floor(Math.random() * 100));

// 配列を文字列に変換し、その後整数に変換
  const familyCodeString = familyCodeArray.join(''); // 配列を連結して文字列にする
  const familycode = parseInt(familyCodeString, 10);

  const param = {
    TableName,
     Item:marshall({//marshall 関数を使って、JavaScript オブジェクトを DynamoDB 形式に変換
       userId,
       password,
       relation,
       familycode
     }),
  };
 
  // DBにデータを登録するコマンドを用意
  const command = new PutItemCommand(param);//PutItemCommand: DynamoDB テーブルにアイテムを追加するコマンドを作成します。param オブジェクトには、テーブル名と挿入するアイテムの情報が含まれru

  try {
    // client.send()でDBにデータを登録するコマンドを実行
    await client.send(command);
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    response.statusCode=201;
    response.body=JSON.stringify({userId, password, relation, familycode});
    
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
