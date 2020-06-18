import * as AWS from 'aws-sdk';
import { DynamoDBStreamEvent, DynamoDBStreamHandler, DynamoDBRecord } from 'aws-lambda';
import log from 'lambda-log';

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const dynamoUnmarshall = AWS.DynamoDB.Converter.unmarshall;

function removeEventData(body: any) {
  delete body.SequenceNumber;
  delete body.SizeBytes;
  delete body.StreamViewType;

  return body;
}

function toSQSParams(input: any, sqsUrl: string): AWS.SQS.SendMessageRequest {
  return {
    DelaySeconds: 10,
    MessageAttributes: {
      "Id": {
        DataType: "String",
        StringValue: input.id,
      },
      "Title": {
        DataType: "String",
        StringValue: input.title,
      },
      "Message": {
        DataType: "String",
        StringValue: input.message,
      },
    },
    MessageBody: JSON.stringify(input),
    QueueUrl: sqsUrl,
  };
}

const handler: DynamoDBStreamHandler =
  async (event: DynamoDBStreamEvent): Promise<void> => {
    const { SQS_QUEUE_URL } = process.env;

    if (!SQS_QUEUE_URL) {
      log.error('QUEUE_URL invalid or not present.', event);

      return;
    }

    const mappedEventRecords: Array<AWS.SQS.SendMessageRequest> = event.Records.reduce(
      (acc: Array<AWS.SQS.SendMessageRequest>, record: DynamoDBRecord) => {
        if (record.eventName === 'INSERT' && record.dynamodb?.NewImage !== undefined) {
          const parsedRecord = removeEventData(dynamoUnmarshall(record.dynamodb.NewImage));
          acc.push(toSQSParams(parsedRecord, SQS_QUEUE_URL));
        }

        return acc;
      }, []);

    const sqsMessagePromises = mappedEventRecords.map((mappedEvent: AWS.SQS.SendMessageRequest) => {
      return sqs.sendMessage(mappedEvent).promise();
    });

    try {
      log.info('Attempting to post the records to the SQS queue', { queueUrl: SQS_QUEUE_URL });
      // Append the Dynamo records to SQS
      await Promise.all(sqsMessagePromises);
      log.info('Saved items to the SQS queue.');
    } catch (error) {
      log.error(`Could not add the items to the sqs Queue: ${error.message}`);
    }
  };

export { handler };
