const { each } = require("jquery");

class Graph {
    
}
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
    return adj_matrix;
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

olc_assembly(['aatattt', 'attttat'], 3, 5);
