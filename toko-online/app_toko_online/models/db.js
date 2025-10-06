// INSTALL PAKET MONGOOSE MENGGUNAKAN NPM : NPM INSTALL MONGOOSE
const mongoose = require("mongoose");
const dbURI = "mongodb://localhost:27017/paw2-si5c";

mongoose.connect(dbURI, {});

mongoose.connection.on("conneted", () => {
    console.log(`mongoose connected to ${dbURI}`);
});

mongoose.connection.on("error", (err) => {
    console.log("mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("mongoose disconnected");
});