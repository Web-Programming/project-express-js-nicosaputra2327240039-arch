const express = require("express");
const routes = express.Router();
const productController = require("../../controllers/product");

//url create - post (/api/produk)
router.post("/", productController.create);
//url read all - get (/api/produk)
route.get("/", productController.all);
//url read one - detail - get (/api/produk/:id)
route.get("/:id", productController.detailproduk);
//url update - put (/api/produk/:id)
route.put("/:id", productController.update);
//url delete - delete (/api/produk/:id)
route.delete("/:id", productController.remove);

module.exports = route;
