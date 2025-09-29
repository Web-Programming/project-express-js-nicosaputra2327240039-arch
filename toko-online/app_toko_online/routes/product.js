var express = require("express");
var router = express.Router();
var products = require('../../data/products.json'); 
// ⬆ Import express dan buat router baru.
// ⬆ Import data produk dari file JSON agar bisa digunakan di route.

// --- ROUTE SEARCH ---
router.get("/search", function (req, res, next) {
  // Tangkap query pencarian dari URL, misalnya /produk/search?q=mouse
  // Kalau tidak ada, default ke string kosong.
  const q = req.query.q ? req.query.q.toLowerCase() : "";

  // Buat variabel sementara berisi semua produk.
  let filteredProducts = products;

  // Jika query ada isinya, filter produk berdasarkan nama atau deskripsi.
  if (q) {
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  console.log("Query:", q, "Jumlah hasil:", filteredProducts.length);

  // Render halaman index.ejs dengan data produk hasil filter.
  // Kita juga kirimkan query supaya input di form tetap terisi.
  res.render("index", {
    title: q ? `hasil pencarian ${q}` : "Toko Online Sederhana",
    products: filteredProducts,
    query: q
  });
});

// --- ROUTE DETAIL PRODUK ---
router.get("/:id", function (req, res, next) {
  const productId = parseInt(req.params.id);
  console.log("Request produk ID:", productId);

  // Cari produk sesuai ID di array JSON
  const product = products.find(p => p.id === productId);

  // Jika produk tidak ditemukan, kirimkan error 404
  if (!product) {
    console.log("Produk tidak ditemukan!");
    return res.status(404).send("Produk tidak ditemukan!");
  }

  // Jika produk ditemukan, render product-detail.ejs dengan data produk.
  res.render("product-detail", {
    title: product.name,
    product: product,
  });
});

module.exports = router;