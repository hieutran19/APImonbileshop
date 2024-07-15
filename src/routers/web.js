const express = require("express");
const router = express.Router();
const CategoryController = require("../apps/controllers/apis/category");
const ProductController = require("../apps/controllers/apis/product");
const OrderController = require("../apps/controllers/apis/order");
const AuthorController = require("../apps/controllers/apis/auth");
const CustomerController = require("../apps/controllers/apis/customer");

const AuthMiddleware = require("../apps/middleware/auth")

router.get("/categories", CategoryController.index);
router.get("/categories/:id", CategoryController.show);
router.get("/categories/:id/products", CategoryController.productsCategory);
router.get("/products", ProductController.index);
router.get("/products/:id", ProductController.show);
router.get("/products/:id/comments", ProductController.comments);
router.post("/products/:id/comments", ProductController.storeComments);
router.post("/customer/login",AuthorController.loginCustomer)
router.post("/customer/register",AuthorController.registerCustomers)
router.post("/customer/update",CustomerController.update)
router.get("/customer/:id/orders", AuthMiddleware.verifyAuthenticationCustomer, OrderController.orderCustomer)
router.get("/customer/order/:id", AuthMiddleware.verifyAuthenticationCustomer, OrderController.orderDetail)
router.post("/order",AuthMiddleware.verifyAuthenticationCustomer, OrderController.order);
router.get("/order/:id/cancaled", AuthMiddleware.verifyAuthenticationCustomer, OrderController.cancelOrder)
router.get("/customer/refreshtoken", AuthorController.refreshToken);
router.get("/customer/test",AuthMiddleware.verifyAuthenticationCustomer,(req,res)=>{
    res.json("abc")
})



module.exports = router;