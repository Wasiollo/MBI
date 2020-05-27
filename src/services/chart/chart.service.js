import * as math from 'mathjs';
import * as _ from 'lodash';
import { or } from 'angular-ui-router';

class SuffixTree {
    constructor(str) {
        this.root = {
            id: 0,
            children: {},
            start: 0
        }
        this.activeNode = this.root;
        this.curr_pos = -1; //left
        this.look_ahead = -1;   //right
        this.last_string_idx = -1;  //idx
        this.strings_list = {};
        this.last_node_id = 0;  //lastID
        this.skip = 0;
        this.text = [];
        if (str) {
            this.add(str);
        }
    }

    add(str) {
        if (!(typeof str === 'string') || str.length == 0) {
            return;
        }
        this.last_string_idx += 1;
        this.strings_list[this.last_string_idx] = str;

        for (let i = 0; i < str.length; ++i) {
            this.addSingleChar(str[i]);
        }
        this.addSingleChar('$' + this.last_string_idx);
    }

    addSingleChar(char) {
        this.look_ahead += 1;
        this.text.push(char);

        let prev_internal_node;

        while (this.curr_pos < this.look_ahead) {
            let skipped = this.curr_pos + this.skip;

            if (skipped < this.look_ahead) {
                let edge_char = this.text[skipped + 1];
                let edge = this.activeNode.children[edge_char];
                if (edge) {
                    let edge_length = this.getNodeLength(edge);
                    let extension = this.look_ahead - (this.curr_pos + this.skip);

                    while (edge_length < extension) {
                        this.activeNode = edge;
                        this.skip += edge_length;
                        extension = this.look_ahead - (this.curr_pos + this.skip);

                        if (!extension) {
                            break;
                        }

                        edge_char = this.text[this.curr_pos + this.skip + 1];
                        edge = this.activeNode.children[edge_char];

                        if (!edge) {
                            break;
                        }

                        edge_length = this.getNodeLength(edge);
                    }
                }
            }

            const node = this.activeNode;

            skipped = this.curr_pos + this.skip;
            let extension = this.look_ahead - skipped - 1;

            if (extension <= 0) {
                if (node.children[char]) {
                    return true;
                } else {
                    node.children[char] = this.createNode(this.look_ahead, node);
                    this.curr_pos += 1;
                    this.activeNode = this.root;
                    this.skip = 0;
                }
            } else {
                const edge_char = this.text[skipped + 1];
                const edge = node.children[edge_char];
                const extension = this.look_ahead - skipped - 1;
                const match_char = this.text[edge.start + extension];

                if (char === match_char) {
                    return;
                } else {
                    const end_child = this.createNode(this.look_ahead, edge);
                    const split_child = this.createNode(edge.start + extension, edge);

                    if (edge.end !== undefined) {
                        const split_child_length = this.getNodeLength(edge) - extension;
                        split_child.end = split_child.start + split_child_length - 1;

                        for (let child_char in edge.children) {
                            split_child.children[child_char] = edge.children[child_char];
                            delete edge.children[child_char];
                        }
                    }
                    edge.end = edge.start + extension - 1;
                    edge.children[char] = end_child;
                    edge.children[match_char] = split_child;

                    if (prev_internal_node) {
                        prev_internal_node.link = edge;
                    }
                    prev_internal_node = edge;

                    if (!node.link || node.link.parent === this.root) {
                        this.activeNode = this.root;
                    } else {
                        this.activeNode = node.link;
                    }

                    if (this.activeNode === this.root) {
                        this.skip = 0;
                    } else {
                        this.skip -= 1;
                    }
                    this.curr_pos += 1;
                }
            }
        }
    }

    getNodeLength(node) {
        const end = node.end === undefined ? this.look_ahead : node.end;
        return end + 1 - node.start;
    }

    createNode(start, parent) {
        this.last_node_id += 1;
        return {
            start: start,
            children: {},
            id: this.last_node_id,
            parent
        }
    }

