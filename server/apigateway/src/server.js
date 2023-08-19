const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
console.log(process.env.PORTNUMBER);



const app = express();


app.use("/auth", proxy("http://localhost:8100"));
app.use("/stream", proxy("http://localhost:8200"));
app.listen(process.env.PORTNUMBER, () =>
  console.log(`server started at ${process.env.PORTNUMBER}`)
);