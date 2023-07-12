const aws = require('aws-sdk');
const { randomUUID } = require('crypto');

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

const createUsers = async (event, context) => {
  const id = randomUUID();

  let userBody = JSON.parse(event.body);

  //  assign the id to the user body object to be saved in the database

  userBody.pk = id;

  var params = {
    TableName: 'usersTable',
    Item: userBody,
  };

  console.log(params.Item);

  return dynamodb
    .put(params)
    .promise()
    .then((res) => {
      console.log(res);
      return {
        statusCode: 200,
        body: JSON.stringify({ user: params.Item }),
      };
    });
};

module.exports = {
  createUsers,
};
