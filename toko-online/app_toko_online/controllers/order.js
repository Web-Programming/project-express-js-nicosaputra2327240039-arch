// app_toko_online/controllers/order.js
const Order = require("../models/orders");
const Product = require("../models/products");

// POST /api/orders : Membuat Pesanan Baru
const create = async (req, res) => {
    try {
        const { user, orderItems } = req.body;

        // 1. Validasi item pesanan dan hitung totalAmount
        let totalAmount = 0;
        let validatedItems = [];

        // Ambil semua ID produk dari orderItems
        const productIds = orderItems.map(item => item.product);

        // Cari semua produk sekaligus di database
        const productsFromDb = await Product.find({ _id: { $in: productIds } });

        // Buat map (peta) dari ID produk ke objek produk untuk akses cepat
        const productMap = productsFromDb.reduce((map, product) => {
            map[product._id.toString()] = product;
            return map;
        }, {});

        for (const item of orderItems) {
            const product = productMap[item.product];

            if (!product) {
                return res.status(404).json({
                    status: false,
                    message: `Produk dengan ID ${item.product} tidak ditemukan.`,
                });
            }

            if (item.quantity <= 0) {
                 return res.status(400).json({
                    status: false,
                    message: `Kuantitas produk harus lebih dari 0.`,
                });
            }
            
            // Gunakan harga produk yang ada di database saat ini
            const priceAtOrder = product.price;
            const subtotal = priceAtOrder * item.quantity;
            totalAmount += subtotal;

            validatedItems.push({
                product: item.product,
                quantity: item.quantity,
                priceAtOrder: priceAtOrder, // Menyimpan harga saat pesanan dibuat
            });
        }

        // 2. Buat objek Order baru
        const newOrder = new Order({
            user,
            orderItems: validatedItems,
            totalAmount,
            status: req.body.status || 'Pending',
        });

        // 3. Simpan data ke MongoDB
        const order = await newOrder.save();

        // 4. Kirim respon sukses
        res.status(201).json({
            status: true,
            message: "Pesanan berhasil dibuat",
            data: order
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({
                status: false,
                message: err.message
            });
        } else {
            res.status(500).json({
                status: false,
                message: 'Internal server error: ' + err.message
            });
        }
    }
};

// GET /api/orders : Mengambil semua Pesanan
const all = async (req, res) => {
    try {
        // Gunakan .populate('user', 'username email') untuk menampilkan detail user
        const orders = await Order.find({})
            .populate('user', 'username email'); 

        res.status(200).json({
            status: true,
            message: "Data pesanan berhasil diambil",
            data: orders
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Gagal memuat pesanan"
        });
    }
};

// GET /api/orders/:id : Mengambil detail satu Pesanan
const detail = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Gunakan .populate('user') dan .populate('orderItems.product')
        const order = await Order.findById(orderId)
            .populate('user', 'username email address') // Ambil detail user
            .populate('orderItems.product', 'name price description'); // Ambil detail produk di setiap item

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Pesanan tidak ditemukan"
            });
        }
        
        res.status(200).json({
            status: true,
            message: "Detail pesanan berhasil diambil",
            data: order
        });

    } catch (err) {
        if (err.name === 'CastError') {
             res.status(400).json({
                status: false,
                message: "Format ID pesanan tidak valid"
            });
        } else {
            res.status(500).json({
                status: false,
                message: "Gagal memuat detail pesanan"
            });
        }
    }
};

// PUT /api/orders/:id : Memperbarui Status Pesanan saja
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                status: false,
                message: "Status baru tidak valid atau tidak diisi."
            });
        }
        
        // Hanya update field 'status'
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { 
                new: true, 
                runValidators: true // Menjalankan validator enum
            }
        ).populate('user', 'username email');

        if (!order) {
            return res.status(404).json({
                status: false, 
                message: "Pesanan tidak ditemukan",
            });
        }
        
        res.status(200).json({
            status: true, 
            message: "Status pesanan berhasil diupdate", 
            data: order
        });
    } catch (err) {
        if (err.name === 'CastError') {
             res.status(400).json({
                status: false,
                message: "Format ID pesanan tidak valid"
            });
        } else if (err.name === 'ValidationError') {
            res.status(400).json({
                status: false,
                message: err.message // Menangkap error enum validation
            });
        } else {
            res.status(500).json({
                status: false, 
                message: 'Internal server error'
            });
        }
    }
};

module.exports = {
    all,
    create,
    detail,
    updateStatus,
};