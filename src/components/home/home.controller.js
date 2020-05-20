export default class HomeController {
    constructor($log, tabsService) {
        'ngInject';

        this.$log = $log;
        this.tabsService = tabsService
    }

    $onInit = () => {
        this.$log.info('Activated Home View.');
    };

    isFileBasedActive = () => {
        return this.tabsService.isActive(this.tabsService.FILE_BASED);
    }

    isInputBasedActive = () => {
        return this.tabsService.isActive(this.tabsService.INPUT_BASED);
    }
}
