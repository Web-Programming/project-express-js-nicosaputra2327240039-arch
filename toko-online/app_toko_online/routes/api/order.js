
// app_toko_online/routes/api/order.js
const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/order");

function requireJson(req, res, next) {
    // Periksa apakah Content-Type adalah application/json
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(406).json({
            success: false,
            message: 'Header "Content-Type" harus "application/json".'
        });
    }
    next(); // Lanjutkan ke route handler
}

// POST /api/orders : Membuat Pesanan Baru
router.post("/", requireJson, orderController.create);

// GET /api/orders : Mengambil semua Pesanan
router.get("/", orderController.all);

// GET /api/orders/:id : Mengambil detail satu Pesanan
router.get("/:id", orderController.detail);

// PUT /api/orders/:id : Memperbarui Status Pesanan
// Catatan: Gunakan PUT untuk update status, hanya butuh body: { "status": "Shipped" }
router.put("/:id", requireJson, orderController.updateStatus);

// Catatan: DELETE untuk order jarang dilakukan, tapi jika perlu bisa ditambahkan.

module.exports = router;
