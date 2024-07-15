const mongoose = require("../../common/database")();
const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    address:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }


}, {timestamps: true});
const CustomerModel = mongoose.model("Customers", customerSchema, "customers");
module.exports = CustomerModel;