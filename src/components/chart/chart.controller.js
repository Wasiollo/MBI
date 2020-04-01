export default class ChartController {
    constructor($log) {
        'ngInject';

        this.$log = $log;
    }

    $onInit = () => {
        this.$log.info('Activated Chart View.');
    };
}