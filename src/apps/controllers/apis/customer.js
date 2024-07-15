const CustomerModel = require("../../models/customer")
exports.update = async (req, res) => {
    try{
    const body = req.body;
    const customerByPhone = await CustomerModel.findOne({phone: body.phone});
    if(customerByPhone && customerByPhone.email !== body.email){
        return res.status(401).json("Phone numbers exists")
    }
    await CustomerModel.updateOne({email:body.email}, {$set:{fullName: body.fullName, phone: body.phone, address: body.address}})
    return res.status(201).json("Update successful")
    }
    catch(err){
        return res.status(500).json({err})
    }
}