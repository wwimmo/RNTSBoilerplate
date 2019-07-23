import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { TextInput, Divider } from "react-native-paper";
import { observer, inject } from "mobx-react";
import { withNamespaces } from "react-i18next";
import { compose } from "recompose";

import { ComponentInputPropsDefault } from "../types";
import { Developer } from "../stores/ListStore";

type Props = ComponentInputPropsDefault;

class ListSearchScreen extends React.Component<Props, {}> {
    onSearchQueryChanged = (text: string) => {
        this.props.rootStore.listStore.setSearchQuery(text);
    };

    renderItem = ({ item }: { item: Developer }) => {
        return (
            <View style={styles.listItemRoot}>
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.team}</Text>
                <Text>{item.age}</Text>
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
        const { i18n: trans, rootStore } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.searchInputContainer}>
                    <TextInput
                        label={"Suchanfrage"}
                        value={rootStore.listStore.searchQuery}
                        onChangeText={this.onSearchQueryChanged}
                    />
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        data={rootStore.listStore.listDataFilteredBySearchQuery.slice()}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        ItemSeparatorComponent={this.renderSeperator}
                    />
                </View>
            </View>
        );
    }
}

export default compose(
    withNamespaces(["general", "i18n"], { wait: true }),
    inject("rootStore"),
    observer
)(ListSearchScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#F5FCFF"
    },
    searchInputContainer: {
        flex: 1
    },
    listContainer: {
        flex: 9
    },
    listItemRoot: {
        flex: 1,
        flexDirection: "column",
        width: "100%",
        marginBottom: 16
    }
});
