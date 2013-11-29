const parseString = require('xml2js').parseString;

process.on('message', function (xml) {
  // var e = new Date().getTime() + (0.1 * 1000);
  // // just burn some cpu cycles
  // while (new Date().getTime() <= e) {}
  // process.send(data.length);

  parseString(xml, function (err, result) {
    if (err) {
      result = [false, xml];
    }
    process.send(result);
  });
});
