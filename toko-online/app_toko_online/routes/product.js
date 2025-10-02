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

// Detail produk
router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id); // pastikan angka
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).render('error', { 
      message: 'Produk tidak ditemukan', 
      error: {} 
    });
  }

  res.render('product-detail', { 
    title: product.name, 
    product: product 
  });
});


module.exports = router;