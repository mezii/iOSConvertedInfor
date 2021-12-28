const express = require('express');
const router = express.Router();
const mDevice = require("../database/mDevice");
const auth = require("./auth");
const jwt = require("jsonwebtoken");
router.post("/", auth,async (req,res) =>{
    const {serial,token} = req.body;
    // const decoded = jwt.verify(token);
    // const email = decoded.email;
    // const user = await User.findOne({email: email})
    // const numberOfUserDevice = await mDevice.find({email: email}).length;
    // const device = new mDevice({
    //     serial: serial,
    //     email: email, 
    // })
    // device.save();
    res.send('device');

})


module.exports = router;