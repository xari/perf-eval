// Codility challenge solutions from my week practice week.
// Unit tests and benchmark tests can be found in solutions.test.js

// =============================================
//
// Find the first integer that isn't in the array.

export function find_missing_int_reduce(A) {
  return A.filter((n) => n > 0)
    .sort((a, b) => a - b)
    .reduce((prev, n, i) => (n === prev ? n + 1 : prev), 1);
}

export function find_missing_int_reduce_with_eject(A) {
  return A.filter((n) => n > 0)
    .sort((a, b) => a - b)
    .reduce((prev, n, i, arr) => {
      // This part feels a bit hacky,
      // but it will early eject from the reduce
      // if the first element is greater than 1.
      if (arr[0] !== 1) arr.splice(1);

      return n === prev ? n + 1 : prev;
    }, 1);
}

export function find_missing_int_forEach(A) {
  let x = 1;

  A.filter((n) => n > 0)
    .sort((a, b) => a - b)
    .forEach((n) => {
      if (x < n) {
        return x;
      }
      x = n + 1;
    });

  return x;
}

// This solution was taken from the StackOverflow answer below:
// https://stackoverflow.com/a/56969919
export function find_missing_int_for(A) {
  A = A.filter((x) => x >= 1).sort((a, b) => a - b);

  let x = 1;

  for (let i = 0; i < A.length; i++) {
    // if we find a smaller number no need to continue, cause the array is sorted
    if (x < A[i]) {
      return x;
    }
    x = A[i] + 1;
  }

  return x;
}

export function find_missing_int_for_of(A) {
  A = A.filter((x) => x >= 1).sort((a, b) => a - b);

  let x = 1;

  for (const n of A) {
    if (x < n) {
      return x;
    }
    x = n + 1;
  }

  return x;
}

// =============================================
//
// Recursively replace all abb with baa

export function recursively_regex(S) {
  return S.match("abb") === null ? S : solution(S.replace(/abb/g, "baa"));
}

export function while_replace_regex(S) {
  let newS = S;

  while (newS.match("abb")) {
    newS = newS.replace(/abb/g, "baa");
  }

  return newS;
}

// =============================================
//
// Find the largest binary gap length of an integer

export function find_gap_length(N) {
  const gapLengths = (N >>> 0) // Convert to binary
    .toString(2) // Convert to binary
    .replace(/^0+|0+$/g, "") // Remove 0s on either end
    .split("1") // get the binary gaps (just the 0s)
    .filter(Boolean) // Remove the empty strings
    .map((gap) => gap.length); // (ex. "000" => 3)

  return gapLengths.length
    ? gapLengths.reduce((acc, cur) => (cur > acc ? cur : acc))
    : 0;
}

// =============================================
//
// Rotate an array K times

export function rotate_array(A, K) {
  if (A.length > 0) {
    for (let i = 0; i < K; i++) {
      A.unshift(A.pop());
    }
  }

  return A;
}

// =============================================
//
// Frog step... (How long until all steps appear?)

export function find_earliest_completion(X, A) {
  const all_steps = Array.from({ length: X }, (_, i) => i + 1);

  const sorted = A.map((n, i) => ({ n: n, i: i }))
    .filter((step) => step.n <= X)
    .sort((step1, step2) => step2.i - step1.i); // Sort by reversed index order... This reversed order is importand because the way that we create the unique values array below will simply look for the last instance of the value in the array.

  const unique = [...new Map(sorted.map((item) => [item["n"], item])).values()];

  return all_steps.every(
    (step) => unique.map((withI) => withI.n).indexOf(step) !== -1
  )
    ? unique.reduce((acc, step) => (step.n === X ? step.i : acc))
    : -1;
}

// =============================================
//
// Count the bounded slices of an array... This solution is O(N ** 3)

export function count_bounded_slices(K, A) {
  const bounded_slices = [];

  for (let i = 0; i < A.length; i++) {
    let j = i + 1;

    while (j <= A.length) {
      const slice = A.slice(i, j);
      const min = Math.min(...slice);
      const max = Math.max(...slice);

      if (Math.abs(min - max) <= K) {
        bounded_slices.push([i, j]);
      } else {
        break;
      }

      j++;
    }
  }

  return bounded_slices.length;
}

// =============================================
//
// Tree traversal to return maximum tree height

