import CommonStore from "./CommonStore";
import NavStore from "./NavStore";
import ListStore from "./ListStore";

class RootStore {
    commonStore: CommonStore;
    navStore: NavStore;
    listStore: ListStore;

    constructor() {
        this.commonStore = new CommonStore(this);
        this.navStore = new NavStore(this);
        this.listStore = new ListStore(this);
    }
}

export default RootStore;
