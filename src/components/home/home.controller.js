export default class HomeController {
    constructor($log, $scope, chartService, toastr) {
        'ngInject';

        this.$log = $log;
        this.scope = $scope;
        this.chartService = chartService;
        this.toastr = toastr;
    }

    $onInit = () => {
        this.readInput = "";
        this.readsBuffer = [];
        this.currentInputMethod = 'user';
        this.GREEDY = {value:'greedy', label:'Zachłanny'};
        this.SUFFIX = {value:'suffix', label:'Drzewo sufixowe'}
        this.DYNAMIC = {value:'dynamic', label:'Progr. dynamiczne'};
        this.graphAlgorithm = this.GREEDY.value;
        this.graphAlgorithms = [this.GREEDY, this.SUFFIX, this.DYNAMIC]
        this.resultSequence = "";
        this.stepByStepMode = false;
        this.overlapMin = 2;
    };


    setInputMethod(method) {
        this.currentInputMethod = method;
    }

    addRead() {
        const newRead = this.readInput;
        if (newRead.length === 0) {
            this.toastr.error("Odczyty muszą mieć długość większą niż 0");
            return;
        }
        if (this.readsBuffer.length > 0 && this.readsBuffer[0].length !== newRead.length) {
            this.toastr.error("Wszystkie oczyty muszą być tej samej dłguości.")
            return;
        }
        this.readsBuffer.push(newRead);
        this.readInput = "";
    }

    loadFile() {
        const file = document.getElementById("fileInput").files[0];
        if (file) {
            let aReader = new FileReader();
            aReader.readAsText(file, "UTF-8");
            aReader.onload = (event) => {
                const fileContent = event.target.result;
                let readsArray = fileContent.split(/>.*\r\n/);
                for (let i = 0; i < readsArray.length; ++i) {
                    readsArray[i] = readsArray[i].replace(/(\r)+/g, "").replace(/(\n)+/g, "");
                }
                readsArray = readsArray.filter(function (el) {
                    return el !== "";
                });
                // readsArray.forEach(r => {
                //     this.readsBuffer.push(r);
                // });
                this.readsBuffer = readsArray;
                this.scope.$apply();
            }
        }
    }

    loadExampleData(){
        this.readsBuffer = ['XTTG', 'TTGG', 'TGGT', 'TGXG', 'GGTT', 'TTGX', 'GTTG'];
    }

    generateGraph(when) {
        if(this.overlapMin === undefined || this.overlapMin < 2){
            this.toastr.error("Minimalny overlap jest niepoprawny. Musi być równy co najmniej 2.");
            return;
        }
        this.chartService.assembly(this.readsBuffer, this.graphAlgorithm, when,this.overlapMin);
    }

    stepByStep(){
        if(this.overlapMin === undefined || this.overlapMin < 2){
            this.toastr.error("Minimalny overlap jest niepoprawny. Musi być równy co najmniej 2.");
            return;
        }
        this.chartService.assembly_step_by_step(this.readsBuffer, this.graphAlgorithm,this.overlapMin);
        this.stepByStepMode = true;
        this.clearGraph();
    }

    nextStep() {
        let canContinue = this.chartService.nextStep();
        if (canContinue === false){
            this.stepByStepMode = false;
        }
    }

    disableButtonsStepByStep() {
        this.stepByStepMode = false;
    }

    assembly() {
        this.resultSequence = this.chartService.assembly(this.readsBuffer, this.graphAlgorithm, 'none');
    }

    clearAll() {
        this.readsBuffer = [];
        this.clearGraph();
    }
    clearGraph() {
        this.chartService.clearGraph();
    }
}
