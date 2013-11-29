// jshint node:true, esnext: true

'use strict';
const url = require('url');
const http = require('http');
const lazy = require('lazy');
const cp = require('child_process');
const _ = require('lodash');
const parseString = require('xml2js').parseString;

var results = [];

var downloadItem = function(fileName) {
  var itemUrl = 'http://localhost/visono/' + fileName;
  http.get(itemUrl, processResponse);
};

var processResponse = function(response) {
  var doc = [];
  response.on('data', function(data) {
    doc.push(data);
  }).on('end', function() {
    var xml = doc.join();
    _(workers).sample().send(xml);
  });
};

var finish = function(results, workers) {
  console.log(results.length);
  console.log("cleaning");
  _(workers).each(function(child) {
    child.kill();
  });
};

var workers = [];
workers.push(cp.fork(__dirname + '/xml_analyzer.js'));
workers.push(cp.fork(__dirname + '/xml_analyzer.js'));
workers.push(cp.fork(__dirname + '/xml_analyzer.js'));

_(workers).each(function(child) {
  child.on('message', function(data) {
    results.push(data);
    if (results.length % 500 === 0) { console.log(results.length); }
    if (results.length >= 20000) {
      finish(results, workers);
    }
  });
});

var download_url = 'http://localhost/visono/file_list.txt';
http.globalAgent.maxSockets = 20;

http.get(download_url, function(res) {
  lazy(res).lines.take(20000).map(function(line) {
    var fileName = line.toString();
    downloadItem(fileName);
  });
});
