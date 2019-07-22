import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { RetryLink } from "apollo-link-retry";
import { onError } from "apollo-link-error";
import { ApolloLink, from } from "apollo-link";

// Insert accessToken to requests
// const authMiddlewareLink = new ApolloLink((operation, forward) => {
//     operation.setContext({
//         headers: {
//             authorization: `${stores.rootStore.authStore.tokenType} ${stores.rootStore.authStore.accessToken}`
//         }
//     });
//     return forward(operation);
// });

const retryLink = new RetryLink({ attempts: { max: Infinity } });
const httpLink = ApolloLink.from([
    onError(({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                // switch (err.extensions.code) {
                //     case "invalid-jwt":
                //     case "invalid-headers":
                //         if (stores.rootStore.authStore.username) {
                //             return new Observable((observer) => {
                //                 stores.rootStore.authStore
                //                     .executeAuthorize()
                //                     .then((success) => {
                //                         if (success && stores.rootStore.authStore.accessToken) {
                //                             operation.setContext(({ headers = {} }) => ({
                //                                 headers: {
                //                                     ...headers,
                //                                     authorization: `${stores.rootStore.authStore.tokenType} ${
                //                                         stores.rootStore.authStore.accessToken
                //                                     }`
                //                                 }
                //                             }));
                //                         } else {
                //                             NavigationService.navigateToLogout();
                //                         }
                //                     })
                //                     .then(() => {
                //                         const subscriber = {
                //                             next: observer.next.bind(observer),
                //                             error: observer.error.bind(observer),
                //                             complete: observer.complete.bind(observer)
                //                         };
                //                         forward(operation).subscribe(subscriber);
                //                     })
                //                     .catch((error) => {
                //                         observer.error(error);
                //                     });
                //             });
                //         } else {
                //             NavigationService.navigateToLogout();
                //         }
                // }
                console.log(`[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`);
            }
        }
        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
        }
    }),
    new HttpLink({
        uri: "yourGraphqlEndpoint",
        credentials: "include"
    })
]);

// const apolloLink = from([authMiddlewareLink, retryLink, httpLink]);
const apolloLink = from([retryLink, httpLink]);

// If results id is not called id or _id it won't detect automatically, set it to the correct one, may need multiple entries
// const apolloCache = new InMemoryCache({
//     dataIdFromObject: (object) => {
//         switch (object.__typename) {
//             default:
//                 if (object.id) {
//                     return `${object.__typename}:${object.id}`;
//                 } else {
//                     return defaultDataIdFromObject(object);
//                 }
//         }
//     },
//     freezeResults: true
// });

const apolloCache = new InMemoryCache();

const apolloClient = new ApolloClient({
    link: apolloLink,
    cache: apolloCache,
    assumeImmutableResults: true
});

export { apolloCache, apolloClient };
