import { DefaultTheme } from "react-native-paper";

export const Theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 2,
    colors: {
        primary: "#004799",
        accent: "#D6D902",
        background: "#ffffff",
        black: "#212121",
        surface: "#ffffff",
        active: "rgba(0, 0, 0, 0.08)",
        lineColor: "rgba(0, 0, 0, 0.6)",
        defaultGrey: "rgba(0, 0, 0, 0.54)",
        positive: "green",
        negative: "#B00020",
        error: "red",
        text: "rgba(0, 0, 0, 0.6)",
        disabled: "#C2C2C2",
        placeholder: "rgba(0, 0, 0, 0.6)",
        backdrop: "rgba(0, 0, 0, 0.56)",
        piechart: {
            new: "#004799",
            edit: "#D6D902",
            done: "#009774",
            archive: "#EC651A"
        }
    },
    fontStyles: {
        bodyMediumBold: {
            fontWeight: "bold",
            fontStyle: "normal",
            color: "rgba(0, 0, 0, 0.6)"
        }
    },
    listItemHeight: 52
};
