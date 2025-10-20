const User = require("../models/users");

exports.test = (req, res) => {
    res.status(200).json({
        status: true,
        message: "Test endpoint berhasil"
    });
}
//CRUD controller untuk User
//Read All - Mengambil semua data user
const all = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude password dari hasil
        res.status(200).json({
            status: true,
            message: "Data user berhasil diambil",
            data: users
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Gagal memuat user"
        });
    }
};

//Create/Insert Data User
const create = async (req, res) => {
    try {
        //1. ambil data dari request body
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            isAdmin: req.body.isAdmin || false
        });
        //2. simpan data ke mongodb melalui model User
        const user = await newUser.save();

        //3. hapus password dari response
        const userResponse = user.toObject();
        delete userResponse.password;

        //4. kirim respon sukses ke user
        res.status(200).json({
            status: true,
            message: "User berhasil disimpan",
            data: userResponse
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({
                status: false,
                message: err.message
            });
        } else if (err.code === 11000) {
            // Error duplicate key (username atau email sudah ada)
            res.status(400).json({
                status: false,
                message: "Username atau email sudah terdaftar"
            });
        } else {
            res.status(500).json({
                status: false,
                message: 'Internal server error'
            });
        }
    }
};

//Read One/Detail User
const detailuser = async (req, res) => {
    try {
        //ambil id
        const userId = req.params.id;
        //cari berdasarkan id 
        const user = await User.findById(userId).select('-password'); // Exclude password

        //kirim respon error jika user tidak ditemukan
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User tidak ditemukan"
            });
        }
        //kirim respon sukses
        res.status(200).json({
            status: true,
            message: "Detail user berhasil diambil",
            data: user
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Gagal memuat detail user"
        });
    }
};

//Update Data User
const update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,  //mengembalikan dokumen yang telah diupdate
            runValidators: true //menjalankan validasi schema saat update
        }).select('-password'); // Exclude password dari response

        if (!user) {
            res.status(404).json({
                status: false,
                message: "User tidak ditemukan",
            });
        }
        //kirim respon sukses
        res.status(200).json({
            status: true,
            message: "User berhasil diupdate",
            data: user
        });
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(400).json({
                status: false,
                message: "Format ID tidak valid"
            });
        } else if (err.name === 'ValidationError') {
            res.status(400).json({
                status: false,
                message: err.message
            });
        } else if (err.code === 11000) {
            res.status(400).json({
                status: false,
                message: "Username atau email sudah terdaftar"
            });
        } else {
            res.status(500).json({
                status: false,
                message: 'Internal server error'
            });
        }
    }
};

//Delete/Remove/Destroy Data User
const remove = async (req, res) => {
    try {
        //hapus menggunakan method findByIdAndDelete
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) { //kirim respon gagal
            res.status(404).json({
                status: false,
                message: "User tidak ditemukan",
            });
        } else {
            //kirim respon sukses
            res.status(200).json({
                status: true,
                message: "User berhasil dihapus"
            });
        }
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(400).json({
                status: false,
                message: "Format ID tidak valid"
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
    detailuser,
    update,
    remove
};