const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "FamilyMessages";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  try {
    const { familyId, messageId } = event.queryStringParameters;

    if (!familyId || !messageId) {
      response.statusCode = 400;
      response.body = JSON.stringify({ message: "Family ID and Message ID are required" });
      return response;
    }

    const getParam = {
      TableName,
      Key: marshall({ familyId, messageId }),
    };
    
    const getResult = await client.send(new GetItemCommand(getParam));

    if (!getResult.Item) {
      response.statusCode = 404;
      response.body = JSON.stringify({ message: "Message not found" });
      return response;
    }

    const message = unmarshall(getResult.Item);

    response.statusCode = 200;
    response.body = JSON.stringify({
      messageContent: message.messageContent,
      elderResponse: message.elderResponse,
      status: message.status,
      sentAt: message.sentAt,
      respondedAt: message.respondedAt,
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
