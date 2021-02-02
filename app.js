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
  img: String,
});

const Car = mongoose.model("Car", carSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/add", (req, res) => {
  res.render("add", { title: "Add Cars" });
});

app.post("/add", (req, res) => {
  const car = new Car({
    name: req.body.title,
    color: req.body.color,
    owner: req.body.owner,
    phNumber: req.body.phNumber,
    img: req.body.image,
  });

  car.save();
});

app.listen(3000, () => {
  "Listining to the port 3000";
});
