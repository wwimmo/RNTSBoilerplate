import React, { Component } from "react";
import { StyleSheet, View, AppStateStatus } from "react-native";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import { Provider as PaperProvider } from "react-native-paper";
import { withNamespaces } from "react-i18next";
import * as RNLanguages from "react-native-localize";
import DeviceInfo from "react-native-device-info";
import { persistCache } from "apollo-cache-persist";
import { ApolloProvider } from "react-apollo";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { PersistentStorage, PersistedData } from "apollo-cache-persist/types";
import FSStorage, { DocumentDir } from "redux-persist-fs-storage";

// Our imports
import stores from "./stores";
import i18n, { supportedLanguages } from "./lang/i18n";
import { apolloCache, apolloClient } from "./utils/storage/ApolloInit";
import NavigationService from "./utils/NavigationService";
import { restorePendingMutations } from "./components/apollo/OfflineMutation";
import AppContainer from "./navigation/NavigationConfiguration";
import { Theme } from "./styles/theme";

// Enforce Observable changes over MobxActions
configure({ enforceActions: "always" });

const i18nWrappedNavigator = ({ t }: { t: any }) => {
    return (
        <AppContainer
            screenProps={{ t }}
            ref={(navigatorRef: any) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
                stores.navStore.setNavigator(navigatorRef);
            }}
            onNavigationStateChange={onNavStateChanged}
        />
    );
};

const onNavStateChanged = (prevState: any, currentState: any) => {
    stores.navStore.onNavigationStateChange(currentState);
};

// When we call i18n.changeLanguage(...) the App should automatically reload in the language we changed to
const ReloadAppOnLanguageChangeWrappedI18nNavigator = withNamespaces("i18n", {
    wait: true,
    bindI18n: "languageChanged",
    bindStore: "false"
})(i18nWrappedNavigator);

interface Props {}
class App extends Component<Props> {
    componentDidMount() {
        stores.commonStore.setIsTablet(DeviceInfo.isTablet());
        stores.commonStore.addConnectivityListener();
        stores.commonStore.addOrientationListener();
        stores.commonStore.addKeyboardListener();
        stores.commonStore.addLanguageChangeListener(this.onLanguagesChanged);
        stores.commonStore.addAppStateChangeListener(this.onAppStateChanged);
        this.resumeAfterLanguageChangeIfPossible();
    }

    componentWillUnmount() {
        stores.commonStore.removeConnectivityListener();
        stores.commonStore.removeOrientationListener();
        stores.commonStore.removeKeyboardListener();
        stores.commonStore.removeLanguagesChangeListener(this.onLanguagesChanged);
        stores.commonStore.removeAppStateChangeListener(this.onAppStateChanged);
    }

    onLanguagesChanged = () => {
        const fallback = { languageTag: "de", isRTL: false };
        const { languageTag } = RNLanguages!.findBestAvailableLanguage(Object.keys(supportedLanguages)) || fallback;
        i18n.changeLanguage(languageTag);
    };

    onAppStateChanged = async (newAppState: AppStateStatus) => {
        if (stores.commonStore.appState.match(/inactive|background/) && newAppState === "active") {
            await persistCache({
                cache: apolloCache,
                storage: FSStorage(DocumentDir, `myApp`) as PersistentStorage<PersistedData<NormalizedCacheObject>>,
                debug: true
            });
            restorePendingMutations(apolloClient);
        } else if (stores.commonStore.appState === "active" && newAppState.match(/inactive|background/)) {
        }
        stores.commonStore.setAppState(newAppState);
    };

    resumeAfterLanguageChangeIfPossible = async () => {
        await stores.navStore.rehydrate();
        if (!stores.navStore.shouldResumeAtNavState) {
            NavigationService.navigateToStart();
        }
    };

    render() {
        return (
            <ApolloProvider client={apolloClient}>
                <PaperProvider theme={Theme}>
                    <Provider {...stores}>
                        <View style={styles.pageContainer}>
                            <ReloadAppOnLanguageChangeWrappedI18nNavigator />
                        </View>
                    </Provider>
                </PaperProvider>
            </ApolloProvider>
        );
    }
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1
    }
});

export default App;
