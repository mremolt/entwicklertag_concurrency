// jshint node:true, esnext: true

const parseString = require('xml2js').parseString;

process.on('message', function (xml) {
  parseString(xml, function (err, result) {
    if (err) {
      result = [false, xml];
    }
    process.send(result);
  });
});
