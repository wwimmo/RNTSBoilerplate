import { createStackNavigator, createAppContainer } from "react-navigation";
import StartScreen from "../modules/StartScreen";

const AppNavigator = createStackNavigator({
    Start: {
        screen: StartScreen
    }
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
