import R from "ramda";

// Unit tests and benchmark tests can be found in solutions.test.js

export function classic_for(A) {
  A = A.sort((a, b) => a - b);

  let x = 1;

  for (let i = 0; i < A.length; i++) {
    if (x < A[i]) {
      return x;
    } else if (A[i] > 0) {
      x = A[i] + 1;
    }
  }

  return x;
}

export function es6_for_of(A) {
  A = A.sort((a, b) => a - b);

  let x = 1;

  for (const n of A) {
    if (x < n) {
      return x;
    } else if (n > 0) {
      x = n + 1;
    }
  }

  return x;
}

export function es6_forEach(A) {
  let x = 1;

  A.sort((a, b) => a - b).forEach((n) => {
    if (x < n) {
      return x;
    } else if (n > 0) {
      x = n + 1;
    }
  });

  return x;
}

export function es6_reduce(A) {
  return A.sort((a, b) => a - b).reduce(
    (prev, n) => (n > 0 ? (n === prev ? n + 1 : prev) : prev),
    1
  );
}

// This one feels a bit hacky,
// but it will early eject from the reduce
// if the first element is greater than 1.
export function es6_reduce_eject(A) {
  return A.sort((a, b) => a - b).reduce((prev, n, i, arr) => {
    arr[0] > 1 && arr.splice(1);

    return n > 0 ? (n === prev ? n + 1 : prev) : prev;
  }, 1);
}

export function ramda_reduce(A) {
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
