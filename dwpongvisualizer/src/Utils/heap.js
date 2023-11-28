
/*
Index-preserving heap utilities for partial 2D matrix sorting
Contributed by Max Milkert
*/

//number is the flattened index
var get_from_matrix = (matrix, number) => {
    let columns = matrix[0].length;
    let row = Math.floor(number / columns);
    let column = number % columns;
    return matrix[row][column];
}

// parent = i-1 // 2
//left = 2i +1
// right = 2i + 2
const max_heapify = (matrix, A, i) => {
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    let largest = i;
    if (l < A.length && get_from_matrix(matrix, A[l]) > get_from_matrix(matrix, A[largest])) {
        largest = l;
    }
    if (r < A.length && get_from_matrix(matrix, A[r]) > get_from_matrix(matrix, A[largest])) {
        largest = r;
    }
    if (largest != i) {
        let temp = A[i];
        A[i] = A[largest];
        A[largest] = temp;
        max_heapify(matrix, A, largest);
    }
}

var heap_extract_max = (matrix, A) => {
    const max = A[0];
    A[0] = A[A.length - 1];
    A.pop();
    max_heapify(matrix, A, 0);
    return max;
}

const build_max_heap = (matrix, A) => {
    let i = Math.floor(A.length / 2);
    while (i >= 0) {
        max_heapify(matrix, A, i);
        i -= 1;
    }
}

var arg_heapsort = (matrix, top_x) => {
    let A = Array.from(Array(matrix.length * matrix[0].length).keys());
    build_max_heap(matrix, A);
    let args = [];
    for (let i = 0; i < top_x; i++) {
        args.push(heap_extract_max(matrix, A));
    }
    return args;
}

// Return bool array of "significant" weights given weight strength
// Threshold is the percent ratio of total weights to render at a given time
const is_significant = (w, threshold=0.2) => {
    // Find indices of top threshold% weight values
    let render_cap = Math.floor(w.length * w[0].length * threshold);
  
    // Partial sort out the top threshold% weight indices
    let args = arg_heapsort(w, render_cap);
    let significant = args.map(x => fold_index(x, w));
  
    // Set the top indices to "true"
    let significant_w = zeros_like(w);
    for(let i = 0; i < significant.length; i++) {
        const [l1, l2] = significant[i];
        significant_w[l1][l2] = 1;
    }
    return significant_w;
  }
  
  const  fold_index = (index, matrix) => {
    const columns = matrix[0].length;
    const row = Math.floor(index / columns);
    const column = index % columns;
    return [row, column];
  }

  const zeros_like = (array) => {
    return elementApply(array, x => 0);
  }

  

const elementApply = (array, lambda) => {
    /*
    Apply function to every individual element in nested array structure
    (Base method for several numpy-esque helpers)
    */
    if(typeof(array) == "object") {
        // If the variable is an "object", we're dealing with a nested array - so recurse
        return array.map(subarray => elementApply(subarray, lambda));
    } else {
        // Base case: the array is actually a single element
        return lambda(array);
    }
  }

/*
Example consumer:
let matrix_to_sort = [[98, 97, 95, 76], [1, 2, 300.9, 4]]
args = arg_heapsort(matrix_to_sort, 3)
for (let i = 0; i < args.length; i++) {
    console.log(get_from_matrix(matrix_to_sort, args[i]))
}
*/

export {arg_heapsort, build_max_heap, heap_extract_max, max_heapify, get_from_matrix, is_significant, fold_index}