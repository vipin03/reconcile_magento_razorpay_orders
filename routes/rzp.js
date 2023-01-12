const express = require('express');
const router = express.Router();
const axios = require('axios');
const Razorpay = require('razorpay');
const bootstrap = require("../bootstrap");
const mysql = require('mysql');
const rzpController = require("../controllers/RzpController.js");
let dbConn = bootstrap.dbConn(mysql);

router.get('/', async (req,res)=>{
    try {
        let from ='2020-08-01';
        let to= '2023-01-01';
        let data=  await rzpController.getDashboardData(dbConn,from,to);
        return res.send(data);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;