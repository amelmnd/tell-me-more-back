const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

app.use(formidable());
app.use(cors());
require("dotenv").config();

mongoose.connect(process.env.MONGOOSE_URI);

//dev dependancies
var morgan = require("morgan");
app.use(morgan("tiny"));


app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
