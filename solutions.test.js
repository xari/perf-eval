import Benchmark from "benchmark";

import {
  solution_for,
  solution_forEach,
  solution_reduce,
  solution_reduce_with_eject,
  solution_for_of,
} from "./solutions.js";

const test = (fn, A, n) => fn(A) === n;

const smallerArrayBenchmark = new Benchmark.Suite();
const smallerArray = [1, 3, 6, 4, 1, 2];
const smallerValidation = 5;

smallerArrayBenchmark
  .add("for loop", function () {
    test(solution_for, smallerArray, smallerValidation);
  })
  .add("for...of", function () {
    test(solution_for_of, smallerArray, smallerValidation);
  })
  .add("Array.reduce (without early eject)", function () {
    test(solution_reduce, smallerArray, smallerValidation);
  })
  .add("Array.reduce (with early eject)", function () {
    test(solution_reduce_with_eject, smallerArray, smallerValidation);
  })
  .add("Array.forEach", function () {
    test(solution_forEach, smallerArray, smallerValidation);
  })
  // add listeners
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log(
      `Using the smaller array, the fastest solution is the ${this.filter(
        "fastest"
      ).map("name")}.`
    );
  })
  .run();

const largerArrayBenchmark = new Benchmark.Suite();
const largerArray = Array.from({ length: 1000 }, (_, i) => i + 3600);
const largerValidation = 3701;

largerArrayBenchmark
  .add("for loop", function () {
    test(solution_for, largerArray, largerValidation);
  })
  .add("for...of", function () {
    test(solution_for_of, largerArray, largerValidation);
  })
  .add("Array.reduce (without early eject)", function () {
    test(solution_reduce, largerArray, largerValidation);
  })
  .add("Array.reduce (with early eject)", function () {
    test(solution_reduce_with_eject, largerArray, largerValidation);
  })
  .add("Array.forEach", function () {
    test(solution_forEach, largerArray, largerValidation);
  })
  // add listeners
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log(
      `Using the larger array, the fastest solution is the ${this.filter(
        "fastest"
      ).map("name")}.`
    );
  })
  .run();

// test([1, 3, 6, 4, 1, 2], 5) |> console.log;
// test([1, 2, 3], 4) |> console.log;
// test([0, 3, 5], 1) |> console.log;
// test([-1, -3], 1) |> console.log;
// test([8, -1, 7], 1) |> console.log;
