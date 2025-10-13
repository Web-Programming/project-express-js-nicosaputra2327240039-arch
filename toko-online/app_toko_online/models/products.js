const mongoose = require("mongoose");
//buat skema Produk
const ProductSchema = new mongoose.Schema({
    //tidak perlu mebuat properti id karena akan dibuat otomatis
    //dengan nama _id
    name: {
        type : String,
        required: [true, "Nama produk harus diisi"],
        trim: true, //menghilangkan spasi di awal dan akhir
    },
    price: {
        type : Number,
        required : [true, "Harga produk harus diisi"],
        min: [1000, "Harga produk minimal 1000"], //nilai minimum
        //max: [1000, "Harga produk minimal 1000"]
    },
    description: {
        type : String,
        required: false, //menandakan kolom wajib diisi atau tidak
    },
    stock: {
        type: Number,
        default: 0, //memberikan nilai bawaan/default
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

//Buat model dari Schema
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;