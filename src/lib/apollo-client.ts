import {
    ApolloClient,
    ApolloLink,
    DefaultOptions,
    from,
    HttpLink,
    InMemoryCache,
    Observable,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import fetch from 'cross-fetch';
import { LENS_API_BASE_URL } from './const';
import { RefreshDocument, RefreshRequest } from './types/generated';
import { getAuthenticatedClient } from './getAuthenticatedClient';

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
};

const httpLink = new HttpLink({
    uri: LENS_API_BASE_URL,
    fetch,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
                    locations
                )}, Path: ${path}`
            )
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});



const authLink = new ApolloLink((operation, forward) => {
    return new Observable(observer => {
        (async () => {
            let client = await getAuthenticatedClient();
            let authentication = client.authentication;
            let token = await authentication.getAccessToken();
            
            operation.setContext({
                headers: {
                    'x-access-token': token.unwrap() ? `Bearer ${token.unwrap()}` : '',
                },
            });

            forward(operation).subscribe({
                next: result => {
                    observer.next(result);
                    observer.complete();
                },
                error: observer.error,
            });
        })();
    });
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});