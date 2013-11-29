// jshint node:true, esnext: true
//
// Primes up to 20.000
// ab -c 5 -n 100 http://localhost:8080/
// fullAsync : Requests per second: 2.98
// async     : Requests per second: 2.99
// sync      : Requests per second: 11.80
//
// ab -c 50 -n 100 http://localhost:8080/
// fullAsync : Requests per second: 2.89
// async     : Requests per second: 2.91
// sync      : Requests per second: 11.59
//
// Primes up to 50.000
// ab -c 5 -n 100 http://localhost:8080/
// fullAsync : Requests per second: 0.96
// async     : Requests per second: 0.95
// sync      : Requests per second: 2.37
//
// ab -c 50 -n 100 http://localhost:8080/
// fullAsync : Requests per second: 0.94
// async     : Requests per second: 0.93
// sync      : Requests per second: 2.33

var http = require("http");

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

var testPrimeNumberAsync = function(number, cb, test) {
  if (! test) { test = 2; }

  if (number == 1 || number == 2) {
    cb(number);
  } else if (test == number) {
    cb(number);
  } else if (number % test === 0) {
    return false;
  } else {
    return setImmediate(isPrimeNumberAsync, number, cb, test + 1);
  }
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

var primeNumbersAsync = function(limit, response, number) {
  if (! number) { number = 0; }

  if (number > limit) {
    response.end();
    return true;
  }

  if (isPrimeNumber(number)) {
    response.write(number.toString() + ', ');
  }

  setImmediate(primeNumbersAsync, limit, response, number + 1);
};

var primeNumbersFullAsync = function(limit, response, number) {
  if (! number) { number = 0; }

  if (number > limit) {
    response.end();
    return true;
  }

  testPrimeNumberAsync(number, function(result) {
    response.write(result.toString() + ', ');
  });

  setImmediate(primeNumbersAsync, limit, response, number + 1);
};


http.createServer(function(request,response){
  response.writeHeader(200, {"Content-Type": "text/plain"});
  // primeNumbers(50000, response);
  // primeNumbersAsync(50000, response);
  primeNumbersFullAsync(50000, response);
}).listen(8080);

console.log("Server Running on 8080");
