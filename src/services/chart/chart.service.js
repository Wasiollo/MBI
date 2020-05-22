import * as math from 'mathjs';
import * as _ from 'lodash';

export default class ChartService {
    constructor($rootScope) {
        'ngInject';
        this.rootScope = $rootScope;
    }

    addLink(source, target) {
        const linkData = {"source": source, "target": target}
        this.rootScope.$broadcast('addLink', linkData);
    }

    clearGraph() {
        this.rootScope.$broadcast('clearGraph');
    }

    ajd_to_path_matrix(adj) {
        const n = math.size(adj)[0];
        let path_mat = adj;
        for (let i = 1; i < n; ++i) {
            let path_mat_i = path_mat;
            for (let j = 0; j < i; ++j) {
                path_mat_i = math.multiply(path_mat_i, adj);
            }
            // math.add(path_mat, path_mat_i); - nie czaję po co :)
        }

        path_mat.map(function (value, index, matrix) {
            matrix[index] = value > 0 ? 1 : 0;
        });
        return path_mat;

    }

    olc_assembly(contigs, l, k) {
        let adj_matrix = this.overlap_naive(contigs, l, k);

        let path_mat = this.ajd_to_path_matrix(adj_matrix);
        return this.greedy_hpath(contigs, adj_matrix);
    }

    overlap_naive(contigs, l, k) { // l - minimal overlap size ; k - maximal overlap size
        let adj_matrix = math.zeros(contigs.length, contigs.length);
        for (let suf_i = 0; suf_i < contigs.length; suf_i++) {
            for (let pre_i = 0; pre_i < contigs.length; pre_i++) {

                if (contigs[suf_i] !== contigs[pre_i]) {
                    let index = contigs[suf_i].lastIndexOf(contigs[pre_i].slice(0, l));
                    if (index === -1) {
                        continue;
                    } else if (index === contigs[suf_i].length - l) {
                        adj_matrix.set([suf_i,pre_i], l);
                    } else if (index < contigs[suf_i].length - l && (contigs[suf_i].length - index) < k) {
                        if (contigs[suf_i].endsWith(contigs[pre_i].slice(0, contigs[suf_i].length - index))) {
                            adj_matrix.set([suf_i, pre_i], contigs[suf_i].length - index);
                        }
                    }
                }
            }
        }

        return adj_matrix;
    }


    greedy_hpath(contigs, adj_matrix) {
        let k_length = contigs[0].length
        let first_index = Math.round(Math.random() * k_length);

        let sequence = contigs[first_index];
        let remaining_indexes = _.range(0, contigs.length);
        const indx = remaining_indexes.indexOf(first_index);
        remaining_indexes.splice(indx, 1);
        let last_index = first_index;
        while (remaining_indexes.length !== 0) {
            let max_index = -1;
            let max_overlap = -1;
            for (let i of remaining_indexes) {
                if (adj_matrix.get([last_index, i]) > max_overlap) {
                    max_overlap = adj_matrix.get([last_index,i]);
                    max_index = i;
                }
            }
            if (max_index !== -1) {
                const indx = remaining_indexes.indexOf(max_index)
                remaining_indexes.splice(indx, 1);
                sequence += contigs[max_index].slice(max_overlap, k_length);

                last_index = max_index;
            } else {
                break;
            }
        }

        return sequence;
    }

    testOlcAssembly() {
        let seq = this.olc_assembly(['XTTG', 'TTGG', 'TGGT', 'TGXG', 'GGTT', 'TTGX', 'GTTG', 'XGXT', 'GXGX'], 2, 4);
        console.log(seq);
    }
}
