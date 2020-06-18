const AWS = require('aws-sdk');
const faker = require('faker');

AWS.config.update({
  region: 'eu-central-1',
});

const NO_OF_RECORDS = 1;
const TABLE_NAME = 'online-feed-posts';

async function main() {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const usersData = Array.from({ length: NO_OF_RECORDS }).map(x => ({
    id: faker.random.uuid(),
    title: faker.random.words(3),
    message: faker.random.words(10),
  }));

  const writeRequestPromises = usersData.map(user => docClient.put({
    TableName: TABLE_NAME,
    Item: user,
  }).promise()
  );

  try {
    await Promise.all(writeRequestPromises);
    console.log(`Wrote ${NO_OF_RECORDS} records to the ${TABLE_NAME} Dynamo table`);
  } catch (error) {
    console.log('Dynamo write error', error.message);
  }
}

main();
