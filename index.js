// JSBench v0.3.0
// A every small javascript benchmarks, base on thenjs!
// **Github:** https://github.com/zensh/jsbench
// **License:** MIT

/* global module, define, console */
(function (root, factory) {
  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('thenjs'));
  } else if (typeof define === 'function' && define.amd) {
    define(['thenjs'], factory);
  } else {
    root.JSBench = factory(root.thenjs);
  }
}(this, function (thenjs) {
  'use strict';

  function JSBench() {
    this._list = [];
    this._events = {};
  }

  JSBench.prototype.on = function (name, listener) {
    var events = this._events[name] || (this._events[name] = []);
    events.push(listener);
    return this;
  };

  JSBench.prototype.trigger = function (name, event) {
    var events = this._events[name];
    if (!events) return this;
    for (var i = 0, l = events.length; i < l; i++) {
      events[i](event);
    }
    return this;
  };

  JSBench.prototype.add = function (name, test) {
    this._list.push({name: name, test: test});
    return this;
  };

  JSBench.prototype.run = function (cycles, syncMode) {
    var self = this, list = self._list;

    cycles = cycles >= 1 ? +cycles : 10;
    if (!self._events.error) { // 如果未定义，则使用默认的 error 监听
      self.on('error', function (e) {
        console.error(e.name + ' error: ' + e.error);
      });
    }
    if (!self._events.complete) { // 如果未定义，则使用默认的 complete 监听
      self.on('complete', function (e) {
        console.log('\nJSBench Results:');
        for (var i = 0; i < e.ranking.length; i++) {
          console.log(e.ranking[i].name + ': ' + e.ranking[i].message);
        }
        console.log(e.result);
      });
    }

    // 按顺序串行执行各个测试
    console.log('\nJSBench Start:');
    thenjs.eachSeries(list, function (cont, test, index) {
      // 异步执行每一个测试
      thenjs.defer(cont, function () {
        console.log('Test '+ test.name + '...');
        test.startTime = Date.now();
        test.cycles = test.error = test.endTime = test.ops = null;

        if (syncMode) { // 同步测试模式
          try {
            for (var i = 1; i <= cycles; i++) {
              test.cycles = i;
              test.test();
              if (self._events.cycle) self.trigger('cycle', {name: test.name, cycle: i});
            }
            test.endTime = Date.now();
          } catch (error) {
            test.error = error;
            self.trigger('error', {name: test.name, error: error});
          }
          cont(); // 某一测试任务报错不影响后续测试
        } else {  // 异步测试模式
          thenjs.eachSeries(new Array(cycles), function (cont2, x, index) {
            // 异步执行测试的每一个循环
            thenjs.defer(cont2, function () {
              test.cycles = index + 1;
              test.test(cont2);
              if (self._events.cycle) self.trigger('cycle', {name: test.name, cycle: index + 1});
            });
          }).all(function (cont2, error) {
            if (error) {
              test.error = error;
              self.trigger('error', {name: test.name, error: error});
            } else {
              test.endTime = Date.now();
            }
            cont();
          });
        }
      });
    }).then(function () {
      var result, test, base, ms, ranking = list.slice();
      // 测试完毕，计算结果
      for (var i = 0; i < list.length; i++) {
        test = list[i];
        if (test.error) {
          test.message = test.error;
        } else {
          ms = (test.endTime - test.startTime) / test.cycles;
          test.ops = 1000 / ms;
          test.message = test.cycles + ' cycles, ' + ms + ' ms/cycle, ' + test.ops.toFixed(2) + ' ops/sec';
        }
      }
      // 对结果进行排序对比
      ranking.sort(function (a, b) {
        return a.ops - b.ops;
      });
      for (i = 0; i < ranking.length; i++) {
        test = ranking[i];
        if (!test.ops) continue;
        if (base) {
          result += ' ' + test.name + ': ' + (test.ops * 100 / base).toFixed(2) + '%;';
        } else {
          base = test.ops;
          result = '\n' + test.name + ': 100%;';
        }
      }
      self.trigger('complete', {result: result, ranking: ranking});
      console.log('\nJSBench Completed!');
    }).fail(function (cont, error) {
      self.trigger('error', {name: 'JSBench', error: error});
    });
  };

  return JSBench;
}));