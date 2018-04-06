var parser = require('./parserCommon.js');

// Quote
parser.parse('Word of the Day',
'https://www.merriam-webster.com/word-of-the-day',
'.word-and-pronunciation h1');

// Temperature
function getTempF(res) {
  return Math.round(res.main.temp * 9/5 - 459.67).toString() + '°F';
}

let weatherAPIKey = 'YOUR_API_KEY_HERE';
var options = {url: 'http://api.openweathermap.org/data/2.5/weather?zip=94105,us&appid=' + weatherAPIKey};
parser.req('Weather', options, getTempF);
