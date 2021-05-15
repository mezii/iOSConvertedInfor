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
const Combo = require('./database/Combo');
const User = require("./database/User");

const axios = require('axios');

const app = express();
var path = require('path');
const KiotViet = require("./database/KiotViet");


app.use("/img", express.static('img'));

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
  const storeExist = Store.deleteOne({
    name: req.body.name
  })
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

app.post("/kiotviet", async(req,res) => {
   await KiotViet.deleteOne({client_id: req.body.client_id});
  const kv = new KiotViet({
    name: req.body.name,
    client_id: req.body.client_id,
    client_secret: req.body.client_secret

  })
  kv.save();
  res.send(kv);

})

app.get("/kiotviet/:client_id", async (req,res) => {

  res.send(await KiotViet.findOne({client_id: req.params.client_id}));

})

app.get("/kiotviet", async(req,res) => {

  res.send(await KiotViet.find({}));

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
    const existOrder = await Order.findOne({orderId: req.body.orderId});
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

    let orderObj  =  {
        shop: shop,
        order: miniOrder,
        orderId: req.body.orderId,
        products: exportProducts,
        status: req.body.status,
        date: req.body.date,
        source: req.body.source,
        shopToken: shop.token,
        shopName: shop.name,
        note: req.body.note,
        kiotvietId: req.body.kiotvietId ? req.body.kiotvietId : (existOrder ? existOrder.kiotvietId : null),
        endUserName: req.body.endUserName ? req.body.endUserName : (existOrder ? existOrder.endUserName : null)
   
      }

    if (existOrder != null){
     
      order = await Order.findOneAndUpdate({orderId: req.body.orderId},orderObj);
      shop.orders.push(order);
      shop.save();

    } else {

       
      order = await Order.create(orderObj);
      shop.orders.push(order);
      shop.save();


    }
  
    
   


  res.send(order);

  
})
app.get('/order/deleteAll', async(req,res) => {
  res.send(await Order.deleteMany({}));

})
app.delete('/shop/:token', async(req,res) => {
  await Shop.deleteOne({token: req.params.token});
  res.send("Success");

})
app.delete('/product/:product_code', async(req,res) => {
 
  res.send( await Product.deleteOne({product_code: req.params.product_code}));

})

app.get('/product/:product_code', async(req,res) => {
 
  res.send( await Product.findOne({product_code: req.params.product_code}));

})
app.get('/combo/:product_code', async(req,res) => {
 
  res.send( await Combo.findOne({product_code: req.params.product_code}));

})
app.get('/shop/:orderId' , async(req,res) => {

  const order =  await Order.findOne({orderId: req.params.orderId}).populate('shop');
  res.send({token: order.shop.token});
})
app.delete('/gsheet/:id', async(req,res) => {
  await GSheet.deleteOne({id: req.params.id});
  res.send("Success");

})

app.delete('/store/:_id', async(req,res) => {
  res.send(await Store.deleteOne({_id: req.params._id}));
  
})
app.delete('/kiotviet/:clientId', async(req,res) => {
  await KiotViet.deleteOne({client_id: req.params.clientId});
  res.send("Success");

})
app.get('/product', async (req,res) => {
  res.send(await Product.find({}))
})

app.post('/product', async (req,res) => {
 
  var existProduct = Product.deleteOne({
    product_code: req.body.product_code
  });


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

 
 
  product.save(function (error) {
    if (error){
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


app.get('/order/:orderId', async(req,res) => {
    const order = await (await Order.findOne({orderId: req.params.orderId}).populate('shop').populate('products'));
    res.send(order);

})

app.delete('/order/:orderId', async (req,res) => {
  const order = await Order.deleteOne({orderId: req.params.orderId});
  res.send(order);
})

app.get('/shop/token/:orderId', async(req,res) => {
  const order = await Order.findOne({
    orderId: req.params.orderId
  }).populate('shop');
  res.send(order.shop.token);
})

app.get('/order/list/ids', async(req,res) => {
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

app.get('/combo', async (req,res) => {
  res.send(await Combo.find({}).populate('products'));

})

app.post('/combo', async (req,res) => {

  let productsArr = [];
  const pCodes = req.body.products;
  for (const item in pCodes){
      productsArr.push(pCodes[item]);

  }
  const combo = new Combo({
    name: req.body.name,
    products: productsArr,
    weight: req.body.weight,
    price: req.body.price,
    product_code: Date.now()})
  combo.save();
  res.send(combo);

})
app.delete('/combo/:product_code', async(req,res) => {
  
  res.send(await Combo.deleteOne({product_code: req.params.product_code}));
})


app.get("/manager", async(req,res) => {
  res.sendFile(path.join(__dirname + "/views/manager.html"));
})


app.post("/user", async (req,res) => {
  const existedUser =   await User.findOne({email: req.body.email});
  if (existedUser) return;
  const user = {
    email: req.body.email,
    password: req.body.password,
    isAuth: req.body.isAuth,
    isAdmin: req.body.isAdmin
  }
   await User.create(user);

 
  res.send(user);

})

app.delete("/user", async (req,res) => {
 const user =  await User.deleteOne({email: req.body.email});
  res.send(user)
})


app.get("/user", async (req,res) => {
  res.send(await User.find({}));

})


app.put("/user", async (req,res) => {

  const existedUser = await User.findOne({email: req.body.email});
  const user = await User.updateOne({email:req.body.email},{password: existedUser.password,isAuth: req.body.isAuth, isAdmin: req.body.isAdmin ? true : false})
  res.send(user);
})

app.post('/auth', async (req,res) => {

   const user =  await User.findOne({email: req.body.email});
   if (user == null){
    res.send("Not found");
    return;
   }
   if (user.password == req.body.password && user.isAuth == true){
    res.send("true")
 
   } else res.send("false");

   

})