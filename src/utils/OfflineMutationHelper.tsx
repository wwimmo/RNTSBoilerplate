import AsyncStorage from "@react-native-community/async-storage";
import uuidv4 from "uuid/v4";
import React from "react";
import { Mutation } from "react-apollo";
import stores from "../stores/";

import { apolloClient } from "./storage/ApolloInit";
import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

async function getPendingMutations() {
    const result = await AsyncStorage.getItem(stores.rootStore.commonStore.pendingMutationsPersistKeyPrefix);
    if (result) {
        return JSON.parse(result);
    } else {
        return [];
    }
}

async function setPendingMutations(mutations: any) {
    AsyncStorage.setItem(
        stores.rootStore.commonStore.pendingMutationsPersistKeyPrefix,
        JSON.stringify(mutations),
        async (error) => {
            const pendingMutations = await getPendingMutations();
            stores.rootStore.commonStore.setPendingMutations(pendingMutations);
        }
    );
}

async function addPendingMutation(mutationOptions: any) {
    const id = uuidv4();
    const params = mutationOptions;
    params.optimisticResponse.__optimistic = true;
    const mutation = mutationOptions.mutation;
    const pendingMutations = await getPendingMutations();
    setPendingMutations(pendingMutations.concat({ id, params, mutation }));
}

async function restorePendingMutations(client: ApolloClient<NormalizedCacheObject>) {
    const pendingMutations = await getPendingMutations();
    const promises = pendingMutations.map(async (pendingMutation: any) => {
        const { id, params, mutation } = pendingMutation;
        params.optimisticResponse.__optimistic = true;
        params.update = await proxyUpdateForId(id);
        params.mutation = mutation;
        await apolloClient.mutate(params);
    });
    const result = await Promise.all(promises);
    return result;
}

// Delegate incoming responses to the correct update function
// function updateHandler(resp: any) {
//     // IMPORTANT: You need one of these for every custom update function you use!
//     if (resp.data.updateComment) {
//         return () => {};
//     } else {
//         return () => {};
//     }
// }

// Return a dummy update function scoped to a request with a specific id
async function proxyUpdateForId(id: any) {
    return async (proxy: any, resp: { data: { __optimistic: any } }) => {
        if (resp.data.__optimistic) {
            return;
        }
        const pendingMutations = await getPendingMutations();
        setPendingMutations(pendingMutations.filter((mutation: { id: any }) => mutation.id !== id));
    };
}

// The mutateOffline functionality, Replace client.mutate calls with this
const mutateOffline = async (options: any) => {
    const id = uuidv4();
    const params = options;
    params.optimisticResponse.__optimistic = true;
    const mutation = options.mutation;
    const pendingMutations = await getPendingMutations();
    setPendingMutations(pendingMutations.concat({ id, params, mutation }));
    options.update = await proxyUpdateForId(id);
    const result = await apolloClient.mutate(options);
    return result;
};

// The mutation component wrapper, Replace <Mutation> calls with this
const OfflineMutation = (props: any) => (
    <Mutation {...props}>
        {(mutationFunction: any) =>
            props.children(async (params: any) => {
                const id = uuidv4();
                const { mutation } = props;
                params.optimisticResponse.__optimistic = true;
                const pendingMutations = await getPendingMutations();
                setPendingMutations(pendingMutations.concat({ id, params, mutation }));
                params.update = await proxyUpdateForId(id);
                return mutationFunction(params);
            })
        }
    </Mutation>
);

export default { addPendingMutation, getPendingMutations, restorePendingMutations, mutateOffline, OfflineMutation };
