exports.handler = async (event, context) => {//exports.handler: これは AWS Lambda によって呼び出される関数
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",//headers: HTTP レスポンスヘッダーを指定します。この例では、Access-Control-Allow-Origin ヘッダーが * に設定されており、これは全てのオリジンからのクロスオリジンリクエストを許可する設定
    },
    body: JSON.stringify({ message: "" }),
  };
  
  //TODO: 任意の変数にクエリストリングのnameに該当する値を代入してください。
  const name = event.queryStringParameters.name;
  //TODO: responseオブジェクトのbodyプロパティに↑の変数を文字列に変換した上で代入してください。
  response.body = JSON.stringify({name});//{name:name}と同じ意味
  return response;
};
