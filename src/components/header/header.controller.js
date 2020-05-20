export default class HeaderController {
    constructor($log, tabsService) {
        'ngInject';

        this.$log = $log;
        this.tabsService = tabsService;
        this.tabs = this.tabsService.tabs;
    }

    $onInit = () => {
        this.$log.info('hee he he header');
    };

    setCurrentTab(tab) {
        this.tabsService.setTab(tab);
    }

    isActiveTab(tab) {
        return this.tabsService.isActive(tab);
    }

}
