// jshint node:true, esnext: true
//
// Primes up to 20.000
// ab -c 5 -n 100 http://localhost:8080/
// async : Requests per second: 6.51
// sync  : Requests per second: 38.48
// ab -c 50 -n 100 http://localhost:8080/
// async : Requests per second: 9.53
// sync  : Requests per second: 36.55
// ab -c 100 -n 200 http://localhost:8080/
// async : Requests per second: 10.35
// sync  : Requests per second: 35.69
//
// Primes up to 50.000
// ab -c 5 -n 100 http://localhost:8080/
// async : Requests per second: 3.07
// sync  : Requests per second: 8.54
// ab -c 50 -n 100 http://localhost:8080/
// async : Requests per second: 2.87
// sync  : Requests per second: 7.61

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

var primeNumbers = function(limit, response) {

  for (var i = 0; i <= limit; i++) {
    if ( isPrimeNumber(i) ) {
      response.write(i.toString() + ', ');
    }
  }

  response.end();
  return true;
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
    primeNumbers(20000, response);
    // primeNumbersAsync(20000, response);
  }).listen(8080);
}

console.log("Server Running on 8080");
