// Importing the requiring modules
const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");
const Car = require("./models/carSchema");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// initialize app
const app = express();

app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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

app.use(
  session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// connecting to the mongodb database
mongoose.connect("mongodb://localhost:27017/travelsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.set("useCreateIndex", true);

const User = require("./models/authSchema");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// About get request
app.get("/about", (req, res) => {
  res.render("about");
});

// Contact get request
app.get("/contact", (req, res) => {
  res.render("contact");
});

// Manage delete get request
app.get("/manage/delete", (req, res) => {
  res.render("deleteCar");
});

app.get("/manage/edit/:id", (req, res) => {
  const id = req.params.id;
  Car.findById(id, (err, foundCar) => {
    if (!err) {
      res.render("edit", { title: "Edit Car", foundCar: foundCar });
    } else {
      res.redirect("/manage");
    }
  });
});

// app.get("/register", (req, res) => {
//   res.render("register");
// });
app.get("/login", (req, res) => {
  res.render("login");
});

// Manage page get request
app.get("/manage", (req, res) => {
  if (req.isAuthenticated()) {
    Car.find((err, foundCars) => {
      if (err) {
        res.redirect("/manage");
      } else {
        if (foundCars) {
          res.render("manage", { title: "Manage cars", cars: foundCars });
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

// Logout get request
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// app.post("/register", (req, res) => {
//   User.register(
//     { username: req.body.email },
//     req.body.password,
//     (err, user) => {
//       if (err) {
//         console.log(err);
//         res.redirect("/register");
//       } else {
//         passport.authenticate("local")(req, res, function () {
//           res.redirect("/manage");
//         });
//       }
//     }
//   );
// });

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.email,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/manage");
      });
    }
  });
});

// Handling the Post request for the add from
app.post("/add", upload.single("image"), (req, res) => {
  // handle default Image
  let img;
  if (!req.file) {
    img = "default.jpg";
  } else {
    img = req.file.filename;
  }
  const car = new Car({
    name: req.body.title,
    color: req.body.color,
    owner: req.body.owner,
    phNumber: req.body.phNumber,
    img: img,
  });

  car.save();
  res.redirect("/add");
});

// Delete post request
app.post("/manage/delete/confirm", (req, res) => {
  const carId = req.body.id;
  Car.findByIdAndRemove(carId, (err) => {
    if (!err) {
      res.redirect("/manage");
    } else {
      res.redirect("/manage");
    }
  });
});

// Edit post request
app.post("/manage/edit/:id", (req, res) => {
  let car = {};
  car.name = req.body.title;
  car.color = req.body.color;
  car.owner = req.body.owner;
  car.phNumber = req.body.phNumber;

  let query = { _id: req.params.id };
  Car.updateOne(query, car, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
      return;
    } else {
      res.redirect("/manage");
    }
  });
});

// Listining to the 3000 port
app.listen(3000, () => {
  "Listining to the port 3000";
});
