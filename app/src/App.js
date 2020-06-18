import React from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import "./App.css";

const POST_SUB = gql`
  subscription onPostAdded {
    postBroadcast {
      id
    }
  }
`;

export default function App() {
  const { error, data, loading } = useSubscription(POST_SUB, {
    shouldResubscribe: true,
    onSubscriptionData: data => console.log(data)
  });

  console.log(error, data, loading);

  return (
    <div className="App">
      <span>
        {error} {data} {loading}
      </span>
      <h1>Subscriptions demo</h1>
    </div>
  );
}
