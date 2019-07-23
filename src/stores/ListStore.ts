import RootStore from "./RootStore";
import { decorate, observable, computed, action } from "mobx";

export interface Developer {
    name: string;
    email: string;
    team: string;
    age: number;
}

class ListStore {
    listData: Developer[] = [
        {
            name: "Jorge Levano",
            email: "jorge.levano@wwimmo.ch",
            team: "mobile",
            age: 41
        },
        {
            name: "Thomas Steinbrüchel",
            email: "thomas.steinbruechel@wwimmo.ch",
            team: "mobile",
            age: 26
        },
        {
            name: "Stefanie Glarcher",
            email: "stefanie.glarcher@wwimmo.ch",
            team: "mobile",
            age: 17
        },
        {
            name: "Michale Furrer",
            email: "michael.furrer@wwimmo.ch",
            team: "PM",
            age: 35
        }
    ];
    searchQuery: string = "";

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    // actions
    setSearchQuery = (searchQuery: string) => {
        this.searchQuery = searchQuery;
    };

    // Computeds
    get listDataFilteredBySearchQuery(): Developer[] {
        if (this.searchQuery !== "") {
            const lowerCaseSearchQuery = this.searchQuery.toLowerCase();
            return this.listData.filter((developer) => {
                return (
                    developer.name.toLowerCase().includes(lowerCaseSearchQuery) ||
                    developer.email.toLowerCase().includes(lowerCaseSearchQuery) ||
                    developer.team.toLowerCase().includes(lowerCaseSearchQuery) ||
                    (!isNaN(parseInt(this.searchQuery, 10)) && developer.age === parseInt(this.searchQuery, 10))
                );
            });
        } else {
            return this.listData;
        }
    }
}

decorate(ListStore, {
    listData: observable,
    searchQuery: observable,
    setSearchQuery: action,
    listDataFilteredBySearchQuery: computed
});

export default ListStore;
