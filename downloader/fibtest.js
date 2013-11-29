function fibo (n) {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}

var numThreads = 10;
var threadPool = require('webworker-threads').createPool(numThreads);
threadPool.all.eval(fibo);

var n = 0;
while (n <= 100) {
  threadPool.any.eval('fibo(' + n + ')', function cb (err, data) {
    process.stdout.write(" ["+ this.id+ "]"+ data);
  });
  n += 1;
}

threadPool.destroy();

// (function spinForever () {
//   setImmediate(spinForever);
// })();
