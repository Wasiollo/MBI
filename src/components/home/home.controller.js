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
    constructor($log, tabsService) {
        'ngInject';

        this.$log = $log;
        this.tabsService = tabsService
    }

    $onInit = () => {
        // this.$log.info('Activated Home View.');
    };

    isFileBasedActive = () => {
        return this.tabsService.isActive(this.tabsService.FILE_BASED);
    }

    isInputBasedActive = () => {
        return this.tabsService.isActive(this.tabsService.INPUT_BASED);
    }
}
