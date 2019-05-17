import { NavigationActions, NavigationParams, NavigationAction } from "react-navigation";
import RouteNames from "../navigation/RouteNames";

let navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
    navigator = navigatorRef;
}

function navigate(routeName: string, params?: NavigationParams) {
    navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params
        })
    );
}

function navigateToStart() {
    navigate(RouteNames.START);
}

function dispatch(navAction: NavigationAction) {
    navigator.dispatch(navAction);
}

function goBack(routeKey?: string | null) {
    if (routeKey) {
        dispatch(NavigationActions.back({ key: routeKey }));
    } else {
        dispatch(NavigationActions.back());
    }
}

export default {
    navigate,
    navigateToStart,
    dispatch,
    setTopLevelNavigator,
    goBack
};
