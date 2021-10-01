function solution_reduce(A) {
  return A.filter((n) => n > 0)
    .sort((a, b) => a - b)
    .reduce((prev, n, i) => (n === prev ? n + 1 : prev), 1);
}

function solution_reduce_with_eject(A) {
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

function solution_forEach(A) {
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
function solution_for(A) {
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

function solution_for_of(A) {
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

export default [
  solution_for,
  solution_forEach,
  solution_reduce,
  solution_reduce_with_eject,
  solution_for_of,
];