    findOverlaps(contigs, minOverlap) {
        let overlaps_list = [];
        let overlaps = math.zeros(contigs.length, contigs.length);
        for(let c in contigs) {
            let contig = contigs[c];
            let firstChar = contig[0];
            let cIndex = 0;
            let child = this.root.children[firstChar];
            if( !child) {
                continue;
            }

            let nodesToCheck = [[child, 0]];

            while(nodesToCheck.length != 0) {
                let pair = nodesToCheck.shift();
                let node = pair[0];
                cIndex = pair[1];

                if(node.start == 38) {
                    console.log("here");
                }


                let nodeLenght = this.getNodeLength(node);
                for(let i = 0; i < nodeLenght; ++i) {
                    let currChar = contig[cIndex + i];
                    let nodeChar = this.text[node.start + i];
                    if(nodeChar != currChar) {
                        if(nodeChar.length == 2 && nodeChar[0] === '$') {
                            if(nodeChar[1] != c && cIndex + i >= minOverlap) {
                                overlaps.set([parseInt(nodeChar[1]), parseInt(c)], cIndex + i);
                                overlaps_list.push({source: parseInt(nodeChar[1]), target: parseInt(c), value: cIndex + i});
                                continue;
                            } 
                        } 
                        break;
                    }
    
                }


                cIndex += nodeLenght;

                if(cIndex == contig.length) {
                    continue;
                } else {
                    for(let childNode in node.children) {
                        if(childNode.length > 1) {
                            let o = parseInt(childNode.slice(1));
                            if(o != parseInt(c) && cIndex >= minOverlap) {
                                overlaps.set([o, parseInt(c)], cIndex);
                                overlaps_list.push({source: o, target: parseInt(c), value: cIndex});
                            }
                        } else {
                            if(contig[cIndex] == childNode) {
                                nodesToCheck.push([node.children[childNode], cIndex]);
                            }
                        }
                    }
                }
            }
        }


        return [overlaps, overlaps_list];
    }
}

class Dynamic {
    constructor(contigs) {
        this.contigs = contigs;
    }

    sFunction(a, b) {
        if (a === "-" || b === "-") {
            return 8;
        } else if (
            (a === 'G' && b === 'A') ||
            (a === 'A' && b === 'G') ||
            (a === 'C' && b === 'T') ||
            (a === 'T' && b === 'C')
        ) {
            return 2;
        } else if (a === b) {
            return 0;
        } else {
            return 4;
        }
    }

    dFunction(first, second, dMatrix, i, j) {
        const a = dMatrix.get([i - 1, j]) + this.sFunction(first[i - 1], "-");
        const b = dMatrix.get([i, j - 1]) + this.sFunction("-", second[j - 1]);
        const c = dMatrix.get([i - 1, j - 1]) + this.sFunction(first[i], second[j]);
        return math.min(a, b, c);
    }

    createAdjMatrix(l){
        let resultMatrix = math.zeros(this.contigs.length, this.contigs.length);
        this.createAdjQueue(l).forEach(e => {
            resultMatrix.set([e.source, e.target], e.value);
        })
        return resultMatrix;
    }
    // l -> lowest level of overlap to notice :)
    createAdjQueue(l) {
        let resultQueue = [];
        for (let i = 0; i < this.contigs.length; ++i) {
            for (let j = i + 1; j < this.contigs.length; ++j) {
                let iOverlap = this.getOverlap(this.contigs[i], this.contigs[j], l);
                let jOverlap = this.getOverlap(this.contigs[j], this.contigs[i], l);
                if(iOverlap === 0 && jOverlap === 0) {
                    continue;
                }
                if (iOverlap > jOverlap) {
                    resultQueue.push({source: i, target: j, value: iOverlap});
                } else {
                    resultQueue.push({source: j, target: i, value: jOverlap});
                }
            }
        }
        console.log(resultQueue);
        return resultQueue;
    }

    getOverlap(first, second, l) {
        let firstD = "-" + first;
        let secondD = "-" + second;
        let dMatrix = math.zeros(firstD.length, secondD.length);
        for (let i = 1; i < secondD.length; ++i) {
            dMatrix.set([0, i], Infinity)
        }
        for (let i = 1; i < firstD.length; ++i) {
            for (let j = 1; j < secondD.length; ++j) {
                dMatrix.set([i, j], this.dFunction(firstD, secondD, dMatrix, i, j));
            }
        }
        let resultTable = []
        for (let j = 1; j < secondD.length; ++j) {
            /* handling mistakes in sequence
            let resultJ = j;
            let resultK = dMatrix.get([firstD.length - 1, j]);
            for(let k = 0 ; k <= j ; ++k){
                let resultValue = dMatrix.get([firstD.length - 1 - k, j - k])
                if(resultValue !== resultK){
                    --resultJ;
                    resultK = resultValue;
                }
            }
            if(resultJ > j/2) {
                resultTable[j] = resultJ;
            } else {
                resultTable[j] = 0;
            }*/
            let currentValue = dMatrix.get([firstD.length - 1, j]);
            if (currentValue === 0 && j >= l) {
                resultTable[j] = j
            } else {
                resultTable[j] = 0;
            }
        }
        return math.max(resultTable);
    }
}

