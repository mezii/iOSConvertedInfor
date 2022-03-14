const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbapi = require("./dbapi");
const dataConverter = require("./dataConverter");
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http,{serverClient:true});
const socketRoute = require('./routes/socket');
const fbRoute = require('./routes/fbaccount');
const fbUserRoute = require('./routes/fbuser')
const userRoute = require('./routes/user');
const mdeviceRoute = require('./routes/mdevice');
var cookieParser = require('cookie-parser');
var Imap = require('imap'),
    inspect = require('util').inspect;
    const MailParser = require('mailparser').MailParser;


// databased route

const Region = require("./database/Region");
const TNAccount = require("./database/TNAccount");

// Include Nodejs' net module.
const Net = require('net');
// The port on which the server is listening.
const port = 7777;


// const server = new Net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
// });

// server.listen(port, function() {
//     console.log(`Server listening for connection requests on socket localhost:${port}`);
// });

// const sockets = [];

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
// server.on('connection', function(socket) {
//     sockets.push(socket);
//     socket.pipe(socket);

//     console.log('A new connection has been established.');

//     // Now that a TCP connection has been established, the server can send data to
//     // the client by writing to its socket.
//     socket.write('Welcome \n');

//     // The server can also receive data from the client by reading from its socket.
//     socket.on('data', function(chunk) {
//         console.log(`Data received from client: ${chunk.toString()}`);
//     });

//     // When the client requests to end the TCP connection with the server, the server
//     // ends the connection.
//     socket.on('end', function() {
//         console.log('Closing connection with the client');
//     });

//     // Don't forget to catch error, for your own sake.
//     socket.on('error', function(err) {
//         console.log(`Error: ${err}`);
//     });
//     // socket.on('disconnect', function(){
//     //   const i = sockets.indexOf(socket);
//     //   console.log(`Socket ${i} is disconnected`);
//     // })
// });




var path = require('path');


mongoose.set('useFindAndModify', false);

app.use("/public", express.static('public'))

app.use("/img", express.static('img'));


const PORT = process.env.PORT || 5000;
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// app.use("/socket", socketRoute)
app.use("/fbaccount",fbRoute)
app.use("/user", userRoute);
app.use("/mdevice",mdeviceRoute);
app.use("/fbuser", fbUserRoute);
// Connect db
mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });




app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/testsocket', (req,res) => {
  sockets.forEach(socket => {
    socket.write("No WelCome");
  });
  res.send({"connectionCounts": sockets.length})
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/region', async (req, res) => {
  // const json = JSON.stringify(req.body);

  if (!req.body.language || !req.body.iso639 || !req.body.timezone) res.send("Invalid data");
  const region = new Region({
    language: req.body.language,
    iso639: req.body.iso639,
    timezone: req.body.timezone
  })
  await Region.deleteMany();
  await region.save();
  res.send(region)
})



app.post('/tnaccount', async (req, res) => {
  // const json = JSON.stringify(req.body);

  const tnaccount = new TNAccount({
    email: req.body.email,
    password: req.body.password,
    clientId: req.body.clientId,
    device: req.body.device,
    numberPhone: req.body.numberPhone,
    cookie: req.body.cookie,
    username: req.body.username,
  })

  await tnaccount.save();
  res.send(tnaccount)
})

app.get("/region", async (req, res) => {

  res.send(await Region.find({}))
})

app.get("/proxy", (req, res) => {
  res.sendFile(path.join(__dirname + '/proxy.html'));

})
app.get("/proxy.pac", (req, res) => {
  fs.readFile('./proxy.pac', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    res.send(data)
  });
})

app.post("/proxy", (req, res) => {
  fs.writeFile('./proxy.pac', req.body.text, function (err) {
    if (err) return console.log(err);
    res.send("/POST success")
  })

})

app.get('/device/register', async (req, res) => {
  const zz = new Device({
    deviceToken: "123",
    date: Date.now(),
    isActive: true,
    userToken: "zzx"
  })
  zz.save(err => console.log(err))
  res.send(zz);

})

const deviceInfoUrl = `http://fake.rktf.net:9999/api/fakeinfo`;
const deviceInfoOldUrl = `http://139.180.128.184:9999/api/fakeinfo/oldDevice`


// app.get("/test", (req,res) => {
//   const data = await dbapi.
//   res.send()
// })


