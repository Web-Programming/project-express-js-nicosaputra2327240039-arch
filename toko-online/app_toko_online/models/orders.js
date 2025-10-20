
// app_toko_online/models/orders.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Merujuk ke Model Product
        required: [true, 'Item pesanan harus memiliki referensi produk.'],
    },
    quantity: {
        type: Number,
        required: [true, 'Kuantitas harus diisi.'],
        min: [1, 'Kuantitas minimal 1.'],
    },
    priceAtOrder: {
        type: Number,
        required: [true, 'Harga produk saat pesanan harus dicatat.'],
        min: [0, 'Harga tidak boleh negatif.'],
    },
});

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Merujuk ke Model User
        required: [true, 'Pesanan harus memiliki referensi pengguna.'],
    },
    orderItems: {
        type: [OrderItemSchema], // Array of OrderItemSchema
        required: [true, 'Daftar item pesanan tidak boleh kosong.'],
    },
    totalAmount: {
        type: Number,
        required: [true, 'Jumlah total pesanan harus dihitung.'],
        min: [0, 'Jumlah total tidak boleh negatif.'],
    },
    status: {
        type: String,
        default: 'Pending',
        enum: {
            values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            message: '{VALUE} bukan status pesanan yang valid.',
        },
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

// Buat model dari Schema
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
