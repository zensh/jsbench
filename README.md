JSBench 0.2.0
=======

A every small javascript benchmarks, base on thenjs

## Install

**Node.js:**

    npm install jsbench

**Browser:**

    <script src="/pathTo/then.js"></script>
    <script src="/pathTo/jsbench/index.js"></script>

## API

###JSBench.add(taskName, taskFn)

+ **taskName**：String，测试名称
+ **taskFn**：Function，function (callback) { //测试主体，异步模式必须使用 callback 结束测试 }

###JSBench.run([loops, syncMode])

+ **loops**：Number，可选，每个测试循环次数，默认为 10
+ **syncMode**：Boolean，可选，是否开启同步模式，默认异步模式，taskFn会注入 callback，同步模式则不会

## Demo


    var JSBench = require('jsbench');

    var jsbench = new JSBench();

    jsbench.add('task1', function (callback) {
        // task1 测试主体，异步模式必须使用 callback 结束测试
    }).add('task2', function (callback) {
        // task2 测试主体
    }).add('task3', function (callback) {
        // task3 测试主体
    }).add('task4', function (callback) {
        // task4 测试主体
    }).run(100) // 每个测试跑 100 次

更多请看 test/demo.js