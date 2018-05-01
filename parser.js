var parser = require('./parserCommon.js');

function getTempF(res) {
  return Math.round(res.main.temp * 9/5 - 459.67).toString() + '°F';
}

parser.schedule(5, () => { // Every 5 minutes
  // Quote
  parser.parse('Word of the Day',
  'https://www.merriam-webster.com/word-of-the-day',
  '.word-and-pronunciation h1', null, '#72A1E5');

  let weatherAPIKey = 'YOUR_API_KEY_HERE';
  // Temperature
  var options = {url: 'http://api.openweathermap.org/data/2.5/weather?zip=94105,us&appid=' + weatherAPIKey};
  parser.req('Weather', options, getTempF, '#FE5F55', 'https://openweathermap.org/city/5391959', '_blank');
})
