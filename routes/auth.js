const express = require('express')
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Huydeptrai@@123@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
const User = require("../database/User");

async function isAuth(req,res,next){
    const {token,email} = req.cookies;
    console.log(req.cookies)
    if (!token) return res.send('login');
    try {
        const decoded = await jwt.verify(token,JWT_SECRET);
        const user = User.findOne({email: decoded.email});
        if (user) next() 
        else res.status(404).send("User Not Found");

    } catch (e) {
        res.status(400).send("Invalid token");
    }
}

module.exports = isAuth;