// jshint node:true, esnext: true

'use strict';
const url = require('url');
const http = require('http');
const lazy = require('lazy');
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
    var xml = doc.join("\n");
    var result = analyzeXml(xml);
    results.push(result);
    if (results.length % 500 === 0) { console.log(results.length); }
  });
};

var analyzeXml = function(xml) {
  // just burn some cpu cycles
  var e = new Date().getTime() + (10);
  while (new Date().getTime() <= e) {}
  return xml.length;
};

var download_url = 'http://localhost/visono/file_list.txt';
var text = [];

http.globalAgent.maxSockets = 20;

http.get(download_url, function(res) {
  lazy(res).lines.take(20000).forEach(function(line) {
    var fileName = line.toString();
    downloadItem(fileName);
  });
});
