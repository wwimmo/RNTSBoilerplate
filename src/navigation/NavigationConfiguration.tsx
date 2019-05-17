import { createStackNavigator, createAppContainer } from "react-navigation";
import StartScreen from "../modules/StartScreen";

const AppNavigator = createStackNavigator(
    {
        Start: {
            screen: StartScreen
        }
    },
    {
        headerMode: "none"
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
