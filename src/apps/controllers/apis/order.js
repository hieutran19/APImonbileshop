const OrderModel = require("../../models/order");
const ProductModel = require("../../models/product");
const transporter = require("../../../libs/mail");
const _ = require("lodash");
const ejs = require("ejs");
const path = require("path");

exports.order = async (req, res)=>{
    const body = req.body;
    let totalPrice = 0;
    totalPrice = body.items.reduce((total, item)=>total + item.qty*item.price, 0);
    const order = {
        customer_id: body.customer_id,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone, 
        address: body.address,
        totalPrice,
        items: body.items,
    };
    await OrderModel(order).save();
    const idsPrd = body.items.map((item)=>item.prd_id);
    const products = await ProductModel.find({_id: {$in: idsPrd}}).lean();
    let items = [];
    for(let prd of products){
        const cart = _.find(body.items, {
            prd_id: prd._id.toString()
        });
        if(cart){
            cart.name = prd.name;
            items.push(cart);
        }
    } 
    // console.log(items);

    const html = await ejs.renderFile(path.join(req.app.get("views"), "mail.ejs"), {
        fullName: body.fullname,
        phone: body.phone,
        address: body.address,
        totalPrice,
        items,
    });
    await transporter.sendMail({
        from: '"Vietpro Shop" <quantri.vietproshop@gmail.com>',
        to: `sirtuanhoang@gmail.com, ${body.email}`,
        subject: "Xác nhận đơn hàng từ Vietpro Store",
        html,
    });

    res 
        .status(201).json({
            status: "success",
            message: "Create order successfully",
        });
}

exports.orderCustomer = async(req,res)=>{
    try{
        const {id} = req.params
        const orders = await OrderModel.find({customer_id: id}).sort({_id: -1})
        return res.status(200).json({
            status: "success",
            orders
        })
    }
    catch(error){
        res.status(500).json(error)
    }
}

exports.orderDetail = async(req,res)=>{
    try{
        const {id} = req.params
        const orders = await OrderModel.findById(id)
        const {items} = orders
        const prdIds = items.map(item=> item.prd_id)
        const products = await ProductModel.find({_id: {$in: prdIds}})

        let newItems = []
        for(let product of products) {
            const item = _.find(items, {prd_id: product._id.toString()})
            if(item){
                item.name = product.name
                item.image = product.image
                newItems.push(item)
            }
        }
        return res.status(200).json({
            status: "success",
            newItems
        })
    }
    catch(error){
        res.status(500).json(error)
    }
}

exports.cancelOrder = async(req, res) => {
    try{
        const {id} = req.params
        const order = await OrderModel.findOne({_id:id, status: 2})
        if(!order){
           return res.status(401).json("Order not found")
        }
        order.status = 0
        await order.save()
        return res.status(200).json({
            status: "success",
            order,
            message: "Order cancelled successfully"
        })
    }
    catch(error){
        return res.status(500).json(error)
    }
}