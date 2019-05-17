import { AsyncStorage } from "react-native";

class AsyncStorageWrapper {
    /**
     * @param key key under which asyncstorage saves the value
     * @param value value/object to save in asyncstorage
     * @param replacer replacer function to use for replacing values. Defaults to replaceNullWithNullString
     */
    public static async setItem(key: string, value: any, replacer?: any) {
        if (replacer) {
            await AsyncStorage.setItem(key, AsyncStorageWrapper.jsonStringify(value, replacer));
        } else {
            await AsyncStorage.setItem(key, AsyncStorageWrapper.jsonStringify(value));
        }
    }

    private static jsonStringify(value: any, replacer?: any): string {
        return JSON.stringify(value, replacer ? replacer : AsyncStorageWrapper.replaceNullWithNullString);
    }

    private static replaceNullWithNullString(key: string, value: any) {
        return value == null ? "null" : value;
    }

    /**
     * @param key key from which asyncstorage should read the value
     * @param replacer replacer function to use for replacing values. Defaults to replaceNullStringWithNull
     */
    public static async getItem(key: string, replacer?: any) {
        if (replacer) {
            const getItemResult = await AsyncStorage.getItem(key);
            if (getItemResult) {
                return AsyncStorageWrapper.jsonParse(getItemResult, replacer);
            }
            return null;
        } else {
            const getItemResult = await AsyncStorage.getItem(key);
            if (getItemResult) {
                return AsyncStorageWrapper.jsonParse(getItemResult);
            }
            return null;
        }
    }

    private static jsonParse(text: string, reviver?: any): any {
        return JSON.parse(text, reviver ? reviver : AsyncStorageWrapper.replaceNullStringWithNull);
    }

    private static replaceNullStringWithNull(key: any, value: any) {
        if (typeof value === "string") {
            return value === "null" ? null : value;
        }
        return value;
    }

    public static async removeItem(key: string) {
        await AsyncStorage.removeItem(key);
    }
}

export default AsyncStorageWrapper;
