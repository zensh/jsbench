// v0.0.1
//
// A every small javascript benchmarks, base on thenjs!
//
// **Github:** https://github.com/teambition/then.js
//
// **License:** MIT

/* global module, define, console */
(function () {
  'use strict';
  var thenjs;

  function printError(name, error) {
    console.error(name + ' error: ', error);
  }

  function printResult(task) {
    var loops = task.loops,
      ms = (task.endTime - task.startTime) / loops,
      ops = 1000 / ms;
    console.log(task.name + ' : ' + loops + ' loops, ' + ms + ' ms/loop, ' + ops.toFixed(2) + ' ops/sec.');
  }

  function Benchmark() {
    this._tasklist = [];
  }

  Benchmark.prototype.add = function (name, task) {
    this._tasklist.push({
      name: name,
      task: task
    });
    return this;
  };

  Benchmark.prototype.run = function (loops, syncMode) {
    var self = this, _loops = [];

    loops = loops >= 1 ? +loops : 10;
    for (var i = 1; i <= loops; i++) {
      _loops.push(i);
    }

    thenjs.eachSeries(self._tasklist, function (cont, task) {
      console.log(task.name + ' begin: ');
      task.startTime = Date.now();
      task.loops = task.error = task.endTime = null;

      if (syncMode) {
        for (var i = 1; i <= loops; i++) {
          task.loops = i;
          try {
            task.task();
          } catch (error) {
            task.error = error;
            printError(task.name, error);
            return cont();
          }
        }
        task.endTime = Date.now();
        cont();
      } else {
        thenjs.eachSeries(_loops, function (cont2, i) {
          task.loops = i;
          console.log('loops: ' + i);
          thenjs.defer(cont2, task.task, cont2);
        }).all(function (cont2, error) {
          if (error) {
            task.error = error;
            printError(task.name, error);
          } else {
            task.endTime = Date.now();
          }
          cont();
        });
      }
    }).all(function (cont, error, result) {
      if (error) {
        printError('Benchmark', error);
      } else {
        thenjs.eachSeries(self._tasklist, function (cont2, task) {
          if (task.error) {
            printError(task.name, task.error);
          } else {
            printResult(task);
          }
          cont2();
        });
      }
    });
  };

  if (typeof module === 'object' && typeof module.exports === 'object') {
    thenjs = require('thenjs');
    module.exports = Benchmark;
  } else if (typeof define === 'function' && define.amd) {
    define(['thenjs'], function () {return Benchmark;});
  } else if (typeof window === 'object') {
    thenjs = window.thenjs;
    window.Benchmark = Benchmark;
  }
}());