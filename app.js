const express = require('express');
const app = express();
const reload = require('reload');
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
      title: 'Dashboard',
      cards: arrayFromJson(file)
    });
});

reloadServer = reload(app);
fs.watchFile(app.get('dbfile'), function (f, curr, prev) {
  console.log('Detected changes in ' + app.get('dbfile') + ' => Reloading');
  clearRequire(app.get('dbfile'));
  reloadServer.reload();
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
