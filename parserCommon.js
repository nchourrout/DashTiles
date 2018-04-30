const request = require('request');
const cheerio = require('cheerio');
const nodeschedule = require('node-schedule');
const moment = require('moment');
const fs = require('fs');

function schedule(intervalMinutes, process) {
  console.log('Parser set to run every ' + intervalMinutes + ' minutes.')
  var parseJob = () => {
    console.log('Parser ran at ' + moment().format());
    process()
  };
  parseJob();
  nodeschedule.scheduleJob({minute: intervalMinutes}, parseJob);
}

function parse(name, url, xpath, transform, color, callbackURL) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      let txt = $(xpath).text();
      if (!txt) return console.log("Couldn't parse " + xpath + " in " + url);
      let processedText = transform ? transform(txt) : txt;
      save(name, processedText, color, callbackURL ? callbackURL : url);
    } else {
      console.log('Error');
    }
  });
}

function req(name, options, transform, color, callbackURL) {
  request.get(options, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let body = JSON.parse(response.body);
      save(name, transform(body), color, callbackURL);
    } else {
      console.log('Error retrieving ' + options.url);
    }
  });
}

function save(key, text, color, callbackURL) {
  var fileName = './db/db.json';
  var file = require(fileName);
  var value = { 'text': text }
  if (color) value.color = color
  if (callbackURL) value.url = callbackURL
  file[key] = value
  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
    console.log('Saved ' + key + ' = ' + value.text + ' to ' + fileName);
  });
}

module.exports.parse = parse;
module.exports.req = req;
module.exports.schedule = schedule;
module.exports.save = save;