app.get("/testip", async(req,res) =>{

  
  try {
    const ip = req.query.ip;

    const os = req.query.os;
    const device = req.query.device;
    const info = await dbapi.deviceInfo(ip, os, device, deviceInfoUrl);
    const ipInfo = await dbapi.requestIpApi(ip);
    info["Timezone"] = ipInfo;
     res.send(info);
  } catch (error) {
    res.send("error");
  }
 
})
app.get("/device/new", async (req, res) => {
  // var ip = req.headers['x-forwarded-for'] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||deviceInfoUrl
  //   (req.connection.socket ? req.connection.socket.remoteAddress : null);
  // console.log("Get new device");
  const ip = req.query.ip;
  const os = req.query.os;
  const device = req.query.device;

  // const info = await dbapi.deviceInfo(ip, os, device, deviceInfoUrl);
  // console.log(info);
  // const fixedInfo = await dataConverter.llDataForReplacement(info);
  // const region = await Region.findOne({});
  // if (region && fixedInfo["Timezone"]) {

  //   if (region["language"] != "") fixedInfo["Timezone"]["language"] = region["language"];
  //   if (region["iso639"] != "") fixedInfo["Timezone"]["iso639"] = region["iso639"];
  //   if (region["timezone"] != "") fixedInfo["Timezone"]["timezoneb"] = region["timezone"];
  // }



  res.send("Huydeptrai");
});
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}
const ipvn = (start,end) => {
  const arrayStart = start.split(".");
  const arrayEnd = end.split(".");
  let ipAddress = "";
  for (let i = 0; i < 4; i++){
    
    ipAddress += randomIntFromInterval(parseInt(arrayStart[i]),parseInt(arrayEnd[i])) + ".";
  }
  return ipAddress.slice(0,-1);
}

// app.get("/device/vn", async (req,res) => {
//     fs.readFile('./ipvn.txt', 'utf8',async function (err, data) {
//       if (err) {
//         return console.log(err);
//       }
//       const ipsRange = data.split("\n");
//       const selectedIPRange = ipsRange[Math.floor(Math.random()*ipsRange.length)];
//       const selectedRangeArray = selectedIPRange.split("-");

//         const ip = ipvn(selectedRangeArray[0],selectedRangeArray[1]);
//         const os = req.query.os;
//         const device = req.query.device;

//         const info = await dbapi.deviceInfo(ip, os, device, deviceInfoUrl);

//         const fixedInfo = await dataConverter.llDataForReplacement(info);
//         const region = await Region.findOne({});
//         if (region && fixedInfo["Timezone"]) {

//           if (region["language"] != "") fixedInfo["Timezone"]["language"] = region["language"];
//           if (region["iso639"] != "") fixedInfo["Timezone"]["iso639"] = region["iso639"];
//           if (region["timezone"] != "") fixedInfo["Timezone"]["timezoneb"] = region["timezone"];
//         }
//         res.send({ ...fixedInfo });
//     });

// })

app.get("/device/old", async (req, res) => {
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const os = req.query.os;
  const device = req.query.device;

  const info = await dbapi.deviceInfo(ip, os, device, deviceInfoOldUrl);

  const fixedInfo = await dataConverter.llDataForReplacement(info);

  res.send({ ...fixedInfo });
});

app.get("/manager", async (req, res) => {
  res.sendFile(path.join(__dirname + "/views/manager.html"));
})




app.get('/tempmail', async(req,res) => {

  var imap = new Imap({
      user: 'admin@follow24h.net',
      password: 'rW9A&aBVzqqmiA!',
      host: 'imap.yandex.com',
      port: 993,
      tls: true
  });
   const {username} = req.query;
  
   imap.once('ready',execute);
 
    imap.once('error', function(err) {
      console.log(err);
    });
    
    imap.once('end', function() {
      console.log('Connection ended');
    });
    
    imap.connect();

    function execute(){
         imap.openBox("INBOX", false, function(err, mailBox) {
            if (err){
              console.log(err);
              return;
            }
            imap.search(["ALL"], function(err, results) {
            if(!results || !results.length){console.log("No unread mails");imap.end();return;}
            /* mark as seen
            imap.setFlags(results, ['\\Seen'], function(err) {
                if (!err) {
                    console.log("marked as read");
                } else {
                    console.log(JSON.stringify(err, null, 2));
                }
            });*/

            var f = imap.fetch(results, { bodies: "" });
            f.on("message", processMessage);
            f.once("error", function(err) {
                return Promise.reject(err);
            });
            f.once("end", function() {
                console.log("Done fetching all unseen messages.");
                imap.end();
            });
            // console.log(mess);
        });


         })
    }
    function processMessage(msg, seqno) {
            console.log("Processing msg #" + seqno);
            // console.log(msg);

            var parser = new MailParser();
            parser.on("headers", function(headers) {
                // console.log("Header: " + JSON.stringify(headers));
            });

            parser.on('data', data => {
                if (data.type === 'text') {
                    const message = {
                      data: data.text, 
                      code: "test",
                      email: "test"
                    }
                }
            });

            msg.on("body", function(stream) {
                stream.on("data", function(chunk) {
                    parser.write(chunk.toString("utf8"));
                });
            });
            msg.once("end", function() {
                // console.log("Finished msg #" + seqno);
                parser.end();
            });
            
           
      }
  
})



http.listen(PORT, () => {
  console.log(`Luna server running at http://localhost:${PORT}/`);
});


