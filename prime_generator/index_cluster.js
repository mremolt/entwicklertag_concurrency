var http = require("http");
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var isPrimeNumber = function(number) {
  if (number == 1 || number == 2) {
    return true;
  }
  for (var i=2; i<number; i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
};

var primeNumbersAsync = function(limit, response, number) {
  if (! number) { number = 0; }

  if (number > limit) {
    response.end();
    return true;
  }

  if ( isPrimeNumber(number) ) {
    response.write(number.toString() + ', ');
  }

  setImmediate(primeNumbersAsync, limit, response, number + 1);
};


if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < (numCPUs + 4); i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  http.createServer(function(request,response){
    response.writeHeader(200, {"Content-Type": "text/plain"});
    // primeNumbers(200000, response);
    primeNumbersAsync(20000, response);
  }).listen(8080);
}

console.log("Server Running on 8080");
