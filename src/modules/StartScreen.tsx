import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Text } from "react-native-paper";
import { observer, inject } from "mobx-react";
import { withNamespaces } from "react-i18next";
import { compose } from "recompose";

import { ComponentInputPropsDefault } from "../types";
import { NavStore, CommonStore } from "../stores";

const instructions = Platform.select({
    ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    android: "Double tap R on your keyboard to reload,\n" + "Shake or press menu button for dev menu"
});

type Props = ComponentInputPropsDefault & {
    navStore: NavStore;
    commonStore: CommonStore;
};

class StartScreen extends React.Component<Props, {}> {
    render() {
        const { i18n: trans, commonStore, navStore } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit StartScreen.tsx</Text>
                <Text style={[styles.instructions, { marginBottom: 16 }]}>{instructions}</Text>
                <Text style={styles.instructions}>
                    isLandscapeOrientation: {commonStore.isLandscapeOrientation ? "true" : "false"}
                </Text>
                <Text style={styles.instructions}>isTablet: {commonStore.isTablet ? "true" : "false"}</Text>
                <Text style={styles.instructions}>isOnline: {commonStore.isOnline ? "true" : "false"}</Text>
                <Text style={styles.instructions}>isKeyboardOpen: {commonStore.isKeyboardOpen ? "true" : "false"}</Text>
                <Text style={styles.instructions}>AppState: {commonStore.appState}</Text>
                <Text style={styles.instructions}>
                    ActiveRouteName: {navStore.activeRouteName ? navStore.activeRouteName : "Not set yet"}
                </Text>
                <Text style={styles.instructions}>i18Next localized string to: {trans.t("general:someString")}</Text>
            </View>
        );
    }
}

export default compose(
    withNamespaces(["general", "i18n"], { wait: true }),
    inject("navStore", "commonStore"),
    observer
)(StartScreen);

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
