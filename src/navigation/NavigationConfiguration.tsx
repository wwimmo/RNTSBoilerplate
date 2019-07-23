import { createStackNavigator, createAppContainer } from "react-navigation";
import StartScreen from "../modules/StartScreen";
import ListSearchScreen from "../modules/ListSearchScreen";

const AppNavigator = createStackNavigator(
    {
        Start: {
            screen: ListSearchScreen
        }
    },
    {
        headerMode: "none"
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
