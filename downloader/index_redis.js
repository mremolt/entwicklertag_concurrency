'use strict';
const url = require('url');
const http = require('http');
const crypto = require('crypto');

const lazy = require('lazy');
const parseString = require('xml2js').parseString;
const redis = require("redis");
const client = redis.createClient();

var runs = 100000;
var results = 0;

var downloadItem = function(fileName) {
  var itemUrl = 'http://localhost/visono/' + fileName;
  http.get(itemUrl, processResponse);
};

var processResponse = function(response) {
  var doc = [];
  var shasum = crypto.createHash('sha1');
  response.on('data', function(data) {
    shasum.update(data);
    doc.push(data);
  }).on('end', function() {
    var xml = doc.join("\n");
    var key = shasum.digest('hex');
    client.hset('xml_files', key, xml);
    results += 1;
    if (results >= runs) { finish(); }
    // console.log("Wrote", key);
  });
};

var finish = function() {
  client.hkeys("xml_files", function (err, replies) {
    console.log("written: ", replies.length);
    client.quit();
  });
}

var download_url = 'http://localhost/visono/file_list.txt';
var text = [];

http.globalAgent.maxSockets = 20;

http.get(download_url, function(res) {
  lazy(res).lines.take(runs).forEach(function(line) {
    var fileName = line.toString();
    downloadItem(fileName);
  });
});


