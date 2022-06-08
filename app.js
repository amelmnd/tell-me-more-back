const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
require("dotenv").config();

app.use(formidable());
app.use(cors());

//dev dependancies
var morgan = require("morgan");
app.use(morgan("tiny"));

/*form routes for create, read, update and delete form data  */
const formRoutes = require("./routes/form-routes");
app.use(formRoutes);

/*form routes for create, read, update and delete answer data  */
const answerRoutes = require("./routes/answer-routes");
app.use(answerRoutes);

app.get("*", (req, res) => {
  res.status(404).json({ message: "Oups 404" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
