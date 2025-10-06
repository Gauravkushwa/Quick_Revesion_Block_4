const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String, minLength: 6}
},
{
    versionKey: false
});

const AuthModel = mongoose.model("Auth", authSchema);

module.exports = AuthModel;