import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, AppStateStatus } from "react-native";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import * as RNLanguages from "react-native-localize";
import DeviceInfo from "react-native-device-info";

// Our imports
import stores from "./stores";

const instructions = Platform.select({
    ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    android: "Double tap R on your keyboard to reload,\n" + "Shake or press menu button for dev menu"
});

interface Props {}
export default class App extends Component<Props> {
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
        } else if (stores.commonStore.appState === "active" && newAppState.match(/inactive|background/)) {
        }
        stores.commonStore.setAppState(newAppState);
    };

    resumeAfterLanguageChangeIfPossible = async () => {
        // await stores.uiStore.rehydrate();
        // if (!stores.uiStore.shouldResumeAtNavState) {
        //     NavigationService.navigateToApp();
        // }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.tsx</Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});
