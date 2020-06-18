import React from "react";
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
  const { error, data, loading } = useSubscription(POST_SUBSCRIPTION, { shouldResubscribe: true });
  const [createPost, mutationData] = useMutation(POST_MUTATION);

  console.log(mutationData);
  console.log('subscription called', data);

  return (
    <div className="App">
      <div>
        <button onClick={() => createPost()}>Generate random message</button>
      </div>
      <span>
        mutation result: {!mutationData.loading && mutationData.data && mutationData.data.createPost.title}
      </span>
      <br />
      <span>
        subscription result: {!loading && data && data.title}
      </span>
      <h1>Subscriptions demo</h1>
    </div>
  );
}
