export default class HomeController {
    constructor($log) {
        'ngInject';

        this.$log = $log;
    }

    $onInit = () => {
        this.heading = 'Obliczanie sekwencji metodą grafu OLC ';
        this.$log.info('Activated Home View.');
    };
}