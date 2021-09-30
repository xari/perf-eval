import Benchmark from "benchmark";
import chalk from "chalk";
import Solutions from "./solutions.js";

// Returns the input if the test doesn't pass.
const expect = (fn, input, expected, label) => {
  const result = fn(input);

  return result === expected ? null : result;
};

const runUnitTests = (testCases) =>
  Solutions.map((test) => ({
    name: test.name,
    result: testCases.filter(({ input, validate_with }) =>
      expect(test, input, validate_with)
    ),
  })).forEach(({ name, result }) =>
    result.length
      ? console.error(chalk.red(`Something isn't right with ${name}.`))
      : console.log(chalk.green(`All clear for ${name}`))
  );

const runBenchmark = ({ input, validate_with }) => {
  const benchmark = new Benchmark.Suite();

  Solutions.forEach((solution) =>
    benchmark.add(solution.name, () => expect(solution, input, validate_with))
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

const benchmarkTestCase = {
  // A big array, which won't eject with 1.
  input: Array.from({ length: 456789 }, (_, i) => i - 123),
  validate_with: 456789 - 123,
};

const unitTestCases = [
  {
    input: [1, 3, 6, 4, 1, 2],
    validate_with: 5,
  },
  {
    input: [1, 2, 3],
    validate_with: 4,
  },
  {
    input: [0, 3, 5],
    validate_with: 1,
  },
  {
    input: [-1, -3],
    validate_with: 1,
  },
  {
    input: [8, -1, 7],
    validate_with: 1,
  },
  {
    // A bigger array, starting at 20.
    input: Array.from({ length: 1000 }, (_, i) => i + 20),
    validate_with: 1,
  },
  benchmarkTestCase,
];

// Runs all solutions using multiple test cases.
runUnitTests(unitTestCases);

// Runs all solutions using a single test case.
runBenchmark(benchmarkTestCase);
