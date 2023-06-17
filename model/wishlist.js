var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectID = mongoose.Schema.Types.ObjectId;

var wishList = new Schema({
  title: { type: String, default: "Cool Wish List" },
  products: [{ type: ObjectID, ref: "Product" }],
});

module.exports = mongoose.model("Wishlist", wishList)