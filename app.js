var express = require('express');
var app = express();
var reload = require('reload');
var fs = require('fs');
var clearRequire = require('clear-require');
var request = require('request');
var favicon = require('serve-favicon');

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('port', 3000);
app.set('dbfile', './db/db.json');
app.use(favicon('favicon.ico'));

// CORS proxy: http://host/http://url.com/ab => http://url.com/ab
app.all('/proxy/*', (req, res) => {
  req.pipe(request(req.params[0])).pipe(res);
});

app.get('', (req, res) => {
  var file = require(app.get('dbfile'));
    res.render('index', {
      title: 'Dash',
      cards: arrayFromJson(file)
    });
});

// Reload if db file changes
reloadServer = reload(app);
fs.watchFile(app.get('dbfile'), (f, curr, prev) => {
  console.log('Detected changes in ' + app.get('dbfile') + ' => Reloading');
  clearRequire(app.get('dbfile'));
  reloadServer.reload();
});

app.listen(app.get('port'), () => {
  console.log('Server listening on port ' + app.get('port'));
});

function arrayFromJson(arr) {
  return Object.keys(arr).map(key => ({title: key, value: arr[key]}))
}
