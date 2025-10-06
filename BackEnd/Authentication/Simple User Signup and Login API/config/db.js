const mongoose = require('mongoose');


const ConnectDB = async() =>{
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/auth");
        console.log("✅ connected to DB")
    } catch (error) {
        console.log("❌ failed to connect DB", error.message)
    }
};

module.exports = ConnectDB;