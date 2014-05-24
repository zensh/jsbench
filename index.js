// v0.2.0
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
  }

  JSBench.prototype.add = function (name, task) {
    this._list.push({name: name, task: task});
    return this;
  };

  JSBench.prototype.run = function (loops, syncMode) {
    var list = this._list;

    loops = loops >= 1 ? +loops : 10;
    // 按顺序串行执行各个测试
    console.log('\nJSBench Start:');
    thenjs.eachSeries(list, function (cont, task, index) {
      console.log('Test '+ task.name + '...');
      task.startTime = Date.now();
      task.loops = task.error = task.endTime = task.ops = null;

      if (syncMode) { // 同步测试模式
        try {
          for (var i = 1; i <= loops; i++) {
            task.loops = i;
            task.task();
          }
          task.endTime = Date.now();
        } catch (error) {
          task.error = error;
          console.error(task.name + ' error:' + error);
        }
        cont(); // 某一测试任务报错不影响后续测试
      } else {  // 异步测试模式
        thenjs.eachSeries(new Array(loops), function (cont2, x, index) {
          task.loops = index + 1;
          thenjs.defer(cont2, task.task, cont2);
        }).all(function (cont2, error) {
          if (error) {
            task.error = error;
            console.error(task.name + ' error:' + error);
          } else {
            task.endTime = Date.now();
          }
          cont();
        });
      }
    }).all(function (cont, error) {
      // 测试完毕，生成结果
      var result, base, _list = list.slice();
      if (error) return console.error('Benchmark error:' + error);

      console.log('\nJSBench Results:');
      for (var i = 0; i < list.length; i++) {
        console.log(list[i].name + ': ' + genResult(list[i]));
      }
      _list.sort(function (a, b) {
        return a.ops - b.ops;
      });
      for (i = 0; i < _list.length; i++) {
        if (!_list[i].ops) continue;
        if (base) {
          result += ' ' + _list[i].name + ': ' + (_list[i].ops * 100 / base).toFixed(2) + '%;';
        } else {
          base = _list[i].ops;
          result = '\n' + _list[i].name + ': 100%;';
        }
      }
      console.log(result);
    });
  };

  function genResult(task) {
    if (task.error) return task.error;
    var ms = (task.endTime - task.startTime) / task.loops;
    task.ops = 1000 / ms;
    return task.loops + ' loops, ' + ms + ' ms/loop, ' + task.ops.toFixed(2) + ' ops/sec';
  }

  return JSBench;
}));