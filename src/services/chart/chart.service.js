import * as math from 'mathjs';
import * as _ from 'lodash';

class SuffixTree {
    constructor(str) {
        this.root = {
            id: 0,
            children: {},
            start:0
        }
        this.activeNode = this.root;
        this.curr_pos = -1; //left
        this.look_ahead = -1;   //right
        this.last_string_idx = -1;  //idx
        this.strings_list = {};     
        this.last_node_id = 0;  //lastID
        this.skip = 0;
        this.text = [];
        if(str) {
            this.add(str);
        }
    }

    add (str) {
        if(!(typeof str === 'string') || str.length == 0){
            return;
        }
        this.last_string_idx += 1;
        this.strings_list[this.last_string_idx] = str;

        for(let i = 0; i < str.length; ++i) {
            this.addSingleChar(str[i]);
        }
        this.addSingleChar('$' + this.last_node_id);
    }

    addSingleChar(char) {
        this.look_ahead += 1;
        this.text.push(char);

        let prev_internal_node;

        while(this.curr_pos < this.look_ahead) {
            let skipped = this.curr_pos + this.skip;

            if(skipped < this.look_ahead) {
                let edge_char = this.text[skipped + 1];
                let edge = this.activeNode.children[edge_char];
                if(edge) {
                    let edge_length = this.getNodeLength(edge);
                    let extension = this.look_ahead - (this.curr_pos + this.skip);

                    while(edge_length < extension) {
                        this.activeNode = edge;
                        this.skip += edge_length;
                        extension = this.look_ahead - (this.curr_pos + this.skip);

                        if(!extension) {
                            break;
                        }

                        edge_char = this.text[this.curr_pos + this.skip + 1];
                        edge = this.activeNode.children[edge_char];

                        if(!edge) {
                            break;
                        }

                        edge_length = this.getNodeLength(edge);
                    }
                }
            }

            const node = this.activeNode;

            skipped = this.curr_pos + this.skip;
            let extension = this.look_ahead - skipped - 1;

            if(extension <= 0) {
                if(node.children[char]) {
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

                if(char === match_char) {
                    return;
                } else {
                    const end_child = this.createNode(this.look_ahead, edge);
                    const split_child = this.createNode(edge.start + extension, edge);

                    if(edge.end !== undefined) {
                        const split_child_length = this.getNodeLength(edge) - extension;
                        split_child.end = split_child.start + split_child_length - 1;

                        for(let child_char in edge.children) {
                            split_child.children[child_char] = edge.children[child_char];
                            delete edge.children[child_char];
                        }
                    }
                    edge.end = edge.start + extension - 1;
                    edge.children[char] = end_child;
                    end.children[match_char] = split_child;

                    if(prev_internal_node) {
                        prev_internal_node.link = edge;
                    }
                    prev_internal_node = edge;

                    if(!node.link || node.link.parent === this.root) {
                        this.activeNode = this.root;
                    } else {
                        this.activeNode = node.link;
                    }

                    if(this.activeNode === this.root) {
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
}

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

    assembly(readsBuffer, type, graphShow){
        return this.olc_assembly(readsBuffer, 2, readsBuffer[0].length , type, graphShow);
    }

    ajd_to_path_matrix(adj) {
        const n = math.size(adj)[0];
        let path_mat = math.matrix(adj);
        for (let i = 1; i < n; ++i) {
            let path_mat_i = path_mat;
            for (let j = 0; j < i; ++j) {
                path_mat_i = math.multiply(path_mat_i, adj);
            }
            math.add(path_mat, path_mat_i); 
        }

        path_mat.map(function (value, index, matrix) {
            matrix.set(index, value > 0 ? 1 : 0);
        });
        return path_mat;

    }

    transitive_reduction(path_mat) {
        const s = math.size(path_mat)[0];
        for(let n = 1; n < s; ++n) {
            for(let i = 1; i < s; ++i) {
                for(let j = 0; j < s; ++j) {
                    if(path_mat.get([i,j])) {
                        for(let k = 0; k < i; ++k) {
                            if(path_mat.get([i,k])) {
                                path_mat.set([j,k], 0);
                            }
                        }
                    }
                }
            }
        }
    }

    olc_assembly(contigs, l, k, type, graphShow) {

        if(type === 'greedy'){
        let adj_matrix = this.overlap_naive(contigs, l, k);
            if(graphShow === 'beforeReduction'){
                this.createGraphFromMatrix(contigs, adj_matrix);
            }

            let path_mat = this.ajd_to_path_matrix(adj_matrix);
            this.transitive_reduction(path_mat);

            adj_matrix.map(function (value, index, matrix) {
                matrix.set(index, (path_mat.get(index) ? value : 0));
            });

            if(graphShow === 'afterReduction'){
                this.createGraphFromMatrix(contigs, adj_matrix);
            }

            return this.greedy_hpath(contigs, adj_matrix);
        } else if(type === 'suffix'){
            //TODO
            let tree = new SuffixTree('');
            for(let c of contigs) {
                tree.add(c);
            }

        } else if(type === 'dynamic'){
            //TODO
        } else {
            //TODO -? throw error?
        }
    }

    createGraphFromMatrix(contigs, adj_matrix){
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
                let currentCount = adj_matrix.get([i,j]);
                if( currentCount > 0) {
                    dataset.edges.push({source: i, target: j, count: currentCount})
                }
            }
        }
        this.rootScope.$broadcast('updateGraph', dataset);
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
        let seq = this.olc_assembly(['XTTG', 'TTGG', 'TGGT', 'TGXG', 'GGTT', 'TTGX', 'GTTG', ], 3, 4, 'greedy', 'none');
        console.log(seq);
    }
}
