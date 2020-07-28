const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ItemSchema = new Schema(
  { img:
  { data: Buffer, contentType: String }
 }
);

module.exports = Item = mongoose.model("pfps", ItemSchema);
