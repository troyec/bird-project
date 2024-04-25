import { makeAutoObservable } from "mobx";

class Store {
    filename = null;
    labels = [];

    constructor() {
        makeAutoObservable(this);
    }

    setFilename(filename) {
        this.filename = filename;
        console.log('filename',filename)
    }

    setLabels(labels) {
        this.labels = labels;
        console.log('labels',labels)
    }

}

export default new Store();