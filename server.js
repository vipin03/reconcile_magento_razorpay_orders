const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let rzpRouter = require("./routes/rzp");
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

// routes
app.use("/rzp", rzpRouter);

app.listen(3002,function(){
 console.log("connected ");
});