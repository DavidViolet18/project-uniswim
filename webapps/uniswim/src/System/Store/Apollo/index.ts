import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { PluginManager } from '../../PluginManager';

const cache = new InMemoryCache();

const LinkErrors = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const LinkHttp = new HttpLink({
    uri: `${process.env.REACT_APP_USERS_BASEURL}/api/graphql`,
    //credentials: 'same-origin'
});

const LinkState = withClientState({
    cache,
    resolvers: {}
})

const link = ApolloLink.from([
    LinkErrors,
    LinkState,
    LinkHttp
]);

const client = new ApolloClient({
    cache,
    link, 
    connectToDevTools: true,
    defaultOptions: {
        mutate: {
            errorPolicy: "all"
        }
    }
});



export const appendLocalState = (resolvers: any, defaults?: any) => {
    LinkState.concat(ApolloLink.from([
        withClientState({ cache, defaults, resolvers })
    ]));
    client.addResolvers(resolvers);
}
export const getApolloClient = () => client;