export default class ChartService {
    constructor($rootScope, toastr) {
        'ngInject';
        this.rootScope = $rootScope;
        this.toastr = toastr;
    }

    addLink(source, target) {
        const linkData = {"source": source, "target": target}
        this.rootScope.$broadcast('addLink', linkData);
    }

    clearGraph() {
        this.rootScope.$broadcast('clearGraph');
    }

    assembly(readsBuffer, type, graphShow, overlapMin) {
        return this.olc_assembly(readsBuffer, overlapMin, readsBuffer[0].length, type, graphShow);
    }

    assembly_step_by_step(readsBuffer, type,overlapMin) {
        return this.olc_assembly_step_by_step(readsBuffer, overlapMin, readsBuffer[0].length, type);
    }

    ajd_to_path_matrix(adj) {
        const n = math.size(adj)._data[0];
        let path_mat = math.matrix(adj);
        for (let i = 1; i < n; ++i) {
            let path_mat_i = math.matrix(adj);
            for (let j = 0; j < i; ++j) {
                path_mat_i = math.multiply(path_mat_i, adj);
            }
            path_mat = math.add(path_mat, path_mat_i);
        }

        path_mat.map(function (value, index, matrix) {
            matrix.set(index, value > 0 ? 1 : 0);
        });

        for (let i = 0; i < n; ++i) {
            path_mat.set([i, i], 0);
        }
        return path_mat;

    }

    transitive_reduction(mat) {
        let ret_mat = math.matrix(mat);
        const s = math.size(mat)._data[0];
        for (let j = 0; j < s; ++j) {
            for (let i = 0; i < s; ++i) {
                if (ret_mat.get([i, j]) != 0) {
                    for (let k = 0; k < s; ++k) {
                        if (ret_mat.get([j, k]) != 0) {
                            ret_mat.set([i, k], 0);
                        }
                    }

                }

            }
        }
        return ret_mat;
    }

    olc_assembly_step_by_step(contigs, l, k, type) {
        this.contigs = contigs;
        this.currentStep = 1;
        if (type === 'greedy') {
            this.stepQueue = this.overlap_naive_adj_matrix_queue(contigs, l, k);
        } else if (type === 'suffix') {
            let tree = new SuffixTree('');
            for (let c of contigs) {
                tree.add(c);
            }
            let pair = tree.findOverlaps(contigs, l);
            this.stepQueue = pair[1];
        } else if (type === 'dynamic') {
            let dynamic = new Dynamic(contigs);
            this.stepQueue = dynamic.createAdjQueue(l);
        } else {
            throw "Illegal operation";
        }
    }

    nextStep(){
        let adjMatrix = math.zeros(this.contigs.length, this.contigs.length);
        for (let i = 0 ; i < this.currentStep ; ++i){
            let currentQueueValue = this.stepQueue[i];
            adjMatrix.set([currentQueueValue.source, currentQueueValue.target], currentQueueValue.value);
        }
        let currentQueueValue = this.stepQueue[this.currentStep - 1];
        this.toastr.success("Dodano krawędź z " + currentQueueValue.source + " do " + currentQueueValue.target + " o wartości " + currentQueueValue.value);

        this.createGraphFromMatrix(this.contigs, adjMatrix);
        this.currentStep+=1;
        return this.currentStep <= this.stepQueue.length;
    }

