# JSBench

A very small javascript benchmarks, rely on thunks.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

## [thunks](https://github.com/thunks/thunks)

## Install

**Node.js:**

    npm install jsbench

## DEMO

```sh
➜  jsbench git:(master) npm test

> jsbench@1.0.1 test /Users/zensh/git/js/jsbench
> standard && node bench/index

Async Benchmark...

JSBench Start, 1000 cycles:
Test Promise...
Test co...
Test thunks-generator...
Test bluebird...
Test when...
Test RSVP...
Test async...
Test thenjs...
Test thunks...

JSBench Results:
Promise: 1000 cycles, 16.546 ms/cycle, 60.438 ops/sec
co: 1000 cycles, 15.465 ms/cycle, 64.662 ops/sec
RSVP: 1000 cycles, 10.85 ms/cycle, 92.166 ops/sec
bluebird: 1000 cycles, 9.733 ms/cycle, 102.743 ops/sec
when: 1000 cycles, 8.251 ms/cycle, 121.197 ops/sec
async: 1000 cycles, 5.566 ms/cycle, 179.662 ops/sec
thunks: 1000 cycles, 5.156 ms/cycle, 193.949 ops/sec
thenjs: 1000 cycles, 4.986 ms/cycle, 200.562 ops/sec
thunks-generator: 1000 cycles, 4.919 ms/cycle, 203.293 ops/sec

Promise: 100%; co: 106.99%; RSVP: 152.50%; bluebird: 170.00%; when: 200.53%; async: 297.27%; thunks: 320.91%; thenjs: 331.85%; thunks-generator: 336.37%;

JSBench Completed!
```

## API

### JSBench.prototype.add(testName, testFn)

添加测试。

+ **testName**：String，测试名称
+ **testFn**：Function，可以为普通同步函数，thunk 异步函数或 generator 异步函数

### JSBench.prototype.on(eventName, listener)

添加事件监听，可选，未添加事件监听时使用内部默认的事件监听。

+ **eventName**：String，事件名称，目前共有三种事件：`error`, `cycle`, `complete`。
+ **listener**：Function，function (event) {}

**error**: 任何内部同步或异步错误均会触发，event 为 `{name: testName, error: error}`

**cycle**: 每一个测试的每一次循环结束后触发，event 为 `{name: testName, cycle: cycleCount, time: time}`，其中 `time` 为该循环耗时ms

**complete**: 所有测试完成后触发，event 为 `{result: result, ranking: testArray}`，其中 result 为测试结果对比，ranking为按测试结果排序的数组，包含每个测试的详细信息。

### JSBench.prototype.run([cycles])

开始测试。各个测试异步串行执行，即完成一个测试后才会开始下一个。每个测试的循环测试也为异步串行执行。返回 thunk。

+ **cycles**：Number，可选，每个测试主体循环测试的次数，默认为 10


[npm-url]: https://npmjs.org/package/jsbench
[npm-image]: http://img.shields.io/npm/v/jsbench.svg

[travis-url]: https://travis-ci.org/zensh/jsbench
[travis-image]: http://img.shields.io/travis/zensh/jsbench.svg

[downloads-url]: https://npmjs.org/package/jsbench
[downloads-image]: http://img.shields.io/npm/dm/jsbench.svg?style=flat-square
