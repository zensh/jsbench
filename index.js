// **Github:** https://github.com/zensh/jsbench
// **License:** MIT

/* global module, define, console */
;(function (root, factory) {
  'use strict'

  if (typeof module === 'object' && module.exports) module.exports = factory(require('thunks'))
  else if (typeof define === 'function' && define.amd) define(['thunks'], factory)
  else root.JSBench = factory(root.thunks)
}(typeof window === 'object' ? window : this, function (thunks) {
  'use strict'

  var thunk = thunks()

  function forEach (array, iterator) {
    for (var i = 0, len = array >= 0 ? array : array.length; i < len; i++) iterator(array[i], i)
  }

  function JSBench () {
    this._list = []
    this._events = {}
  }

  JSBench.prototype.on = function (type, listener) {
    this._events[type] = this._events[type] || []
    this._events[type].push(listener)
    return this
  }

  JSBench.prototype.trigger = function (type, value) {
    var events = this._events[type]
    if (!events) return this
    forEach(events, function (listener) {
      listener(value)
    })
    return this
  }

  JSBench.prototype.add = function (name, test) {
    this._list.push({name: name, test: test})
    return this
  }

  JSBench.prototype.run = function (cycles, syncMode) {
    var ctx = this
    var list = ctx._list

    cycles = cycles >= 1 ? +cycles : 10
    if (!ctx._events.error) { // 如果未定义，则使用默认的 error 监听
      ctx.on('error', function (e) {
        console.error(e.name + ' error: ' + e.error)
      })
    }
    if (!ctx._events.complete) { // 如果未定义，则使用默认的 complete 监听
      ctx.on('complete', function (e) {
        console.log('\nJSBench Results:')
        forEach(e.ranking, function (test) {
          console.log(test.name + ': ' + test.message)
        })
        console.log(e.result)
      })
    }

    // 按顺序串行执行各个测试
    console.log('\nJSBench Start (' + cycles + ' cycles, ' + (syncMode ? 'sync' : 'async') + ' mode):')
    return thunk.seq(list.map(function (test) {
      // 异步执行每一个测试
      return function (callback) {
        return thunk.delay(0)(function () {
          console.log('Test ' + test.name + '...')
          test.startTime = Date.now()
          test.cycles = test.error = test.endTime = test.ops = null

          if (syncMode) { // 同步测试模式
            try {
              forEach(cycles, function (nil, index) {
                test.cycles = index
                var time = Date.now()
                test.test()
                if (ctx._events.cycle) ctx.trigger('cycle', {name: test.name, cycle: index, time: Date.now() - time})
              })
              test.endTime = Date.now()
            } catch (error) {
              // 某一测试任务报错不影响后续测试
              test.error = error
              ctx.trigger('error', {name: test.name, error: error})
            }
            return
          }

          var cycleQueue = []
          forEach(cycles, function (nil, index) {
            cycleQueue.push(function (callback) {
              var time = Date.now()
              // 异步执行测试的每一个循环
              return thunk.delay(0)(function () {
                return test.test
              })(function (error) {
                if (error) throw error
                test.cycles = index + 1
                if (ctx._events.cycle) ctx.trigger('cycle', {name: test.name, cycle: index + 1, time: Date.now() - time})
              })(callback)
            })
          })

          return thunk.seq(cycleQueue)(function (error) {
            if (error) {
              test.error = error
              ctx.trigger('error', {name: test.name, error: error})
            } else test.endTime = Date.now()
          })
        })(callback)
      }
    }))(function (error) {
      if (error) {
        ctx.trigger('error', {name: 'JSBench', error: error})
        throw error
      }

      var result
      var base
      var ms
      var ranking = list.slice()
      // 测试完毕，计算结果
      forEach(list, function (test) {
        if (test.error) test.message = test.error
        else {
          ms = (test.endTime - test.startTime) / test.cycles
          test.ops = 1000 / ms
          test.message = test.cycles + ' cycles, ' + ms + ' ms/cycle, ' + test.ops.toFixed(3) + ' ops/sec'
        }
      })
      // 对结果进行排序对比
      ranking.sort(function (a, b) {
        return a.ops - b.ops
      })

      forEach(ranking, function (test) {
        if (!test.ops) return
        if (base) result += ' ' + test.name + ': ' + (test.ops * 100 / base).toFixed(2) + '%;'
        else {
          base = test.ops
          result = '\n' + test.name + ': 100%;'
        }
      })

      ctx.trigger('complete', {result: result, ranking: ranking})
      console.log('\nJSBench Completed!')
      return ranking
    })
  }

  return JSBench
}))