    olc_assembly(contigs, l, k, type, graphShow) {

        if (type === 'greedy') {
            let adj_matrix = this.overlap_naive(contigs, l, k);
            if (graphShow === 'beforeReduction') {
                this.createGraphFromMatrix(contigs, adj_matrix);
            }
            let reducted_mat = this.transitive_reduction(adj_matrix);

            if (graphShow === 'afterReduction') {
                this.createGraphFromMatrix(contigs, reducted_mat);
            }

            return this.greedy_hpath(contigs, reducted_mat);
        } else if (type === 'suffix') {
            let tree = new SuffixTree('');
            for (let c of contigs) {
                tree.add(c);
            }
            let pair = tree.findOverlaps(contigs, l);
            let adj_matrix = pair[0];
            let overlaps = pair[1];

            if(graphShow === 'beforeReduction'){
                this.createGraphFromMatrix(contigs, adj_matrix);
            }

            let reducted_mat = this.transitive_reduction(adj_matrix);

            if(graphShow === 'afterReduction'){
                this.createGraphFromMatrix(contigs, reducted_mat);
            }

            return this.greedy_hpath(contigs, reducted_mat);

        } else if (type === 'dynamic') {
            let dynamic = new Dynamic(contigs);
            let adj_matrix = dynamic.createAdjMatrix(l);
            if (graphShow === 'beforeReduction') {
                this.createGraphFromMatrix(contigs, adj_matrix);
            }
            let reducted_mat = this.transitive_reduction(adj_matrix);

            if (graphShow === 'afterReduction') {
                this.createGraphFromMatrix(contigs, reducted_mat);
            }

            return this.greedy_hpath(contigs, reducted_mat);
        } else {
            throw "Illegal option";
        }
    }

    createGraphFromMatrix(contigs, adj_matrix) {
        let dataset = {
            nodes: [],
            edges: []
        };
        this.clearGraph();
        contigs.forEach(c => {
            dataset.nodes.push({name: c});
        })
        for (let i = 0; i < contigs.length; ++i) {
            for (let j = 0; j < contigs.length; ++j) {
                let currentCount = adj_matrix.get([i, j]);
                if (currentCount > 0) {
                    dataset.edges.push({source: i, target: j, count: currentCount})
                }
            }
        }
        this.rootScope.$broadcast('updateGraph', dataset);
    }

    overlap_naive(contigs, l, k) { // l - minimal overlap size ; k - maximal overlap size
        let resultMatrix = math.zeros(contigs.length, contigs.length);
        this.overlap_naive_adj_matrix_queue(contigs,l,k).forEach(e => {
            resultMatrix.set([e.source, e.target], e.value);
        })
        return resultMatrix;
    }

    overlap_naive_adj_matrix_queue(contigs, l, k){
        let resultQueue = [];
        for (let suf_i = 0; suf_i < contigs.length; suf_i++) {
            for (let pre_i = 0; pre_i < contigs.length; pre_i++) {

                if (contigs[suf_i] !== contigs[pre_i]) {
                    let index = contigs[suf_i].indexOf(contigs[pre_i].slice(0, l), 0);
                    while(index != -1) {
                        if (index === contigs[suf_i].length - l) {
                            resultQueue.push({source: suf_i, target: pre_i, value: l});
                            break;
                        } else if (index < contigs[suf_i].length - l && (contigs[suf_i].length - index) <= k) {
                            if (contigs[suf_i].endsWith(contigs[pre_i].slice(0, contigs[suf_i].length - index))) {
                                resultQueue.push({source: suf_i, target: pre_i, value: contigs[suf_i].length - index});
                                break;
                            } else {
                                index = contigs[suf_i].indexOf(contigs[pre_i].slice(0, l), index + 1);
                            }
                        } else {
                            index = contigs[suf_i].indexOf(contigs[pre_i].slice(0, l), index + 1);
                        }
                    }
                }
            }
        }

        return resultQueue;
    }


    greedy_hpath(contigs, adj_matrix) {
        let k_length = contigs.length
        if(adj_matrix == math.zeros(k_length, k_length)) {
            console.log("adj matrix is empty");
        }
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
                    max_overlap = adj_matrix.get([last_index, i]);
                    max_index = i;
                }
            }
            if (max_index !== -1) {
                const indx = remaining_indexes.indexOf(max_index)
                remaining_indexes.splice(indx, 1);
                sequence += contigs[max_index].slice(max_overlap);

                last_index = max_index;
            } else {
                break;
            }
        }

        return sequence;
    }
}