/*
 * IOT 1.0 Dashboard Prototype
 *
 * Astrazeneca Tech Labs UK
 * Hari ( email : hariprasad.radhakrishnan@astrazeneca.com )
 *
**/

var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var request = require('request');



const path = require('path');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var url = config.get('Helium.api.url');
var key = config.get('Helium.api.key');
var user = config.get('Helium.api.User');

app.get('/product/:ID', function (req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});


app.get('/all', function (req, res) {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});


app.get('/query', function (req, res) {
    request({url, method: "GET", headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization","Content-Type": "application/json","Authorization":key,"User":user}},function (error, response, body) {
            if (!error && response.statusCode == 200) {
                  var data = req.body;
                res.send(body);
            } else { res.send("error");}
        });
});

app.get('/timeseries/:ID', function (req, res) {
  var url = config.get('Helium.api.url');
  var id = req.params.ID;
  url = url + "/" + id + "/timeseries?filter%5Bport%5D=t&page%5Bsize%5D=10";
  //console.log(url);
    request({url, method: "GET", headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization",'Content-Type': 'application/json',"Authorization":key,"User":user}},function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            } else {
              console.log("error");
              res.send("error");}
        });
});

app.listen(3000, function () {
    console.log('IOT dashboard listening on port 3000!');
});
