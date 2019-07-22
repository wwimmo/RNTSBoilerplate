import { decorate, observable, action, computed } from "mobx";
import { Dimensions, AppState, AppStateStatus, Keyboard } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as RNLanguages from "react-native-localize";
import FSStorage, { DocumentDir } from "redux-persist-fs-storage";
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";

import RootStore from "./RootStore";
import OfflineMutationHelper from "../utils/OfflineMutationHelper";
import { apolloCache, apolloClient } from "../utils/storage/ApolloInit";

class CommonStore {
    private hasConnectivityListenerRegistered: boolean = false;
    private hasOrientationListenerRegistered: boolean = false;
    private hasLanguageChangeListenerRegistered: boolean = false;
    private hasAppStateChangeListenerRegistered: boolean = false;
    private hasKeyboardListenerRegistered: boolean = false;

    pendingMutations: any[] = [];
    isLandscapeOrientation: boolean = false;
    isTablet: boolean = false;
    isOnline: boolean = true;
    isSyncing: boolean = false;
    isKeyboardOpen: boolean = false;
    appState: AppStateStatus = "active";
    windowHeight?: number = 0;
    windowWidth?: number = 0;
    rootStore: RootStore;

    private pendingMutationsPersistKey = "@PendingMutations:";

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.addConnectivityListener();
        this.addOrientationListener();
    }

    // MobX Actions
    setPendingMutations(pendingMutations: any) {
        this.pendingMutations = pendingMutations;
    }

    addPendingMutation(pendingMutation: any) {
        OfflineMutationHelper.addPendingMutation(pendingMutation);
        this.pendingMutations.push(pendingMutation);
    }

    setIsOnline = (isOnline: boolean) => {
        this.isOnline = isOnline;
        // Maybe restorePendingMutations ?
    };

    setIsLandscapeOrientation = () => {
        const { height, width } = Dimensions.get("window");
        this.setWindowDimensions(height, width);
        this.isLandscapeOrientation = width > height ? true : false;
    };

    setWindowDimensions = (height: number, width: number) => {
        this.windowHeight = height;
        this.windowWidth = width;
    };

    setIsSyncing = (isSyncing: boolean) => {
        this.isSyncing = isSyncing;
    };

    setAppState = (newAppState: AppStateStatus) => {
        this.appState = newAppState;
    };

    setIsTablet = (isTablet: boolean) => {
        this.isTablet = isTablet;
    };

    setIsKeyboardOpen = (isKeyboardOpen: boolean) => {
        this.isKeyboardOpen = isKeyboardOpen;
    };

    // Computeds
    get hasQueuedRequests(): boolean {
        return this.pendingMutations.length > 0;
    }

    get pendingMutationsPersistKeyPrefix(): string {
        // if (this.rootStore.authStore.username) {
        //     return `${this.pendingMutationsPersistKey}@${this.rootStore.authStore.username}:`;
        // }
        return `${this.pendingMutationsPersistKey}`;
    }

    // Helper Methods
    addConnectivityListener = async () => {
        if (!this.hasConnectivityListenerRegistered) {
            NetInfo.isConnected.addEventListener("connectionChange", this.setIsOnline);
            this.hasConnectivityListenerRegistered = true;
        }
    };

    addOrientationListener = async () => {
        if (!this.hasOrientationListenerRegistered) {
            Dimensions.addEventListener("change", this.setIsLandscapeOrientation);
            this.hasOrientationListenerRegistered = true;
            this.setIsLandscapeOrientation();
        }
    };

    async addLanguageChangeListener(callback: () => void) {
        if (!this.hasLanguageChangeListenerRegistered) {
            RNLanguages!.addEventListener("change", callback);
            this.hasLanguageChangeListenerRegistered = true;
        }
    }

    addAppStateChangeListener = async (callback: (returnValue: AppStateStatus) => void) => {
        if (!this.hasAppStateChangeListenerRegistered) {
            AppState.addEventListener("change", callback);
            this.hasAppStateChangeListenerRegistered = true;
        }
    };

    addKeyboardListener = async () => {
        if (!this.hasKeyboardListenerRegistered) {
            Keyboard.addListener("keyboardDidShow", this.handleKeyboardDidShow);
            Keyboard.addListener("keyboardDidHide", this.handleKeyboardDidHide);
            this.hasKeyboardListenerRegistered = true;
        }
    };

    removeConnectivityListener = () => {
        if (this.hasConnectivityListenerRegistered) {
            NetInfo.isConnected.removeEventListener("connectionChange", this.setIsOnline);
            this.hasConnectivityListenerRegistered = false;
        }
    };

    removeOrientationListener = () => {
        if (this.hasOrientationListenerRegistered) {
            Dimensions.removeEventListener("change", this.setIsLandscapeOrientation);
            this.hasOrientationListenerRegistered = false;
        }
    };

    removeLanguagesChangeListener(callback: () => void) {
        if (this.hasLanguageChangeListenerRegistered) {
            // The library (and window uwp itself) doesn't support listening to language changes
            RNLanguages!.removeEventListener("change", callback);
            this.hasLanguageChangeListenerRegistered = false;
        }
    }

    removeAppStateChangeListener = (callback: (returnValue: AppStateStatus) => void) => {
        if (this.hasAppStateChangeListenerRegistered) {
            AppState.removeEventListener("change", callback);
            this.hasAppStateChangeListenerRegistered = false;
        }
    };

    removeKeyboardListener = () => {
        if (this.hasKeyboardListenerRegistered) {
            Keyboard.removeListener("keyboardDidShow", this.handleKeyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", this.handleKeyboardDidHide);
            this.hasKeyboardListenerRegistered = false;
        }
    };

    handleKeyboardDidShow = () => {
        this.setIsKeyboardOpen(true);
    };

    handleKeyboardDidHide = () => {
        this.setIsKeyboardOpen(false);
    };

    async persistCacheAndRestoreMutations() {
        await persistCache({
            cache: apolloCache,
            storage: FSStorage(DocumentDir, `myApp`) as PersistentStorage<PersistedData<NormalizedCacheObject>>,
            debug: true
        });
        await this.restorePendingMutations();
    }

    async restorePendingMutations() {
        const pendingMutations = await OfflineMutationHelper.getPendingMutations();
        if (pendingMutations.length > 0) {
            this.setIsSyncing(true);
        }
        await OfflineMutationHelper.restorePendingMutations(apolloClient);
        this.setIsSyncing(false);
    }
}

decorate(CommonStore, {
    pendingMutations: observable,
    isOnline: observable,
    isSyncing: observable,
    isLandscapeOrientation: observable,
    isTablet: observable,
    isKeyboardOpen: observable,
    appState: observable,
    windowHeight: observable,
    windowWidth: observable,
    setPendingMutations: action,
    setIsOnline: action,
    setIsSyncing: action,
    setIsLandscapeOrientation: action,
    setIsTablet: action,
    setIsKeyboardOpen: action,
    setWindowDimensions: action,
    setAppState: action,
    addPendingMutation: action,
    hasQueuedRequests: computed,
    pendingMutationsPersistKeyPrefix: computed
});

export default CommonStore;
