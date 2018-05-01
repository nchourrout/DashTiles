var request = require('request');
var cheerio = require('cheerio');
var nodeschedule = require('node-schedule');
var fs = require('fs');

function schedule(intervalMinutes, process) {
  console.log('Parser set to run every ' + intervalMinutes + ' minutes.')
  var parseJob = () => {
    console.log('Parser ran at ' + new Date());
    process()
  };
  parseJob();
  nodeschedule.scheduleJob({minute: intervalMinutes}, parseJob);
}

function parse(name, url, xpath, transform, color, callbackURL, target) {
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      let txt = $(xpath).text();
      if (!txt) return console.log("Couldn't parse " + xpath + " in " + url);
      let processedText = transform ? transform(txt) : txt;
      save(name, processedText, color, callbackURL ? callbackURL : url, target);
    } else {
      console.log('Error');
    }
  });
}

function req(name, options, transform, color, callbackURL, target) {
  request.get(options, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      let body = JSON.parse(response.body);
      save(name, transform(body), color, callbackURL, target);
    } else {
      console.log('Error retrieving ' + options.url);
    }
  });
}

function save(key, text, color, callbackURL, target) {
  var fileName = './db/db.json';
  var file = require(fileName);
  var value = { 'text': text }
  if (color) value.color = color
  if (callbackURL) value.url = callbackURL
  if (target) value.target = target
  file[key] = value
  fs.writeFile(fileName, JSON.stringify(file, null, 2), (err) => {
    if (err) return console.log(err);
    console.log('Saved ' + key + ' = ' + value.text + ' to ' + fileName);
  });
}

module.exports.parse = parse;
module.exports.req = req;
module.exports.schedule = schedule;
module.exports.save = save;
