const express = require("express");
const fakeSetting = require("./dataConverter");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbapi = require("./dbapi");
const { llData, llDataForReplacement } = require("./dataConverter");
const dataConverter = require("./dataConverter");
const fs = require('fs');

const app = express();
var path = require('path');

const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
// Connect db

//
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", (req, res) => {
  res.send(`Listening on dm ${PORT} `);
});

app.get("/proxy", (req,res) => {
    res.sendFile(path.join(__dirname + '/proxy.html'));

})
app.get("/proxy.pac", (req,res) => {
  fs.readFile('./proxy.pac', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  res.send(data)
  });
})

app.post("/proxy",(req,res) => {
  console.log(req.body.text);
  fs.writeFile('./proxy.pac', req.body.text, function(err){
     if (err) return console.log(err);
     res.send("/POST success")
  })

})

app.get("/device/new", async (req, res) => {
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const info = await dbapi.deviceInfo(ip);
  const fixedInfo = await dataConverter.llDataForReplacement(info);
  res.send({ ...fixedInfo });
});
