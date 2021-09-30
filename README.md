# Benchmarking different approaches to a developer interview challenge.

From the challenge description...

> Write a function that, given an array A of N integers, returns the smallest positive integer (greater than 0) that does not occur in A. 
> For example, given A = [1, 3, 6, 4, 1, 2], the function should return 5.
>
> - Given A = [1, 2, 3], the function should return 4.
> - Given A = [−1, −3], the function should return 1.
>   Write an efficient algorithm for the following assumptions:
> - N is an integer within the range [1..100,000];
> - each element of array A is an integer within the range [−1,000,000..1,000,000].

The five solution approaches (`solution_for`, `solution_forEach`, `solution_reduce`, `solution_reduce_with_eject`, `solution_for_of`) can be found in `solutions.js`.
You can run the tests for yourself using the commands below.

```
npm install
npm run test
```

## Benchmarking

Running each solution with an array of length `456789`, the `for` loop appears to be the most performant.

```
> solution_for x 53.59 ops/sec ±1.50% (69 runs sampled)
> solution_for_of x 52.65 ops/sec ±1.53% (68 runs sampled)
> solution_forEach x 32.76 ops/sec ±1.30% (58 runs sampled)
> solution_reduce x 32.44 ops/sec ±1.26% (57 runs sampled)
> solution_reduce_with_eject x 31.98 ops/sec ±1.17% (56 runs sampled)
> According to the benchmark, the most performant solution seems to be the solution_for.
```

I'm still trying to wrap my head around the performance metrics for loops vs. Array methods in JS.
The [Benchmarking JavaScript](https://www.youtube.com/watch?v=g0ek4vV7nEA) talk by Vyacheslav Egorov from GOTO 2015 makes it sound less straigtforward than the above benchmark makes it seem.

The benchmark below uses the same array as the one above, but this time it starts at `123`, which will trigger the early `return` for the solutions that account for this.

```
> solution_for_of x 39.50 ops/sec ±1.37% (53 runs sampled)
> solution_for x 39.29 ops/sec ±0.86% (52 runs sampled)
> solution_forEach x 33.30 ops/sec ±1.26% (58 runs sampled)
> solution_reduce x 33.10 ops/sec ±1.35% (58 runs sampled)
> solution_reduce_with_eject x 29.01 ops/sec ±1.16% (52 runs sampled)
> According to the benchmark, the most performant solution seems to be the solution_for_of.
```

Interestingly, providing the early `return` in the `solution_reduce_with_eject` seems to have lowered the overall performance of this function vs. the simple `reduce`-based solution that doesn't offer the early `return`.
