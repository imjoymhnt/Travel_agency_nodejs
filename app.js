// Importing the requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");

// initialize app
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./public/uploads/images");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

// connecting to the mongodb database
mongoose.connect("mongodb://localhost:27017/travelsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creating the mongodb Schema
const carSchema = new mongoose.Schema({
  name: String,
  color: String,
  owner: String,
  phNumber: Number,
  img: String,
});

// Creating the model for the Schema
const Car = mongoose.model("Car", carSchema);

// Home page get request
app.get("/", (req, res) => {
  Car.find((err, foundCars) => {
    if (err) {
      res.redirect("/");
    } else {
      if (foundCars) {
        res.render("home", { cars: foundCars });
      }
    }
  });
});

// Create page get request
app.get("/add", (req, res) => {
  res.render("add", { title: "Add Cars" });
});

// Handling the Post request for the add from
app.post("/add", upload.single("image"), (req, res) => {
  console.log(req);
  const car = new Car({
    name: req.body.title,
    color: req.body.color,
    owner: req.body.owner,
    phNumber: req.body.phNumber,
    img: req.file.filename,
  });

  car.save();
  res.redirect("/add");
});

// Listining to the 3000 port
app.listen(3000, () => {
  "Listining to the port 3000";
});
