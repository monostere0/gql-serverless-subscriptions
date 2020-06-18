import {
  Server,
  DynamoDBConnectionManager,
  DynamoDBEventProcessor,
  DynamoDBSubscriptionManager,
  withFilter,
} from 'aws-lambda-graphql';
import pubSubService, { PUBSUB_TOPIC } from './pubSubService';
import schema from './schema';
import faker from 'faker';

const resolvers = {
  Query: {
    // eslint-disable-next-line
    hello: () => 'Hello!',
  },
  Mutation: {
    // eslint-disable-next-line
    async createPost(rootValue: any, args: any) {
      const payload = {
        title: faker.random.words(3),
        message: faker.random.words(10),
      };

      await pubSubService.publish(PUBSUB_TOPIC, payload);

      return payload;
    },
  },
  Subscription: {
    postBroadcast: {
      resolve: (rootValue: Record<string, unknown>) => {
        console.log('Got new item', rootValue);

        return rootValue;
      },
      subscribe: withFilter(
        pubSubService.subscribe(PUBSUB_TOPIC),
        () => true
      ),
    },
  },
};

const subscriptionManager = new DynamoDBSubscriptionManager();
const eventProcessor = new DynamoDBEventProcessor();
const connectionManager = new DynamoDBConnectionManager({ subscriptions: subscriptionManager });

const serverInstance = new Server({
  typeDefs: schema,
  resolvers,
  // context: ({ event, context }) => ({
  //   headers: event.headers,
  //   functionName: context.functionName,
  //   event,
  //   context,
  // }),
  debug: process.env.STAGE === 'dev',
  playground: true,
  introspection: true,
  connectionManager,
  eventProcessor,
  subscriptionManager,
});

const graphqlHttpHandler = serverInstance.createHttpHandler({ cors: { origin: '*', credentials: true } });
const graphqlWebSocketHandler = serverInstance.createWebSocketHandler();
const graphqlDynamoStreamHandler = serverInstance.createHandler({ cors: { origin: '*', credentials: true } });

export {
  graphqlHttpHandler,
  graphqlWebSocketHandler,
  graphqlDynamoStreamHandler,
};
