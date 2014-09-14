'use strict';
/*global console, Promise*/

var JSBench = require('../index.js'),
  len = 1000, // 任务队列长度
  cycles = 500, // 每个测试体运行次数
  syncMode = false; // 用同步任务测试

var jsbench = new JSBench();

console.log((syncMode ? 'Sync' : 'Async') + ' Benchmark...');

// 如果支持 Promise，则加入 Promise 测试
if (typeof Promise === 'function') {
  jsbench.add('Promise', require('./promise.js')(len, syncMode));
} else {
  console.log('Not support Promise!');
}

try { // 检测是否支持 generator，是则加载 co 测试
  var check = new Function('return function*(){}');
  jsbench.add('co', require('./co.js')(len, syncMode));
} catch (e) {
  console.log('Not support generator!');
}

jsbench.
  add('bluebird', require('./bluebird.js')(len, syncMode)).
  add('when', require('./when.js')(len, syncMode)).
  add('RSVP', require('./rsvp.js')(len, syncMode)).
  add('async', require('./async.js')(len, syncMode)).
  add('thenjs', require('./then.js')(len, syncMode)).
  add('thunks', require('./thunks.js')(len, syncMode)).
  add('Q', require('./q.js')(len, syncMode)).
  // on('cycle', function (e) {console.log(e.name, e.cycle, e.time + 'ms')}).
  run(cycles);
