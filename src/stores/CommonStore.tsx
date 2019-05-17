import { decorate, observable, action } from "mobx";
import { NetInfo, Platform, Dimensions, AppState, AppStateStatus, Keyboard } from "react-native";
import * as RNLanguages from "react-native-localize";

// RN-Windows NetInfo implementation is stale and uses nowadays deprecated apis/namings
const EVENT_NAME = Platform.OS === "windows" ? "change" : "connectionChange";

class CommonStore {
    private hasConnectivityListenerRegistered: boolean = false;
    private hasOrientationListenerRegistered: boolean = false;
    private hasLanguageChangeListenerRegistered: boolean = false;
    private hasAppStateChangeListenerRegistered: boolean = false;
    private hasKeyboardListenerRegistered: boolean = false;

    isLandscapeOrientation: boolean = false;
    isTablet: boolean = false;
    isOnline: boolean = true;
    isSyncing: boolean = true;
    isSearchOpen: boolean = false;
    isKeyboardOpen: boolean = false;
    appState: AppStateStatus = "active";
    hasQueuedRequests: boolean = true;
    windowHeight?: number = 0;
    windowWidth?: number = 0;
    searchQuery?: string = "";

    constructor() {
        this.addConnectivityListener();
        this.addOrientationListener();
    }

    // MobX Actions
    setIsOnline = (isOnline: boolean) => {
        this.isOnline = isOnline;
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

    // Maybe we can change this to a computed later?
    setIsSyncing = (isSyncing: boolean) => {
        this.isSyncing = isSyncing;
    };

    // Maybe we can change this to a computed later?
    setHasQueuedRequests = (hasQueuedRequests: boolean) => {
        this.hasQueuedRequests = hasQueuedRequests;
    };

    setAppState = (newAppState: AppStateStatus) => {
        this.appState = newAppState;
    };

    setIsTablet = (isTablet: boolean) => {
        this.isTablet = isTablet;
    };

    setIsSearchOpen = (isSearchOpen: boolean) => {
        this.isSearchOpen = isSearchOpen;
    };

    setIsKeyboardOpen = (isKeyboardOpen: boolean) => {
        this.isKeyboardOpen = isKeyboardOpen;
    };

    setSearchQuery = (newSearchQuery: string) => {
        this.searchQuery = newSearchQuery;
    };

    // Helper Methods
    addConnectivityListener = async () => {
        if (!this.hasConnectivityListenerRegistered) {
            NetInfo.isConnected.addEventListener(EVENT_NAME, this.setIsOnline);
            this.hasConnectivityListenerRegistered = true;
            Platform.OS === "windows" ? this.setIsOnline(await NetInfo.isConnected.fetch()) : undefined;
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
            if (Platform.OS !== "windows") {
                // The library (and window uwp itself) doesn't support listening to language changes
                RNLanguages!.addEventListener("change", callback);
                this.hasLanguageChangeListenerRegistered = true;
            }
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
            NetInfo.isConnected.removeEventListener(EVENT_NAME, this.setIsOnline);
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
            if (Platform.OS !== "windows") {
                // The library (and window uwp itself) doesn't support listening to language changes
                RNLanguages!.removeEventListener("change", callback);
                this.hasLanguageChangeListenerRegistered = false;
            }
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
}

decorate(CommonStore, {
    isOnline: observable,
    isLandscapeOrientation: observable,
    isSyncing: observable,
    isTablet: observable,
    isSearchOpen: observable,
    isKeyboardOpen: observable,
    hasQueuedRequests: observable,
    appState: observable,
    windowHeight: observable,
    windowWidth: observable,
    searchQuery: observable,
    setIsOnline: action,
    setIsLandscapeOrientation: action,
    setIsSyncing: action,
    setIsTablet: action,
    setIsSearchOpen: action,
    setIsKeyboardOpen: action,
    setHasQueuedRequests: action,
    setWindowDimensions: action,
    setAppState: action,
    setSearchQuery: action
});

export default CommonStore;
