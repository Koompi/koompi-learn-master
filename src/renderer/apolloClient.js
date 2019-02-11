
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';

import secureStorage from './secureStorage';
import fragmentMatcher from './fragmentMatcher';

const uri =
  process.env.NODE_ENV !== 'production' ?
    'http://104.196.207.91/graphql' : 'http://104.196.207.91/graphql';

const httpLink = new HttpLink({
  uri,
});

const authLink = setContext((_, { headers }) => {
  let authorization = '';

  try {
    const token = secureStorage.get('x-token');

    authorization = `Bearer ${token}`;
  } catch (error) {
    secureStorage.remove('x-token');
  }

  return {
    headers: { ...headers, authorization },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),

  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher(fragmentMatcher),
  }),

  connectToDevTools: process.env.NODE_ENV !== 'production',
});

export default apolloClient;
