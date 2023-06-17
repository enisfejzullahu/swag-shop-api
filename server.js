var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/swag-shop");

var Product = require("./model/product");
var WishList = require("./model/wishlist");
const product = require("./model/product");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/product", function (request, response) {
  Product.find({}, function (err, products) {
    if (err) {
      response.send({ error: "Could not fetch products" });
    } else {
      response.send(products);
    }
  });
});

app.get("/product/:productId", function (request, response) {
  const productId = request.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) return response.send(err);
    if (!product) return response.status(404).send("Product not found");
    response.send(product);
  });
});

app.put("/product/:productId", function (request, response) {
  const productId = request.params.productId;
  const imgUrl = request.body.imgUrl;

  Product.updateOne(
    { _id: productId },
    { $set: { imgUrl: imgUrl } },
    (err, product) => {
      if (err) return response.send(err);
      if (!product)
        return response.status(500).send("Could not update product!");

      response.send("ImgUrl Updated!");
    }
  );
});

app.post("/product", function (request, response) {
  var product = new Product();
  product.title = request.body.title;
  product.price = request.body.price;
  product.imgUrl = request.body.imgUrl;
  product.save(function (err, savedProject) {
    if (err) {
      response.status(500).send({ error: "Could not save product" });
    } else {
      response.send(savedProject);
    }
  });
});

app.get("/wishlist", function (request, response) {
  WishList.find({})
    .populate({ path: "products", model: "Product" })
    .exec(function (err, wishLists) {
      if (err) {
        response.status(500).send({ error: "Could not get Wishlists" });
      } else {
        response.send(wishLists);
      }
    });
});

app.post("/wishlist", function (request, response) {
  var wishList = new WishList();
  wishList.title = request.body.title;
  wishList.save(function (err, newWishList) {
    if (err) {
      response.send(500).send({ error: "Could not create wishlist!" });
    } else {
      response.send(newWishList);
    }
  });
});

app.put("/product/:productId", function (request, response) {
  const productId = request.params.productId;
  const newImgUrl = request.body.imgUrl;

  if (!newImgUrl || newImgUrl === "") {
    response.status(500).send({ error: "You must provide an Image Url" });
  } else {
  }
});

app.put("/wishlist/product/add", function (request, response) {
  Product.findOne({ _id: request.body.productId }, function (err, product) {
    if (err) {
      response.status(500).send({ error: "Could not add item to wishlist" });
    } else {
      WishList.update(
        { _id: request.body.wishListId },
        { $addToSet: { products: product._id } },
        function (err, wishList) {
          if (err) {
            response
              .status(500)
              .send({ error: "Could not add item to wishlist" });
          } else {
            response.send("Succesfully added to wishlist");
          }
        }
      );
    }
  });
});

app.delete("/product/:productId", (request, response) => {
  const productId = request.params.productId;

  Product.findByIdAndDelete(productId, (err, product) => {
    if (err) {
      return response.status(500).send(err);
    }
    if (!product) {
      return response.status(404).send({ error: "Could not find product" });
    }

    response.send("Product deleted successfully!");
  });
});

app.listen(3004, function () {
  console.log("Swag Shop API runing on port 3004...");
});
