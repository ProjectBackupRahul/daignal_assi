const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema For thr mobile phone details 
const DataSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  images: [],
  lastModifiedDate: {
    type: Date,
    default: Date.now
  }
});

const Data = mongoose.model('Data', DataSchema);

module.exports = Data;