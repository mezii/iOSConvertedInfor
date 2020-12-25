const express = require("express");
const fakeSetting = require("./dataConverter");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbapi = require("./dbapi");
const { llData, llDataForReplacement } = require("./dataConverter");
const dataConverter = require("./dataConverter");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
// Connect db

//
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", (req, res) => {
  res.send(`Listening on ${PORT} `);
});

app.get("/device/new", async (req, res) => {
  const info = await dbapi.deviceInfo();
  const fixedInfo = await dataConverter.llDataForReplacement(info);
  res.send({ ...fixedInfo });
});
