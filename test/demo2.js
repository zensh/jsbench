'use strict';
/*global console*/

// 同步测试demo

// 一个n个元素的队列，计算出队列中后面的数与前面数的相减值，取出差值最大的两个数。例如：

// 27, 52, 95, 6, 59, 60, 83, 41, 26, 12 中差值最大的两个数是 6, 83

// 12, 43, 87, 73, 39, 49, 51, 17, 65, 44 中差值最大的两个数是12, 87

// 30, 3, 20, 21, 40, 38, 60, 2, 40 中差值最大的是3,60

// 3, 3, 2, 1﻿﻿ ﻿中﻿差值﻿最大﻿的﻿是﻿3, ﻿3

function test1(list) {
  // 冠军解
  var mi, mx, c, t = list[0];
  for(var i = 1;i < list.length; i++) {
    if(c == null || (list[i] - t) > c) {
      mi = t;
      mx = list[i];
      c = mx - t;
    }
    if(t > list[i]) t = list[i];
  }
  // console.log(mi, mx);
}

function test2(list) {
  // 普通解
  var temp, max, min, pos = list.length - 1, maxResult = -Number.MAX_VALUE, cache = {};

  function loop () {
    max = list[pos--];
    min = Number.MAX_VALUE;
    for (var i = pos; i >= 0; i--) {
      min = list[i] < min ? list[i] : min;
    };
    temp = max - min;
    if (temp > maxResult) {
      maxResult = temp;
      cache[maxResult] = [min, max];
    }
    if (pos) loop();
  }
  loop();
  // console.log(cache[maxResult]);
}


var Benchmark = require('../index');
var bench = new Benchmark();

bench.add('test1', function () {
  test1([27, 52, 95, 6, 59, 60, 83, 41, 26, 12]);
  test1([12, 43, 87, 73, 39, 49, 51, 17, 65, 44]);
  test1([30, 3, 20, 21, 40, 38, 60, 2, 40]);
  test1([3, 3, 2, 1﻿﻿]);
}).add('test2', function () {
  test2([27, 52, 95, 6, 59, 60, 83, 41, 26, 12]);
  test2([12, 43, 87, 73, 39, 49, 51, 17, 65, 44]);
  test2([30, 3, 20, 21, 40, 38, 60, 2, 40]);
  test2([3, 3, 2, 1﻿﻿]);
}).run(10000000, true);
