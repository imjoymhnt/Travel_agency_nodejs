const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// initialize app
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/travelsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const carSchema = new mongoose.Schema({
  name: String,
  color: String,
  owner: String,
  phNumber: Number,
});

const Car = mongoose.model("Car", carSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  "Listining to the port 3000";
});
