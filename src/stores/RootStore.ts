import CommonStore from "./CommonStore";
import NavStore from "./NavStore";

class RootStore {
    commonStore: CommonStore;
    navStore: NavStore;

    constructor() {
        this.commonStore = new CommonStore(this);
        this.navStore = new NavStore(this);
    }
}

export default RootStore;
