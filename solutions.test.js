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
const expect = (fn, assert, ...inputs) => {
  const result = fn(...inputs);

  return result === assert ? true : result;
};

// Runs the tests, and returns an object.
const test = ({ fn, assert, input }) =>
  fn.map((x) => ({
    name: x.name,
    input: input,
    expected: assert,
    result: expect(x, assert, input),
  }));

const reduceResults = (acc, { name, result, ...rest }) => {
  const existingPass = acc.pass.findIndex((testCase) => testCase.name === name);
  const existingFail = acc.fail.findIndex((testCase) => testCase.name === name);

  // true == the test passed
  if (result === true && existingFail === -1) {
    existingPass !== -1
      ? acc.pass.splice(existingPass, 1, { name })
      : acc.pass.push({ name });
  } else {
    if (existingPass !== -1) acc.pass.splice(existingPass, 1);

    existingFail !== -1
      ? acc.fail.splice(existingFail, 1, {
          name,
          details: [...acc.fail[existingFail].details, { result, ...rest }],
        })
      : acc.fail.push({ name, details: [{ result, ...rest }] });
  }

  return acc;
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
  fn: find_missing_int,
  assert: 456789 - 123,
  input: Array.from({ length: 456789 }, (_, i) => i - 123),
};

const testCases = [
  {
    fn: find_missing_int,
    assert: 5,
    input: [1, 3, 6, 4, 1, 2],
  },
  {
    fn: find_missing_int,
    assert: 4,
    input: [1, 2, 3],
  },
  {
    fn: find_missing_int,
    assert: 1,
    input: [0, 3, 5],
  },
  {
    fn: find_missing_int,
    assert: 1,
    input: [-1, -3],
  },
  {
    fn: find_missing_int,
    assert: 1,
    input: [8, -1, 7],
  },
  {
    // A bigger array, starting at 20.
    fn: find_missing_int,
    assert: 1,
    input: Array.from({ length: 1000 }, (_, i) => i + 20),
  },
  benchmark_find_missing_int,
];

const results = testCases.flatMap(test).reduce(reduceResults, {
  pass: [],
  fail: [],
});

results.pass.forEach(({ name }) =>
  console.log(chalk.green(`All clear for ${name}`))
);

results.fail.forEach(({ name, details }) => {
  console.error(
    `Something isn't right with ${chalk.blue.bgWhite.bold(name)}.`,
    `\n It failed under the following conditions:`,
    chalk.red(
      details.map(
        ({ input, expected, result }) =>
          `\n When testing with ${chalk.cyan.bgWhite(
            input
          )}, expected ${chalk.green.bgWhite(
            expected
          )}, but returned ${chalk.red.bgWhite(result)}`
      )
    )
  );
});

// Runs all solutions using a single large array test case.
const initBenchmark = ({ fn, assert, input }) => {
  const benchmark = new Benchmark.Suite();

  fn.forEach((solution) =>
    benchmark.add(solution.name, () => expect(solution, assert, input))
  );

  return benchmark;
};

const benchmark = initBenchmark(benchmark_find_missing_int);

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
