const aws = require('aws-sdk');

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8001',
    credentials: {
      accessKeyId: 'MockAccessKeyId',
      secretAccessKey: 'MockSecretAccessKey',
    },
  };
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const updateUsers = async (event, context) => {
  let userId = event.pathParameters.id;

  const body = JSON.parse(event.body);

  var params = {
    TableName: 'usersTable',
    Key: { pk: userId },
    UpdateExpression: 'set #name = :name, #age = :age',
    ExpressionAttributeNames: { '#name': 'name', '#age': 'age' },
    ExpressionAttributeValues: { ':name': body.name, ':age': body.age },
    ReturnValues: 'ALL_NEW',
  };

  return dynamodb
    .update(params)
    .promise()
    .then((res) => {
      console.log(res);
      return {
        statusCode: 200,
        body: JSON.stringify({ user: res.Attributes }),
      };
    });
};

module.exports = {
  updateUsers,
};
