import {
  Server,
  DynamoDBConnectionManager,
  DynamoDBEventProcessor,
  DynamoDBSubscriptionManager,
  withFilter,
} from 'aws-lambda-graphql';
import pubSubService, { PUBSUB_TOPIC } from './pubSubService';
import schema from './schema';

const resolvers = {
  Query: {
    // eslint-disable-next-line
    hello: () => 'Hello!',
    // // eslint-disable-next-line
    // users: () => { },
  },
  // Mutation: {
  //   // eslint-disable-next-line
  //   createPost: () => { },
  //   // eslint-disable-next-line
  //   createUser: () => { },
  // },
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

const graphqlHttpHandler = serverInstance.createHttpHandler();
const graphqlWebSocketHandler = serverInstance.createWebSocketHandler();
const graphqlDynamoStreamHandler = serverInstance.createHandler();

export {
  graphqlHttpHandler,
  graphqlWebSocketHandler,
  graphqlDynamoStreamHandler,
};
