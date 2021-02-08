const mongoose = require("mongoose");

// Creating the mongodb Schema
const carSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Tesla",
  },
  seat: {
    type: Number,
    default: 4,
  },
  color: {
    type: String,
    default: "Blue",
  },
  owner: {
    type: String,
    default: "John Doe",
  },
  phNumber: {
    type: Number,
    default: "000",
  },
  img: {
    type: String,
    default: "default.jpg",
  },
});

// Creating the model for the Schema
module.exports = mongoose.model("Car", carSchema);
