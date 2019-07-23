import React from "react";
import { View, StyleSheet, Platform, FlatList } from "react-native";
import { Text, ActivityIndicator, Divider } from "react-native-paper";
import { observer, inject } from "mobx-react";
import { withNamespaces } from "react-i18next";
import { compose } from "recompose";

import { ComponentInputPropsDefault } from "../types";
import { withAllPlanets } from "../api/graphql/get_All_Planets";
import { ChildProps } from "react-apollo";
import { GetAllPlanets, GetAllPlanets_allPlanets } from "../api/graphql/gql-types/getAllPlanets";

const instructions = Platform.select({
    ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    android: "Double tap R on your keyboard to reload,\n" + "Shake or press menu button for dev menu"
});

type Props = ChildProps<ComponentInputPropsDefault, GetAllPlanets>;

class StartScreen extends React.Component<Props, {}> {
    renderItem = ({ item }: { item: GetAllPlanets_allPlanets }) => {
        return (
            <View style={styles.listItemRoot}>
                <Text>Planet Name: {item.name}</Text>
                <Text>Climate: {item.climate ? item.climate.join(", ") : item.climate}</Text>
                <Text>Diameter: {item.diameter}</Text>
                <Text>Gravity: {item.gravity}</Text>
                <Text>Films: {item.films ? item.films!.map((film) => film.title).join(", ") : item.films}</Text>
            </View>
        );
    };

    renderSeperator = () => {
        return <Divider />;
    };

    keyExtractor = (item: any, index: number) => {
        return item + index;
    };

    render() {
        const { i18n: trans, rootStore, data } = this.props;
        if (data!.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            );
        }
        if (data!.error) {
            return (
                <View style={styles.container}>
                    <Text>Ein Fehler ist aufgetreten</Text>
                </View>
            );
        }

        if (!data!.loading && !data!.error) {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={data!.allPlanets!}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        ItemSeparatorComponent={this.renderSeperator}
                    />
                </View>
            );
        }
    }
}

export default compose(
    withNamespaces(["general", "i18n"], { wait: true }),
    inject("rootStore"),
    withAllPlanets,
    observer
)(StartScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F5FCFF"
    },
    listItemRoot: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        marginBottom: 16,
        marginTop: 16
    }
});
