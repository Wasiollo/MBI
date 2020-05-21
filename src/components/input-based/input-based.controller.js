export default class InputBasedController {
    constructor($log, chartService) {
        'ngInject';

        this.$log = $log;
        this.chartService = chartService;
        this.counter = 0;
    }

    $onInit = () => {
        this.heading = 'Obliczanie sekwencji metodą grafu OLC input based';
        // this.$log.info('Activated Home View.');
    };

    testClick() {
        // this.$log.log('elo');
        this.counter += 1;
        this.chartService.addLink(this.counter, this.counter+1);
    }
}
