const crypto = require('crypto');
const redis = require("redis");
const client = redis.createClient();

process.on('message', function (xml) {
  var shasum = crypto.createHash('sha1');
  shasum.update(xml);
  var key = shasum.digest('hex');
  client.hset('xml_files_worker', key, xml);

  process.send(key);
});
