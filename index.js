const express = require("express");
const fakeSetting = require("./dataConverter");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbapi = require("./dbapi");
const { llData, llDataForReplacement } = require("./dataConverter");
const dataConverter = require("./dataConverter");

const fs = require('fs');

const Shop = require("./database/Shop");
const Order = require("./database/Order");
const Product = require('./database/Product');
const Source = require('./database/Source');
const Store = require('./database/Store');
const GSheet = require('./database/GSheet');
const axios = require('axios');

const app = express();
var path = require('path');
const { reset } = require("nodemon");

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
// Connect db
mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true});

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

app.post("/shop", async (req,res) => {
  const shop = new Shop({
    name: req.body.name,
    token: req.body.token,
    orders: []

  })
  shop.save(err => console.log(err));
  res.send(shop);

})
app.get("/shop", async (req,res) => {
  const arr = await Shop.find({});
  res.send(arr);

})
app.get("/store/:id" , async (req,res) => {

  res.send( await Store.findById({_id: req.params.id}));

})

app.post("/store", async (req,res) => {
  const storeExist = Store.findOne({
    name: req.body.name
  }).remove().exec();
  const store = new Store({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    repName: req.body.reqName,
    date: req.body.date,
    source: req.body.source,
    address: req.body.address,
    province: req.body.province,
    district: req.body.district,
    ward: req.body.ward


  })
  store.save(err => console.log(err));
  res.send(store);

})

app.get("/store", async (req,res) => {
  const arr = await Store.find({});
  res.send(arr);

})

app.post("/gsheet", async(req,res) => {
  const sheet = new GSheet({
    name: req.body.sheetName,
    id: req.body.sheetId

  })
  sheet.save();
  res.send(sheet);

})

app.get("/gsheet", async(req,res) => {
  res.send(await GSheet.find({}));

})

app.post("/order", async(req,res) => {
    // check order exist
    await Order.deleteOne({orderId: req.body.orderId});
    //
    const shop = await Shop.findOne({token: req.body.shopToken});
    const productsList = req.body.products;
    let exportProducts = [];
    await Promise.all(productsList.map(async product => {
     try {
      exportProducts.push(await Product.findOne({product_code: product.product_code}))
     } catch (error) {
       console.log(error);
     }
    }));
    const miniOrder = req.body.order;
    let order = null;
  

    if (shop){
      order = new Order({
        shop: shop,
        order: miniOrder,
        orderId: req.body.orderId,
        products: exportProducts,
        status: req.body.status,
        date: req.body.date,
        source: req.body.source

      })
      order.save( err => console.log(err)); 
      shop.orders.push(order);
      shop.save();

    }


  res.send(order);

  
})
app.delete('/shop/:token', async(req,res) => {
  await Shop.deleteOne({token: req.params.token});
  res.send("Success");

})
app.get('/shop/:orderId' , async(req,res) => {

  const order =  await Order.findOne({orderId: req.params.orderId}).populate('shop');
  res.send({token: order.shop.token});
})
app.delete('/gsheet/:id', async(req,res) => {
  await GSheet.deleteOne({id: req.params.id});
  res.send("Success");

})

app.get('/product', async (req,res) => {
  res.send(await Product.find({}))
})

app.post('/product', async (req,res) => {
  if (!req.body.name || !req.body.product_code || !req.body.price || !req.body.weight){
    res.send({
      status: false,
      message: "Cannot create product without either name/product_code/price/weight"
    })
  }
  

  const product = new Product({
    product_code: req.body.product_code,
    name: req.body.name,
    value: req.body.value,
    price: req.body.price,
    weight: req.body.weight,
    height: req.body.height,
    width: req.body.width,
    long: req.body.long,
    note: req.body.note

  });

  var existProduct = Product.findOne({
    product_code: req.body.product_code
  }).remove().exec();

 
  product.save(function (error) {
    if (error){
      console.log(error)
      res.send({
        status: false,
        message: error
      })
    } else res.send(product)

  });


})

app.get('/source', async(req,res) => {
  res.send(await Source.find({}));

})

app.post('/source' , async (req,res) => {

  const existSource = Source.findOne({
    name: req.body.name
  }).remove().exec();
  const source = new Source({
    name: req.body.name,
    source: req.body.source

  })
  source.save(error => console.log(error));
  res.send(source);


})

// function UpdateOrderStatus(order,shopToken){
//   const axio
  

// }

app.get('/shop/token/:orderId', async(req,res) => {
  const order = await Order.findOne({
    orderId: req.params.orderId
  }).populate('shop');
  res.send(order.shop.token);
})

app.get('/order/ids', async(req,res) => {
  const orders = await Order.find({});
  let orderId = [];
  orders.forEach(order => {
    orderId.push(order.orderId);
  });
  res.send(orderId);

})
app.get('/order', async(req,res) => {
    res.send(await Order.find({}).populate('products').populate('shop'));

})
app.get('/device/register', async(req,res) => {
  const zz = new Device({ deviceToken: "123",
    date: Date.now(),
    isActive: true,
    userToken: "zzx"})
  zz.save( err => console.log(err))
  res.send(zz); 

})

const deviceInfoUrl = `http://139.180.128.184:9999/api/fakeinfo/`;
const deviceInfoOldUrl = `http://139.180.128.184:9999/api/fakeinfo/oldDevice`

app.get("/device/new", async (req, res) => {
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const os = req.query.os;
  const device = req.query.device;
  
  const info = await dbapi.deviceInfo(ip,os,device,deviceInfoUrl);
  console.log("ip is ",ip);
  
  const fixedInfo = await dataConverter.llDataForReplacement(info);

  res.send({ ...fixedInfo });
});

app.get("/device/old", async (req, res) => {
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
  const os = req.query.os;
  const device = req.query.device;
  
  const info = await dbapi.deviceInfo(ip,os,device,deviceInfoOldUrl);
  console.log("ip is ",ip);
  
  const fixedInfo = await dataConverter.llDataForReplacement(info);

  res.send({ ...fixedInfo });
});
