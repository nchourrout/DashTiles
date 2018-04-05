const express = require('express');
const app = express();
const router = express.Router();
const reload = require('reload');
const http = require('http');
const fs = require('fs');
const clearRequire = require('clear-require');

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('port', 3000);
app.set('dbfile', './db/db.json');

function arrayFromJson(arr) {
  var res = [];
  for (var key in arr) {
    if (arr.hasOwnProperty(key)) {
      res.push({title: key, value: arr[key]});
    }
  }
  return res;
}

app.get('/', (req, res) => {
  var file = require(app.get('dbfile'));
    res.render('index', {
      title: 'ReaderX Dashboard',
      cards: arrayFromJson(file)
    });
});


// var server = http.createServer(app);

reloadServer = reload(app);
console.log('Watching ' + app.get('dbfile'));
fs.watchFile(app.get('dbfile'), function (f, curr, prev) {
  console.log('New changes => Reloading server');
  clearRequire(app.get('dbfile'));
  reloadServer.reload();
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
