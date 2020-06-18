export default /* GraphQL */ `
  type Query {
    hello: String
  }

  type Mutation {
    createPost: Post
  }

  type Subscription {
    postBroadcast: Post
  }

  type Post {
    # id: ID!
    title: String
    # added: String
    message: String
    # author: User!
  }

  # type User {
  #   id: ID!
  #   name: String
  # }
`;
