import Benchmark from "benchmark";
import chalk from "chalk";
import {
  find_missing_int_reduce,
  find_missing_int_reduce_with_eject,
  find_missing_int_forEach,
  find_missing_int_for,
  find_missing_int_for_of,
} from "./solutions.js";

// Returns the input if the test doesn't pass.
const expect = (fn, expected, ...inputs) => {
  const result = fn(...inputs);

  return result === expected ? null : result;
};

function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
}

const runUnitTests = (testCases) =>
  testCases.reduce(
    (acc, { input, assert, run }) => {
      const results = run.reduce(
        (acc, test) => {
          const name = test.name;
          const result = expect(test, assert, input); // Get the result

          result
            ? acc.fail.push({
                name: name,
                cases: [{ input: input, expected: assert, result: result }],
              })
            : acc.pass.push(name);

          return acc;
        },
        { pass: [], fail: [] }
      );

      return {
        pass: acc.pass
          .concat(results.pass)
          .filter((el, i, a) => a.indexOf(el) === i), // Remove duplicates
        fail: acc.fail.concat(results.fail).reduce((bcc, cur) => {
          // The same test can fail for different input cases.
          // This reduces each failing case into a single array.
          const alreadyFailed = bcc.findIndex((el) => el.name === cur.name);

          if (alreadyFailed >= 0) bcc[alreadyFailed].cases.push(...cur.cases);

          return [...bcc, cur];
        }, []),
      };
    },
    { pass: [], fail: [] }
  );

const runBenchmark = ({ input, assert, run }) => {
  const benchmark = new Benchmark.Suite();

  run.forEach((solution) =>
    benchmark.add(solution.name, () => expect(solution, assert, input))
  );

  benchmark
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log(
        `According to the benchmark, the most performant solution seems to be the ${this.filter(
          "fastest"
        ).map("name")}.`
      );
    })
    .run();
};

const find_missing_int = [
  find_missing_int_reduce,
  find_missing_int_reduce_with_eject,
  find_missing_int_forEach,
  find_missing_int_for,
  find_missing_int_for_of,
];

const benchmark_find_missing_int = {
  // A big array, which won't eject with 1.
  input: Array.from({ length: 456789 }, (_, i) => i - 123),
  assert: 456789 - 123,
  run: find_missing_int,
};

const unitTestCases = [
  {
    input: [1, 3, 6, 4, 1, 2],
    assert: 5,
    run: find_missing_int,
  },
  {
    input: [1, 2, 3],
    assert: 4,
    run: find_missing_int,
  },
  {
    input: [0, 3, 5],
    assert: 1,
    run: find_missing_int,
  },
  {
    input: [-1, -3],
    assert: 1,
    run: find_missing_int,
  },
  {
    input: [8, -1, 7],
    assert: 1,
    run: find_missing_int,
  },
  {
    // A bigger array, starting at 20.
    input: Array.from({ length: 1000 }, (_, i) => i + 20),
    assert: 1,
    run: find_missing_int,
  },
  // benchmark_find_missing_int,
];

// Runs all solutions using multiple test cases.
const results = runUnitTests(unitTestCases);

results.pass.forEach((name) =>
  console.log(chalk.green(`All clear for ${name}`))
);

results.fail.forEach(({ name, cases }) => {
  return console.error(
    chalk.red(
      `Something isn't right with ${chalk.blue.bgWhite.bold(name)}.`,
      `\n It failed under the following conditions:`,
      cases.map(
        ({ input, expected, result }) =>
          `\n When testing with ${chalk.cyan.bgWhite(
            input
          )}, expected ${chalk.green.bgWhite(
            expected
          )},but returned ${chalk.red.bgWhite(result)}.`
      )
    )
  );
});

// Runs all solutions using a single test case.
runBenchmark(benchmark_find_missing_int);

let assertions;

// =============================================
//
// Challenge: Recursively replace all abb with baa

assertions = [
  { input: "ababb", output: "baaaa" }, // 2x
  { input: "abbbabb", output: "babaaaa" }, // 3x
  { input: "aaabab", output: "aaabab" }, // 1x
];

// =============================================
//
// Challenge: Find the largest binary gap length of an integer

assertions = [
  { input: 1041, output: 5 },
  { input: 32, output: 0 },
  { input: 529, output: 4 },
];

// assertions
//   .map(({ input, output }) => expect(solution, input, output))
//   .map(console.log);

// =============================================
//
// Challenge: Rotate an array K times

assertions = [
  { input: { A: [3, 8, 9, 7, 6], K: 3 }, output: [9, 7, 6, 3, 8] },
  { input: { A: [0, 0, 0], K: 1 }, output: [0, 0, 0] },
  { input: { A: [1, 2, 3, 4], K: 4 }, output: [1, 2, 3, 4] },
  { input: { A: [], K: 1 }, output: [] },
];

// assertions.map(({ input, output }) =>
//   expect(({ A, K }) => solution(A, K), input, output)
// );

// =============================================
//
// Challenge: Frog stepping
assertions = [
  {
    input: { x: 5, a: [3] },
    output: -1,
  },
  {
    input: { x: 1, a: [1] },
  },
  {
    input: { x: 2, a: [2, 2, 2, 2, 2] },
    output: -1,
  },
  {
    input: { x: 5, a: [1, 3, 1, 4, 2, 3, 5, 4] },
  },
];

// =============================================
//
// Count bounded slices

// =============================================
//
// Tree traversal to return maximum height

// =============================================
//
// Incomplete: convert integers to strings of As and Bs

const curry = (fn, x) => (y) => fn(x, y);
// const curriedSolution = curry(solution, 20);

// a = 5 / 5 'a's
// b = 3 / 3 'b's
// return "aabaabab"

// console.log(expect(curriedSolution, "", 17));

// =============================================
//
// Inversion counting

//  A[0] = -1 A[1] = 6 A[2] = 3
//  A[3] =  4 A[4] = 7 A[5] = 4
//
// there are four inversions:
// (1,2)  (1,3)  (1,5)  (4,5)
// so the function should return 4.

// [-1, 6, 3, 4, 7, 4] // Starting array
// [-1, 3, 6, 4, 7, 4] // (1, 2) [6, 3]
// [-1, 3, 4, 6, 7, 4] // (1, 3) [6, 4]
// [-1, 3, 4, 4, 7, 6] // (1, 5) [6, 7]
// [-1, 3, 4, 4, 6, 7] // (4, 5) [7, 4]

// console.log(expect(_solution, 4, [-1, 6, 3, 4, 7, 4]));
