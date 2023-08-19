const express = require('express');
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const app = express();



app.listen(process.env.PORT, () =>
  console.log(`server started at ${process.env.PORT}`)
);