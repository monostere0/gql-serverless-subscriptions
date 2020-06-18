import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { ApolloProvider } from "@apollo/react-hooks";
import App from "./App";

const subClient = new SubscriptionClient(
  "wss://ja5pp580nk.execute-api.eu-central-1.amazonaws.com/dev",
  { reconnect: true },
  null,
  []
);

subClient.onConnected(() => console.log("Subscriptions websocket connection established"));

const link = new WebSocketLink(subClient);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
