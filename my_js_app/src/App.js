import { useState } from "react";
import { ApolloClient, InMemoryCache, useQuery, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

function App() {
  const { data, loading, error } = useQuery(
    gql`
      query App {
        posts {
          id
        }

        authors {
          id
          name

          posts {
            id
            title
          }
        }
      }
    `,
    { client }
  );

  if (loading) return "loading...";
  if (error) return `error: ${error.message}`;

  return (
    <div>
      <p>Posts</p>
      <ul>
        {data?.posts.map((post) => (
          <Post key={post.id} postId={post.id} />
        ))}
      </ul>
      <p>Authors</p>
      <ul>
        {data?.authors.map((author) => (
          <li key={author.id}>
            <i>{author.name}</i>:
            {author.posts.map((post) => (
              <b key={post.id}>{post.title}; </b>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Post({ postId }) {
  const [expanded, expandedSet] = useState(false);

  const { data, loading, error } = useQuery(
    gql`
      query Post($postId: ID!) {
        post(id: $postId) {
          id
          title
          content
          createdAt

          comments {
            id
            content
            createdAt
          }

          author {
            id
            name
          }
        }
      }
    `,
    { client, variables: { postId } }
  );

  if (loading) return "loading...";
  if (error) return `error: ${error.message}`;

  return (
    <li>
      {data?.post.title} by <i>{data?.post.author.name}</i>
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          expandedSet((e) => !e);
        }}
      >
        [{expanded ? "-" : "+"}]
      </a>
      {expanded && (
        <>
          <p>Created At: {data?.post.createdAt}</p>
          <p
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {data?.post.content}
          </p>
          <p>comments:</p>
          {data?.post.comments.map((comment) => (
            <p key={comment.id}>
              {comment.createdAt}: {comment.content}
            </p>
          ))}
        </>
      )}
    </li>
  );
}

export default App;
