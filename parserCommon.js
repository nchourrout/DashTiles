const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

function parse(name, url, xpath, transform) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      let txt = $(xpath).text();
      if (!txt) return console.log("Couldn't parse " + xpath + " in " + url);
      let processedText = transform ? transform(txt) : txt;
      save(name, processedText);
    } else {
      console.log('Error');
    }
  });
}

function req(name, options, transform) {
  request.get(options, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let body = JSON.parse(response.body);
      save(name, transform(body));
    } else {
      console.log('Error retrieving ' + options.url);
    }
  });
}

function save(key, value) {
  var fileName = './db/db.json';
  var file = require(fileName);
  file[key] = value;
  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
    console.log('Saved ' + key + ' = ' + value + ' to ' + fileName);
  });
}

module.exports.parse = parse;
module.exports.req = req;
