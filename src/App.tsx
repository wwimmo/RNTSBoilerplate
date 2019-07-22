import React, { Component } from "react";
import { StyleSheet, View, AppStateStatus } from "react-native";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import { Provider as PaperProvider } from "react-native-paper";
import { withNamespaces } from "react-i18next";
import * as RNLanguages from "react-native-localize";
import DeviceInfo from "react-native-device-info";
import { ApolloProvider } from "react-apollo";

// Our imports
import stores from "./stores";
import i18n, { supportedLanguages } from "./lang/i18n";
import { apolloClient } from "./utils/storage/ApolloInit";
import NavigationService from "./utils/NavigationService";
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
                stores.rootStore.navStore.setNavigator(navigatorRef);
            }}
            onNavigationStateChange={onNavStateChanged}
        />
    );
};

const onNavStateChanged = (prevState: any, currentState: any) => {
    stores.rootStore.navStore.onNavigationStateChange(currentState);
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
        stores.rootStore.commonStore.setIsTablet(DeviceInfo.isTablet());
        stores.rootStore.commonStore.addConnectivityListener();
        stores.rootStore.commonStore.addOrientationListener();
        stores.rootStore.commonStore.addKeyboardListener();
        stores.rootStore.commonStore.addLanguageChangeListener(this.onLanguagesChanged);
        stores.rootStore.commonStore.addAppStateChangeListener(this.onAppStateChanged);
        // this.resumeAfterLanguageChangeIfPossible();
    }

    componentWillUnmount() {
        stores.rootStore.commonStore.removeConnectivityListener();
        stores.rootStore.commonStore.removeOrientationListener();
        stores.rootStore.commonStore.removeKeyboardListener();
        stores.rootStore.commonStore.removeLanguagesChangeListener(this.onLanguagesChanged);
        stores.rootStore.commonStore.removeAppStateChangeListener(this.onAppStateChanged);
    }

    onLanguagesChanged = () => {
        const fallback = { languageTag: "de", isRTL: false };
        const { languageTag } = RNLanguages!.findBestAvailableLanguage(Object.keys(supportedLanguages)) || fallback;
        i18n.changeLanguage(languageTag);
    };

    onAppStateChanged = async (newAppState: AppStateStatus) => {
        if (stores.rootStore.commonStore.appState.match(/inactive|background/) && newAppState === "active") {
            await stores.rootStore.commonStore.persistCacheAndRestoreMutations();
        } else if (stores.rootStore.commonStore.appState === "active" && newAppState.match(/inactive|background/)) {
        }
        stores.rootStore.commonStore.setAppState(newAppState);
    };

    resumeAfterLanguageChangeIfPossible = async () => {
        await stores.rootStore.navStore.rehydrate();
        if (!stores.rootStore.navStore.shouldResumeAtNavState) {
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
