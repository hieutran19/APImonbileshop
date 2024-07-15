const ProductModel = require("../../models/product");
const CommentModel = require("../../models/comment");
const pagination = require("../../../libs/pagination");
exports.index = async (req, res)=>{
    const query = {};
    // Text Search
    const name = req.query.name || "";
    if(name){
        query.$text = {$search: name}
    }
    // Logic Query
    // query.is_featured = req.query.is_featured || false;
    // query.is_stock = req.query.is_stock || true;
    if(req.query.is_featured){
        query.is_featured = req.query.is_featured;
    }
    if(req.query.is_stock){
        query.is_stock = req.query.is_stock;
    }

    // Pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = page*limit - limit;
    const products = await ProductModel.find(query)
        .sort({_id: -1})
        .skip(skip)
        .limit(limit)
    res
        .status(200)
        .json({
            status: "success",
            filters: {
                is_featured: query.is_featured,
                is_stock: query.is_stock,
                page,
                limit,
            },
            data: {
                docs: products,
                pages: await pagination(ProductModel, query, page, limit),
            },
            
    });
}

exports.show = async (req, res)=>{
    const {id} = req.params;
    const product = await ProductModel.findById(id);
    res
        .status(200)
        .json({
            status: "success",
            data: product, 
        });
}
exports.comments = async (req, res)=>{
    const query = {};
    query.category_id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = page*limit - limit;
    const comments = await CommentModel.find(query)
        .sort({_id: -1})
        .skip(skip)
        .limit(limit);
    res
        .status(200)
        .json({
            status: "success",
            data:{
                docs: comments,
                pages: await pagination(CommentModel, query, page, limit),
            },
            
        });
}
exports.storeComments = async (req, res)=>{
    const {id} = req.params;
    const body = req.body;
    const comment = {
        name: body.name,
        email: body.email,
        content: body.content,
        product_id: id,
    }
    
    await new CommentModel(comment).save();
    res 
        .status(201)
        .json({
            status: "success",
            message: "create comment successfully"
        });
}