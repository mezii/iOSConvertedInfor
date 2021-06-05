const express = require("express");
const fakeSetting = require("./dataConverter");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbapi = require("./dbapi");
const { llData, llDataForReplacement } = require("./dataConverter");
const dataConverter = require("./dataConverter");
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);







const Shop = require("./database/Shop");
const Order = require("./database/Order");
const Product = require('./database/Product');
const Source = require('./database/Source');
const Store = require('./database/Store');
const GSheet = require('./database/GSheet');
const Combo = require('./database/Combo');
const User = require("./database/User");
const KiotViet = require("./database/KiotViet");



var path = require('path');
const { RSA_NO_PADDING, EDESTADDRREQ } = require("constants");


mongoose.set('useFindAndModify', false);


app.use("/img", express.static('img'));

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Connect db
mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true});

//

const defaultKiotVietAccount = {
  name: "Khác",
  client_id: "askjashasjkasdhasjkadshjashja",
  client_secret: "",
  accounts: [],
  products: []
}









// Pre-defined account
KiotViet.findOneAndUpdate({client_id: "askjashasjkasdhasjkadshjashja"},defaultKiotVietAccount,{upsert: true, new: true, setDefaultsOnInsert: true },function(err,data){
  if (err) console.log(err);
})



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
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
app.post("/kiotviet/activeAccount", async(req,res) => {
  const json =  JSON.stringify(req.body);
  fs.writeFile("./currentKVAccount.json",json,'utf8',function(err){

      if (err)
        res.send(err);

  })
  res.send(req.body);


})

app.get("/kiotviet/activeAccount", async(req,res) => {
  fs.readFile("./currentKVAccount.json",'utf8',function(err,data) {
    if (err) res.send(err)
    res.send(JSON.parse(data));

  })

})

app.post("/updateShipment", (req,res) => {
    // const data = req.body;
    // /// POSTBACK
    // fs.writeFile('./testpostback', JSON.stringify(data), 'utf8', function(err,data){
    //     if (err)
    //      console.log(err);
    //     else res.send(data);
    // })
    io.sockets.emit("chat message","atest ");
    res.send("Successcce");

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
    client_secret: req.body.client_secret,
    accounts: req.body.accounts,
    products: []
  })
  kv.save();
  res.send(kv);

})

app.get("/kiotviet/:client_id", async (req,res) => {

  res.send(await KiotViet.findOne({client_id: req.params.client_id}));

})

app.get("/kiotviet", async(req,res) => {

  res.send(await KiotViet.find({}).populate('products').populate('combos'));

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
    const existOrder = await Order.findOne({orderId: req.body.id});
    //
    const shop = await Shop.findOne({token: req.body.shopToken});
    const productsList = req.body.products;
 

    let orderObj  =  {
        shop: shop,
        order: {
          id: req.body.id,
          pick_name: req.body.pick_name,
          pick_money: req.body.pick_money,
          pick_address: req.body.pick_address,
          pick_district: req.body.pick_district,
          pick_province: req.body.pick_province,
          pick_ward: req.body.pick_ward,
          pick_tel: req.body.pick_tel,
          pick_email: req.body.pick_email,
          tel: req.body.tel,
          name: req.body.name,
          address:req.body.address,
          province: req.body.province,
          ward: req.body.ward,
          district: req.body.district,
          street: req.body.street,
          email: req.body.email,
          hamlet: "Khác",
          is_freeship: req.body.is_freeship,
          note: req.body.note,
          value: req.body.value,
          transport: req.body.transport,
          weight_option: "gram"

        },
        orderId: req.body.id,
        products: productsList,
        status: req.body.status,
        date: req.body.date,
        source: req.body.source,
        shopToken: shop.token,
        shopName: shop.name,
        note: req.body.note,
        kiotvietId: req.body.kiotvietId ? req.body.kiotvietId : (existOrder ? existOrder.kiotvietId : null),
        endUserName: req.body.endUserName ? req.body.endUserName : (existOrder ? existOrder.endUserName : null),
   
      }
      let order ;
    const result = await Order.findOneAndUpdate({orderId: req.body.id},orderObj,{upsert: true, new: true, setDefaultsOnInsert: true },function(error,result){
      if (error) console.log(error);
    })

    if (!shop.orders.includes(result._id)){
      shop.orders.push(result);
      shop.save();
   }
   

  
    
   


  res.send(result);

  
})
app.get('/order/deleteAll', async(req,res) => {
  res.send(await Order.deleteMany({}));

})
app.delete('/shop/:token', async(req,res) => {

  await Shop.deleteOne({token: req.params.token});
  res.send("Success");

})
app.delete('/product/:product_code', async(req,res) => {
  const product =  await Product.findOne({product_code: req.params.product_code});
  await KiotViet.updateOne({"products": product._id},{$pull: {"products": product._id}});
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
  const kiotviet = await KiotViet.findOne({_id: req.body.kiotvietId})
  const product = {
    product_code: req.body.product_code,
    name: req.body.name,
    value: req.body.value,
    price: req.body.price,
    weight: req.body.weight,
    height: req.body.height,
    width: req.body.width,
    long: req.body.long,
    note: req.body.note,
    quantity: req.body.quantity,
    kiotvietId: kiotviet
  };
  const result = await Product.findOneAndUpdate({product_code: req.body.product_code,kiotvietId: kiotviet},product,{upsert: true, new: true, setDefaultsOnInsert: true },function(error,result){
      if (error) res.send(error);
      return result;
  })
  if (!kiotviet.products.includes(result._id)){
     kiotviet.products.push(result);
     kiotviet.save();
  }
  

  
  res.send(result)



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
  const order = await Order.findOneAndDelete({orderId: req.params.orderId});
  await Shop.updateOne({"token": order.shopToken},{$pull: {"orders": order._id}});
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
    product_code: req.body.product_code ,
    kiotvietId: req.body.kiotvietId,
    quantity: req.body.quantity
  })

  // const result = await Product.findOneAndUpdate({product_code: req.body.product_code,kiotvietId: kiotviet},product,{upsert: true, new: true, setDefaultsOnInsert: true },function(error,result){
  //     if (error) res.send(error);
  //     return result;
  // })
  const kiotviet = await KiotViet.findOne({_id: req.body.kiotvietId});
  console.log(kiotviet)
  if (!kiotviet.combos.includes(combo._id)){
    kiotviet.combos.push(combo);
    kiotviet.save();
  }
 
  combo.save();
  res.send(combo);

})
app.delete('/combo/:product_code', async(req,res) => {
  const combo =  await Combo.findOne({product_code: req.params.product_code});
  await KiotViet.updateOne({"combos": combo._id},{$pull: {"combos": combo._id}});
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

// Kiotviet Account Schema
//eg . sub accounts schema for kiotviet api


io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(PORT, () => {
  console.log(`Luna server running at http://localhost:${PORT}/`);
});
