# Benchmarking different approaches to a Codility challenge.

From the challenge...

> Write a function that, given an array A of N integers, returns the smallest positive integer (greater than 0) that does not occur in A. 
> For example, given A = [1, 3, 6, 4, 1, 2], the function should return 5.
>
> - Given A = [1, 2, 3], the function should return 4.
> - Given A = [−1, −3], the function should return 1.
>   Write an efficient algorithm for the following assumptions:
> - N is an integer within the range [1..100,000];
> - each element of array A is an integer within the range [−1,000,000..1,000,000].

##### The five solution approaches (`for` loop, `for...of`, `Array.reduce`, `Array.reduce` with a twist, and `Array.forEach`) can be found in `solutions.js`. You can run the tests for yourself using the commands below.

```
npm install
npm run test
```

### Using a small array: `[1, 3, 6, 4, 1, 2]`

```
for loop x 2,823,088 ops/sec ±1.27% (89 runs sampled)
for...of x 2,864,932 ops/sec ±0.87% (89 runs sampled)
Array.reduce (without early eject) x 2,730,170 ops/sec ±1.03% (85 runs sampled)
Array.reduce (with early eject) x 2,841,078 ops/sec ±0.55% (96 runs sampled)
Array.forEach x 2,810,916 ops/sec ±0.33% (94 runs sampled)
Using the smaller array, the fastest solution is the for...of,for loop.
```

### Using a small array: `Array.from({ length: 1000 }, (_, i) => i + 3600)`

```
for loop x 44,578 ops/sec ±3.02% (87 runs sampled)
for...of x 45,627 ops/sec ±1.51% (92 runs sampled)
Array.reduce (without early eject) x 34,784 ops/sec ±4.08% (93 runs sampled)
Array.reduce (with early eject) x 24,447 ops/sec ±1.65% (91 runs sampled)
Array.forEach x 34,762 ops/sec ±3.28% (93 runs sampled)
Using the larger array, the fastest solution is the for...of,for loop.
```
