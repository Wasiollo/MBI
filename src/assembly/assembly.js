const { each } = require("jquery");
const { randomBates, max, range } = require("d3");


function makeArray(w, h, val) {
    var arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}


function olc_assembly(contigs, l, k) {
    let adj_matrix =  overlap_naive(contigs, l, k);
    return greedy_hpath(contigs, adj_matrix);
}

function overlap_naive(contigs, l, k) { // l - minimal overlap size ; k - maximal overlap size
    var adj_matrix = makeArray(contigs.length, contigs.length, 0);
    for(var suf_i = 0; suf_i < contigs.length; suf_i++) {
        for(var pre_i = 0; pre_i < contigs.length; pre_i++) {
            
            if(contigs[suf_i] != contigs[pre_i]) {
                var index = contigs[suf_i].lastIndexOf(contigs[pre_i].slice(0, l));
                if(index == -1) {
                    continue;
                } else if (index == contigs[suf_i].length - l) {
                    adj_matrix[suf_i][pre_i] = l;
                } else if (index < contigs[suf_i].length - l && (contigs[suf_i].length - index) < k) {
                    if(contigs[suf_i].endsWith(contigs[pre_i].slice(0, contigs[suf_i].length - index))) {
                        adj_matrix[suf_i][pre_i] = contigs[suf_i].length - index;
                    }
                }
            }
        } 
    }

    return adj_matrix;
}

function greedy_hpath(contigs, adj_matrix) {
    let k_lenght = contigs[0].length
    let first_index = Math.round(Math.random() * k_lenght);
    
    let sequence = contigs[first_index];
    let remaining_indexes = range(0, contigs.length);
    const indx = remaining_indexes.indexOf(first_index);
    remaining_indexes.splice(indx, 1);
    let last_index = first_index;
    while(remaining_indexes.length != 0) {
        let max_index = -1;
        let max_overlap = -1;
        for(let i of remaining_indexes) {
            if (adj_matrix[last_index][i] > max_overlap) {
                max_overlap = adj_matrix[last_index][i];
                max_index = i;
            }
        }
        if(max_index != -1) {
            const indx = remaining_indexes.indexOf(max_index)
            remaining_indexes.splice(indx, 1);
            sequence += contigs[max_index].slice(max_overlap, k_lenght);
    
            last_index = max_index;
        } else {
            break;
        }
    }

    return sequence;

}

let seq = olc_assembly(['XTTG', 'TTGG', 'TGGT', 'TGXG', 'GGTT', 'TTGX', 'GTTG', 'XGXT', 'GXGX'], 2, 4);
console.log(seq);
