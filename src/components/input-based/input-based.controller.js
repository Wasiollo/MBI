export default class InputBasedController {
    constructor($log, chartService, toastr) {
        'ngInject';

        this.$log = $log;
        this.chartService = chartService;
        this.toastr = toastr;
    }

    $onInit = () => {
        this.heading = 'Obliczanie sekwencji metodą grafu OLC input based';
        this.readInput = "";
        this.readsBuffer = [];
        // this.$log.info('Activated Home View.');
    };

    addRead() {
        const newRead = this.readInput;
        if(this.readsBuffer.length > 0 && this.readsBuffer[0].length !== newRead.length){
            this.toastr.error("Wszystkie oczyty muszą być tej samej dłguości.")
            return;
        }
        this.readsBuffer.push(newRead);
        this.readInput = "";
    }

    generateGraph() {
        this.chartService.clearGraph();
        this.readsBuffer.forEach( read => {
            this.chartService.addLink(read, 'ggct');
        })
    }

    clearAll() {
        this.readsBuffer = [];
        this.chartService.clearGraph();
    }
}
