JSBench 0.5.0 [![Build Status](https://travis-ci.org/zensh/jsbench.svg)](https://travis-ci.org/zensh/jsbench)
=======

A every small javascript benchmarks, rely on thunks.

## [thunks](https://github.com/thunks/thunks)

## Install

**Node.js:**

    npm install jsbench

**Browser:**

    <script src="/pathTo/thunks.js"></script>
    <script src="/pathTo/jsbench/index.js"></script>

## DEMO

```sh
➜  jsbench git:(master) node --harmony benchmark/index
Sync Benchmark...

JSBench Start (100 cycles, async mode):
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
Promise: 100 cycles, 31.02 ms/cycle, 32.237 ops/sec
co: 100 cycles, 30.53 ms/cycle, 32.755 ops/sec
async: 100 cycles, 2.88 ms/cycle, 347.222 ops/sec
RSVP: 100 cycles, 1.84 ms/cycle, 543.478 ops/sec
when: 100 cycles, 1.42 ms/cycle, 704.225 ops/sec
bluebird: 100 cycles, 1.41 ms/cycle, 709.220 ops/sec
thenjs: 100 cycles, 0.83 ms/cycle, 1204.819 ops/sec
thunks: 100 cycles, 0.75 ms/cycle, 1333.333 ops/sec
thunks-generator: 100 cycles, 0.67 ms/cycle, 1492.537 ops/sec

Promise: 100%; co: 101.60%; async: 1077.08%; RSVP: 1685.87%; when: 2184.51%; bluebird: 2200.00%; thenjs: 3737.35%; thunks: 4136.00%; thunks-generator: 4629.85%;

JSBench Completed!
```

## API

###JSBench.prototype.add(testName, testFn)

添加测试。

+ **testName**：String，测试名称
+ **testFn**：Function，function (callback) { //测试主体，异步模式必须使用 callback 结束测试 }

###JSBench.prototype.on(eventName, listener)

添加事件监听，可选，未添加事件监听时使用内部默认的事件监听。

+ **eventName**：String，事件名称，目前共有三种事件：`error`, `cycle`, `complete`。
+ **listener**：Function，function (event) {}

**error**: 任何内部同步或异步错误均会触发，event 为 `{name: testName, error: error}`

**cycle**: 每一个测试的每一次循环结束后触发，event 为 `{name: testName, cycle: cycleCount, time: time}`，其中 `time` 为该循环耗时ms

**complete**: 所有测试完成后触发，event 为 `{result: result, ranking: testArray}`，其中 result 为测试结果对比，ranking为按测试结果排序的数组，包含每个测试的详细信息。

###JSBench.prototype.run([cycles, syncMode])

开始测试。各个测试异步串行执行，即完成一个测试后才会开始下一个。每个测试的循环测试也为异步串行执行。返回 thunk。

+ **cycles**：Number，可选，每个测试主体循环测试的次数，默认为 10
+ **syncMode**：Boolean，可选，是否开启同步模式，默认异步模式，testFn会注入 callback，同步模式则不会注入。
