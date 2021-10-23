import Benchmark from "benchmark";
import chalk from "chalk";
import {
  find_missing_int_reduce,
  find_missing_int_reduce_with_eject,
  find_missing_int_forEach,
  find_missing_int_for,
  find_missing_int_for_of,
} from "./solutions.js";

// A transducer takes a reducer and returns a reducer...
// Gets the results of the running each function in the fn array against the provided assertion values.
// ... and then passes them along to the next reducer, whatever it may be...
// Remember: the accumulator values will be in the form that the deepest nested reducer returns them in.
const getResultsTransducer = (nextReducer) => (acc, cur) => {
  const { fn, assert, input } = cur;

  const results = fn.map((x) => {
    const result = x(input) === assert ? true : x(input);
    const pass = result === true ? true : false;

    return {
      name: x.name,
      pass,
      results: [
        {
          assert,
          input,
          result,
        },
      ],
    };
  });

  // Always consider what the next reducer should exepct as a current value.
  // Very important! Remember to pass-on the accumulator as well!
  return nextReducer(acc, results);
};

// Shortens the array of results by combining results from testing the same functions more than once.
const condenseResultsTransducer = (nextReducer) => (acc, cur) => {
  // set intialValue to the accumulator
  const condencedResults = cur.reduce((x, y) => {
    const { name, pass, results } = y;
    const existing = acc.findIndex((x) => x.name === name);

    return existing !== -1
      ? [
          ...x.slice(0, existing),
          Object.assign(x[existing], {
            results: x[existing].results.concat(results),
          }),
          ...x.slice(existing + 1),
        ]
      : x.concat({ name, pass, results });
  }, acc);

  return nextReducer(condencedResults, cur);
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
  // {
  //     fn: [() => null],
  //     assert: 1,
  //     input: 2,
  //   },
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

// Takes a function to pass the accumulator to... Maybe this is unnecessary....
const foldReducer = (acc, cur) => {
  return acc;
};

// Will tell us which functions pass or fail, and the results vs. expectations for each.
const results = testCases.reduce(
  // get the results
  getResultsTransducer(
    // pivot longer
    condenseResultsTransducer(
      // fold it down
      foldReducer
    )
  ),
  []
);

results.forEach(({ name, pass, results }) => {
  console.log(
    pass
      ? chalk.green(`All clear for ${name}`)
      : console.error(
          `Something isn't right with ${chalk.blue.bgWhite.bold(name)}.`,
          `\n It failed under the following conditions:`,
          chalk.red(
            results.map(({ assert, input, result }) =>
              result !== true
                ? `\n When testing with ${chalk.cyan.bgWhite(
                    input
                  )}, expected ${chalk.green.bgWhite(
                    expected
                  )}, but returned ${chalk.red.bgWhite(result)}`
                : null
            )
          )
        )
  );
});

// Runs all solutions using a single large array test case.
const initBenchmark = ({ fn, input }) => {
  const benchmark = new Benchmark.Suite();

  fn.forEach((solution) => benchmark.add(solution.name, () => solution(input)));

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
