JSBench 0.3.0
=======

A every small javascript benchmarks, base on thenjs

## Install

**Node.js:**

    npm install jsbench

**Browser:**

    <script src="/pathTo/then.js"></script>
    <script src="/pathTo/jsbench/index.js"></script>

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

**cycle**: 每一个测试的每一次循环均会触发，event 为 `{name: testName, cycle: cycleCount}`

**complete**: 所有测试完成后触发，event 为 `{result: result, ranking: testArray}`，其中 result 为测试结果对比，ranking为按测试结果排序的数组，包含每个测试的详细信息。

###JSBench.prototype.run([cycles, syncMode])

开始测试。各个测试异步串行执行，即完成一个测试后才会开始下一个。每个测试的循环测试也为异步串行执行。

+ **cycles**：Number，可选，每个测试主体循环测试的次数，默认为 10
+ **syncMode**：Boolean，可选，是否开启同步模式，默认异步模式，testFn会注入 callback，同步模式则不会注入。

## Demo

    var JSBench = require('jsbench');

    var jsbench = new JSBench();

    jsbench.add('test1', function (callback) {
        // test1 测试主体，异步模式必须使用 callback 结束测试
    }).add('test2', function (callback) {
        // test2 测试主体
    }).add('test3', function (callback) {
        // test3 测试主体
    // }).on('cycle', function (e) { // 未监听则使用默认监听
    //   console.log(e);
    // }).on('complete', function (e) {
    //   console.log(e);
    // }).on('error', function (e) {
    //   console.log(e);
    }).run(100) // 每个测试跑 100 次

更多请运行 `node test/demo.js`