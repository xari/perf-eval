import Benchmark from "benchmark";
import R from "ramda";
import chalk from "chalk";
import * as solutions from "./solutions.js";

const benchmark_find_missing_int = {
  // A big array, which shouldn't eject with 1.
  assert: 456789 - 123,
  input: Array.from({ length: 456789 }, (_, i) => i - 123),
};

const testCases = [
  {
    assert: 5,
    input: [1, 3, 6, 4, 1, 2],
  },
  {
    assert: 4,
    input: [1, 2, 3],
  },
  {
    assert: 1,
    input: [0, 3, 5],
  },
  {
    assert: 1,
    input: [-1, -3],
  },
  {
    assert: 1,
    input: [8, -1, 7],
  },
  //   {
  //     // A bigger array, starting at 20.
  //     assert: 1,
  //     input: Array.from({ length: 1000 }, (_, i) => i + 20),
  //   },
  // benchmark_find_missing_int,
];

const getResult = (fn, { assert, input }) => {
  const result = fn(input);
  const pass = result === assert ? true : false;
  const data = [
    {
      assertion: assert,
      input,
      result,
    },
  ];

  return {
    name: fn.name,
    pass,
    data,
  };
};

const condenseResults = (acc, { name, pass, data }) => {
  const existing = acc.findIndex((x) => x.name === name);

  if (existing !== -1) {
    pass = acc[existing].pass === false ? false : pass;
    data = [...acc[existing].data, ...data];
  }

  const result = {
    name,
    pass,
    data,
  };

  return existing !== -1
    ? [...acc.slice(0, existing), result, ...acc.slice(existing + 1)]
    : acc.concat(result);
};

let results = R.chain(
  (fn) => R.map((testCase) => getResult(fn, testCase), testCases),
  Object.values(solutions)
);

results = R.reduce(condenseResults, [], results);

results.forEach(({ name, pass, data }) => {
  pass
    ? console.log(chalk.green(`All clear for ${name}`))
    : console.error(
        `Something isn't right with ${chalk.blue.bgWhite.bold(name)}.`,
        `\n It failed under the following conditions:`,
        chalk.red(
          data.map(
            ({ assertion, input, result }) =>
              `\n When testing with ${chalk.cyan.bgWhite(
                input
              )}, expected ${chalk.green.bgWhite(
                assertion
              )}, but returned ${chalk.red.bgWhite(result)}`
          )
        )
      );
});

// Runs all solutions using a single large array test case.
const initBenchmark = (solutions, { input }) => {
  const benchmark = new Benchmark.Suite();

  solutions.forEach((solution) =>
    benchmark.add(solution.name, () => solution(input))
  );

  return benchmark;
};

const benchmark = initBenchmark(
  Object.values(solutions),
  benchmark_find_missing_int
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
