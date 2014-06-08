JSBench 0.3.2
=======

A every small javascript benchmarks, base on thenjs

## Install

**Node.js:**

    npm install jsbench

**Browser:**

    <script src="/pathTo/then.js"></script>
    <script src="/pathTo/jsbench/index.js"></script>

## DEMO

**`node --harmony benchmark/index.js`:**

    [root@centos jsbench]# node benchmark/index.js

    JSBench Start (10 cycles, async mode):
    Test Promise...
    Test co...
    Test bluebird...
    Test Q...
    Test when...
    Test RSVP...
    Test async...
    Test thenjs...

    JSBench Results:
    Q: 10 cycles, 96 ms/cycle, 10.42 ops/sec
    Promise: 10 cycles, 82.9 ms/cycle, 12.06 ops/sec
    when: 10 cycles, 17.7 ms/cycle, 56.50 ops/sec
    RSVP: 10 cycles, 8.6 ms/cycle, 116.28 ops/sec
    bluebird: 10 cycles, 8.1 ms/cycle, 123.46 ops/sec
    async: 10 cycles, 7.6 ms/cycle, 131.58 ops/sec
    co: 10 cycles, 6.4 ms/cycle, 156.25 ops/sec
    thenjs: 10 cycles, 5.1 ms/cycle, 196.08 ops/sec

    Q: 100%; Promise: 115.80%; when: 542.37%; RSVP: 1116.28%; bluebird: 1185.19%; async: 1263.16%; co: 1500.00%; thenjs: 1882.35%;

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

开始测试。各个测试异步串行执行，即完成一个测试后才会开始下一个。每个测试的循环测试也为异步串行执行。

+ **cycles**：Number，可选，每个测试主体循环测试的次数，默认为 10
+ **syncMode**：Boolean，可选，是否开启同步模式，默认异步模式，testFn会注入 callback，同步模式则不会注入。
