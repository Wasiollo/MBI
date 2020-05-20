export default class FileBasedController {
    constructor($log) {
        'ngInject';

        this.$log = $log;
        this.counter = 0;
    }

    $onInit = () => {
        this.heading = 'Obliczanie sekwencji metodą grafu OLC file based ';
        this.$log.info('Activated Home View.');
    };

    testClick() {
        this.$log.log('elo');
        this.counter += 1;
    }
}
