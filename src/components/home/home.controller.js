// import olc_assembly from '../../assembly/assembly'
function olc_assembly(contigs, l, k) {
    return overlap_naive(contigs, l, k);
}

function overlap_naive(contigs, l, k) { // l - minimal overlap size ; k - maximal overlap size
    for(var contig_suf in contigs) {
        for(var contig_pre in contigs) {
            if(contig_pre != contig_suf) {
                var index = contig_suf.lastIndexOf(contig_pre.slice(0,l));
                if(index == -1) {
                    continue;
                } else if (index == contig_suf.length - k) {
                    //TODO add to graph
                    console.log("Add to graph");
                } else if (index < contig_suf.length - k) {
                    if(contig_suf.endsWith(contig_pre.slice(end=contig_suf.length - index))) {
                        //TODO add to graph
                        console.log("Add to graph");
                    }
                }



            }
        }
        // if(contig.slice(contig.length - k))
    }

    return true;
}

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
                    readsArray[i] = readsArray[i].replaceAll('\r', '').replaceAll('\n', '');
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
        this.chartService.assembly(this.readsBuffer, this.graphAlgorithm, when);
    }

    assembly() {
        this.resultSequence = this.chartService.assembly(this.readsBuffer, this.graphAlgorithm, 'none');
    }

    clearAll() {
        this.readsBuffer = [];
        this.chartService.clearGraph();
    }

    testOlcAssmbly() {
        this.chartService.testOlcAssembly();
    }
}
