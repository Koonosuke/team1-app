exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    
  };
response.body=JSON.stringify({message: "Hello!!"});

  // レスポンスを返す
  return response;
};