export function get_tree_height(T) {
  const queue = T == null ? [] : [{ t: T, i: 0 }];
  const heights = [];

  while (queue.length) {
    const current = queue.shift();

    heights.push(current.i);

    if (current.t.l) {
      queue.push({ t: current.t.l, i: current.i + 1 });
    }

    if (current.t.r) {
      queue.push({ t: current.t.r, i: current.i + 1 });
    }
  }

  return T == null ? -1 : Math.max(...heights);
}

// =============================================
//
// Incomplete: convert integers to strings of As and Bs
// This one has an issue with the rounding.... It doesn't account for uneven leftover amounts of letters... It should be fixed to be able to concat either more or less than the default number of letters, depending on how many of the other numbers are left to be popped.

export function get_a_b_string(A, B) {
  const As = "a".repeat(A).split("");
  const Bs = "b".repeat(B).split("");
  const letters = A >= B ? [...As, ...Bs] : [...Bs, ...As];
  const spliceThisMany = Math.min(
    2,
    Math.round(Math.max(A, B) / Math.min(A, B))
  );

  let resultString = "";

  while (letters.length) {
    resultString = resultString.concat(
      letters.splice(0, spliceThisMany).join("")
    );

    const popped = letters.pop();

    // Check first in case there aren't any leftover letters.
    popped ? (resultString = resultString.concat(popped)) : null;
  }

  return resultString;
}

// =============================================
//
// Inversion counting

export function count_inversions_bubble(A) {
  let inversionCount = 0;
  let clear = false;

  while (clear !== true) {
    clear = true;

    for (let i = 0; i < A.length; i++) {
      const slice = A.slice(i, i + 2);

      if (slice[0] > slice[1]) {
        A.splice(i, 2, ...slice.reverse());
        clear = false;
        inversionCount = inversionCount + 1;
      }
    }
  }

  let i = 0;
  let queue = [A.slice(i, i + 2)];

  while (queue.length) {
    if (slice[0] > slice[1]) {
      A.splice(i, 2, ...slice.reverse());
    }

    i++;
    queue.push([A.slice(i, i + 2)]);
  }

  return inversionCount > 1000000000 ? -1 : inversionCount;
}

export function count_inversions_bubble_queue(A) {
  let inversionCount = 0;
  let i = 0;
  let queue = [A.slice(i, i + 2)];

  while (queue.length) {
    if (slice[0] > slice[1]) {
      A.splice(i, 2, ...slice.reverse());
    }

    i++;
    queue.push([A.slice(i, i + 2)]);
  }

  return inversionCount > 1000000000 ? -1 : inversionCount;
}

export function count_inversions_insertion(A) {
  let inversionCount = 0;

  for (let i = 1; i < A.length; i++) {
    // Look through all previous items until beginning of array...
    for (let j = i - 1; j > -1; j--) {
      // and compare each item with the one ahead of it.
      if (A[j + 1] < A[j]) {
        // Swap via destructuring.
        [A[j + 1], A[j]] = [A[j], A[j + 1]];

        inversionCount = inversionCount + 1;
      }
    }
  }

  return inversionCount > 1000000000 ? -1 : inversionCount;
}

export function count_inversions_selection(A) {
  let inversionCount = 0;
  let min;

  for (let i = 0; i < A.length; i++) {
    // Min will never be less than i
    min = i;

    // Pass through all remaining values in the array
    // and update the min if a value is larger than the min.
    for (let j = i + 1; j < A.length; j++) {
      if (A[j] < A[min]) {
        min = j;
      }
    }

    if (min !== i) {
      [A[i], A[min]] = [A[min], A[i]];

      inversionCount = inversionCount + 1;
    }
  }

  return inversionCount > 1000000000 ? -1 : inversionCount;
}

// Incomplete: Count inversions via merge sort...

function merge({ left, iL }, { right, iR }) {
  let arr = [];
  let inversions = iL + iR;

  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the smaller among the smallest element of left and right sub arrays
    if (left[0] < right[0]) {
      arr.push(left.shift());
    } else {
      arr.push(right.shift());
    }
  }

  // Concatenating the leftover elements
  // (in case we didn't go through the entire left or right array)
  return { a: [...arr, ...left, ...right], i: inversions };
}

function mergeSort(A) {
  const half = A.length / 2;

  // Base case or terminating case
  if (A.length < 2) {
    return A;
  }

  const left = A.splice(0, half);

  return merge(mergeSort(left), mergeSort(A));
}

export function count_inversions_merge(A) {
  const sorted = mergeSort(A);
  console.log(sorted);

  return inversionCount > 1000000000 ? -1 : inversionCount;
}
