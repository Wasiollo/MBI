export default class TabsService {
    constructor() {
        this.INPUT_BASED = 'Input Based';
        this.FILE_BASED = 'File Based';
        this.activeTab = this.INPUT_BASED;
        this.tabs = [this.INPUT_BASED, this.FILE_BASED]
    }

    setTab(tab) {
        this.activeTab = tab;
    };

    isActive(tab){
        return this.activeTab === tab;
    }
}
