export default /* GraphQL */ `
  type Query {
    hello: String
  }

  # type Mutation {
  #   createPost(userId: ID!, title: String, message: String): Post
  #   createUser(name: String): User
  # }

  type Subscription {
    postBroadcast: Post
  }

  type Post {
    id: ID!
    # title: String
    # added: String
    # message: String
    # author: User!
  }

  # type User {
  #   id: ID!
  #   name: String
  # }
`;
