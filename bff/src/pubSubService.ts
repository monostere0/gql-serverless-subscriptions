import { PubSub, DynamoDBEventStore } from 'aws-lambda-graphql';

export const PUBSUB_TOPIC = 'NEW_POST';

export default new PubSub({
  eventStore: new DynamoDBEventStore(),
});
