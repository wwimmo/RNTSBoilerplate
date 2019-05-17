import { Platform } from "react-native";
import RNFS from "react-native-fs";

const directoryDocuments = Platform.select({
    ios: `${RNFS.DocumentDirectoryPath}/`,
    android: `${RNFS.DocumentDirectoryPath}/`,
    windows: `${RNFS.DocumentDirectoryPath}/`
});

const directoryPictures = Platform.select({
    ios: `${RNFS.PicturesDirectoryPath}/com.myApp/`,
    android: `${RNFS.PicturesDirectoryPath}/com.myApp/`,
    windows: `${RNFS.PicturesDirectoryPath}/com.myApp/`
});

const directoryPersistedCaches = `${directoryDocuments}PersistedCaches/`;
const directoryDatabase = `${directoryDocuments}../databases/`;

const nativeAssetsPrefix = Platform.select({
    ios: "",
    android: "asset:/",
    windows: "toBeClarified"
});

const nativeAssetsFileEnding = Platform.select({
    ios: "",
    android: ".png",
    windows: ".png"
});

const NavStore = {
    PERSISTKEY_PREFIX: "@NavStore:",
    PERSISTKEY_NAVSTATE: `navState`,
    PERSISTKEY_RESUME: `shouldResumeAtNavState`,
    LOG_REHYDRATE_FAILED: "NavStore: REHYDRATE FAILED"
};
export default {
    directoryDocuments,
    directoryPictures,
    directoryPersistedCaches,
    directoryDatabase,
    nativeAssetsPrefix,
    nativeAssetsFileEnding,
    NavStore
};
