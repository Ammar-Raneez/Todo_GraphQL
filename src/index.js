import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: "https://pumped-barnacle-20.hasura.app/v1/graphql",
  cache: new InMemoryCache()
})

//executed as a promise as an http request, does the get request
//getTodos simply returns all the fields of our todos table we created in hasura
// client.query({
//   query: gql `
//     query getTodos {
//         todos {
//           done
//           id
//           text
//         }
//       }
//   `
// })
// .then(data => console.log(data))

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
