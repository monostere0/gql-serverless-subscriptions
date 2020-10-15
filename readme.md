# Graphql Subscriptions with Serverless

This aims to solve the problem with having subscriptions enabled in GraphQL and serverless. As you are aware, the lambdas are short-lived, which means that a socket connection with it cannot be maintained. This shows how aws-lambda-graphql circumvents this issue by using Dynamo to maintain the WS connections.

# Usage

First, make sure to npm install all the deps in both app and bff.

1. Deploy the BFF stack using serverless
2. Copy over the SLS output urls for HTTP and WS to app/src/index.js (lines 14 & 21)
3. Run the client app locally (created with CRA)
4. Run bff/dynamo-seed.js
5. Your client app will be notified about new data, through WS GQL subscriptions.
