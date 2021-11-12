import R from "ramda";

// Unit tests and benchmark tests can be found in solutions.test.js

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

// Same thing as above, but using slightly more elegant syntax.
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

// Slow reduce with unnecessary filter in the chain.
export function basic_chained_reduce(A) {
  return A.filter((n) => n > 0)
    .sort((a, b) => a - b)
    .reduce((prev, n) => (n === prev ? n + 1 : prev), 1);
}

// Removes the filter step
// Looks like crap, but simply encorporates the check from the filter into a ternery that returns the accumulator if n < 0
export function optimized_reduce(A) {
  return A.sort((a, b) => a - b).reduce(
    (prev, n) => (n > 0 ? (n === prev ? n + 1 : prev) : prev),
    1
  );
}

// This one feels a bit hacky,
// but it will early eject from the reduce
// if the first element is greater than 1.
export function optimized_reduce_with_eject(A) {
  return A.sort((a, b) => a - b).reduce((prev, n, i, arr) => {
    if (arr[0] > 1) arr.splice(1);

    return n > 0 ? (n === prev ? n + 1 : prev) : prev;
  }, 1);
}

export function ramda_reduce(A) {
  const transformer = R.compose(
    R.reduce((prev, n) => (n === prev ? n + 1 : prev), 1),
    R.sort((a, b) => a - b),
    R.filter((n) => n > 0)
  );

  return transformer(A);
}

export function optimized_ramda_reduce(A) {
  const transformer = R.compose(
    R.reduce((prev, n) => (n > 0 ? (n === prev ? n + 1 : prev) : prev), 1),
    R.sort((a, b) => a - b)
  );

  return transformer(A);
}

export function ramda_transduce(A) {
  return R.transduce(
    R.filter((n) => n > 0),
    (prev, n) => (n === prev ? n + 1 : prev),
    1,
    R.sort((a, b) => a - b, A)
  );
}
