export default class InputBasedController {
    constructor($log, chartService) {
        'ngInject';

        this.$log = $log;
        this.chartService = chartService;
        this.counter = 0;
    }

    $onInit = () => {
        this.heading = 'Obliczanie sekwencji metodą grafu OLC input based';
        this.readInput = "";
        this.readsBuffer = [];
        // this.$log.info('Activated Home View.');
    };

    addRead() {
        // this.$log.log('elo');
        this.counter += 1;
        console.log(this.readInput);
        this.readsBuffer.push(this.readInput);
        this.readInput = "";
        // this.chartService.addLink(this.counter, this.counter+1);
    }

    generateGraph() {
        this.chartService.clearGraph();
        this.readsBuffer.forEach( read => {
            this.chartService.addLink(read, 'ggct');
        })
    }
}
