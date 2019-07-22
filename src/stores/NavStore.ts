import { decorate, observable, action, computed } from "mobx";
import NavigationService from "../utils/NavigationService";
import RouteNames from "../navigation/RouteNames";
import Constants from "../utils/Constants";
import AsyncStorageWrapper from "../utils/storage/AsyncStorageWrapper";
import RootStore from "./RootStore";

class NavStore {
    navState: any;
    navigator: any;
    shouldResumeAtNavState: boolean = false;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    // Hydration/Rehydration
    async rehydrate() {
        try {
            // Nav State
            const shouldResumeAtNavState = await this.rehydrateShouldResumeAtNavState();
            const navigationState = await this.rehydrateNavigationState();
            this.setShouldResumeAtNavState(shouldResumeAtNavState ? shouldResumeAtNavState : false, false);
            this.setNavState(navigationState, false);

            // Navigate if needed
            const doesRouteNameExist = Object.values(RouteNames).includes(this.activeRouteName);
            if (this.shouldResumeAtNavState && doesRouteNameExist) {
                NavigationService.navigate(this.activeRouteName);
            }
        } catch (error) {
            console.log(Constants.NavStore.LOG_REHYDRATE_FAILED, error);
        }
    }

    private hydrateNavigationState() {
        AsyncStorageWrapper.setItem(this.persistKeyPrefix + Constants.NavStore.PERSISTKEY_NAVSTATE, this.navState);
    }

    private async rehydrateNavigationState() {
        return AsyncStorageWrapper.getItem(this.persistKeyPrefix + Constants.NavStore.PERSISTKEY_NAVSTATE);
    }

    private hydrateShouldResumeAtNavState() {
        AsyncStorageWrapper.setItem(
            this.persistKeyPrefix + Constants.NavStore.PERSISTKEY_RESUME,
            this.shouldResumeAtNavState
        );
    }

    private async rehydrateShouldResumeAtNavState() {
        return AsyncStorageWrapper.getItem(this.persistKeyPrefix + Constants.NavStore.PERSISTKEY_RESUME);
    }

    // MobX Actions
    setNavState(navState: any, shouldPersist: boolean) {
        this.navState = navState;
        if (shouldPersist) {
            this.hydrateNavigationState();
        }
    }

    setNavigator(navigator: any) {
        this.navigator = navigator;
    }

    setShouldResumeAtNavState(shouldResumeAtNavState: boolean, shouldPersist: boolean) {
        this.shouldResumeAtNavState = shouldResumeAtNavState;
        if (shouldPersist) {
            this.hydrateShouldResumeAtNavState();
        }
    }

    // MobX Computeds
    get activeRouteName(): string {
        return this.getActiveRouteName(this.navState);
    }

    get persistKeyPrefix(): string {
        return `${Constants.NavStore.PERSISTKEY_PREFIX}`;
    }

    // NavState change handler
    onNavigationStateChange(currentState: any) {
        if (
            this.getActiveRouteName(currentState) !== RouteNames.START &&
            this.getActiveRouteName(currentState) !== this.getActiveRouteName(this.navState)
        ) {
            this.setNavState(currentState, true);
        }
    }

    // Internal (helper methods)
    getActiveRouteName(navigationState: any): any {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        if (route.routes) {
            // dive into nested navigators
            return this.getActiveRouteName(route);
        }
        return route.routeName;
    }
}

decorate(NavStore, {
    navState: observable,
    shouldResumeAtNavState: observable,
    setNavState: action,
    setShouldResumeAtNavState: action,
    activeRouteName: computed
});

export default NavStore;
