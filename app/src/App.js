import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import "./App.css";

const POST_SUBSCRIPTION = gql`
  subscription onPostAdded {
    postBroadcast {
      title
    }
  }
`;

const POST_MUTATION = gql`
  mutation CreatePost {
    createPost {
      title
    }
  }
`

export default function App() {
  const [subscriptionData, setSubscriptionData] = useState([]);
  const { error, data, loading } = useSubscription(POST_SUBSCRIPTION, { shouldResubscribe: true, onSubscriptionData: data => {
    setSubscriptionData(subscriptionData.concat(data.subscriptionData.data.postBroadcast.title));
  }});
  const [createPost, mutationData] = useMutation(POST_MUTATION);

  return (
    <div className="App">
      <div>
        <button onClick={() => createPost()}>Generate random message</button>
      </div>
      <span>
        mutation title: {!mutationData.loading && mutationData.data && mutationData.data.createPost.title}
      </span>
      <br />
      <div>
        <div><h2>subscription data</h2></div>
        <ul>
          {subscriptionData.map(data => <li>{data}</li>)}
        </ul>
      </div>
      <h1>Subscriptions demo</h1>
    </div>
  );
}
