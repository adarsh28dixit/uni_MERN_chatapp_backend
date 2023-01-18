const mongoose = require('mongoose')
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

const userSchema = new mongoose.Schema({
    name: {type: String,  required: false},
    email: {type: String, required: false},
    password: {type: String, required: false},
})

const User = mongoose.model("User", userSchema);
 
module.exports = User;