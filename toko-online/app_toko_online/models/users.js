const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Nama pengguna harus diisi.'],
    unique: true, // Tidak boleh ada username yang sama
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi.'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Harap isi alamat email yang valid',
    ], // Regex untuk validasi format email
  },
  password: {
    type: String,
    required: [true, 'Kata sandi harus diisi.'],
    minlength: [6, 'Kata sandi minimal 6 karakter.'],
    select: false, // Penting: Jangan sertakan password saat query GET
  },
  address: {
    type: String,
    default: 'Belum diisi',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Buat model dari Schema
const User = mongoose.model('User', UserSchema);
module.exports = User;