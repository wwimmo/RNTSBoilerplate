import RootStore from "./RootStore";

// instantiate stores here
const rootStore = new RootStore();

export default {
    rootStore
};

export { default as CommonStore } from "./CommonStore";
export { default as NavStore } from "./NavStore";
