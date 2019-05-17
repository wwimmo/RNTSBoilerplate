import CommonStore from "./CommonStore";
import NavStore from "./NavStore";

// instantiate stores here
const commonStore = new CommonStore();
const navStore = new NavStore();

export default {
    commonStore,
    navStore
};

export { default as CommonStore } from "./CommonStore";
export { default as NavStore } from "./NavStore";
