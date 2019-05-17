import React from "react";
import { AsyncStorage } from "react-native";
import { Mutation } from "react-apollo";

// Pull serialized mutations from AsyncStorage
async function getPendingMutations() {
    const result = await AsyncStorage.getItem("testKey");
    if (result) {
        return JSON.parse(result);
    } else {
        return [];
    }
}

// Store serialized mutations in AsyncStorage
function setPendingMutations(mutations: any) {
    AsyncStorage.setItem("testKey", JSON.stringify(mutations));
}

async function restorePendingMutations(client) {
    const pendingMutations = await getPendingMutations();
    pendingMutations.forEach((pendingMutation) => {
        const { id, params, mutation } = pendingMutation;
        params.optimisticResponse.__optimistic = true;
        params.update = proxyUpdateForId(id);
        params.mutation = mutation;
        client.mutate(params);
    });
}

// Delegate incoming responses to the correct update function
function updateHandler(resp: any) {
    // IMPORTANT: You need one of these for every custom update function you use!
    if (resp.data.updateComment) {
        return myCustomCommentUpdateFunction;
    } else {
        return () => {};
    }
}

// Return a dummy update function scoped to a request with a specific id
async function proxyUpdateForId(id: any) {
    return async (proxy: any, resp: { data: { __optimistic: any } }) => {
        updateHandler(resp)(proxy, resp);
        if (resp.data.__optimistic) {
            return;
        }
        const pendingMutations = await getPendingMutations();
        setPendingMutations(pendingMutations.filter((mutation: { id: any }) => mutation.id !== id));
    };
}

// The main component wrapper
// Replace <Mutation> calls with this
const OfflineMutation = (props) => (
    <Mutation {...props}>
        {(mutationFunction) =>
            props.children(async (params) => {
                const id = Math.random();
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

export default OfflineMutation;

export { restorePendingMutations };
