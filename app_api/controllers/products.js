const mongoose = require('mongoose');
const Prod = mongoose.model('Product');

const productsReadAll = async (req, res) => {
    const products = await Prod.find({});
    if(products.length == 0){
        res
            .status(404)
            .json({"message":"no products found."});
    }
    else{
        res
            .status(200)
            .json(products);

    }
};
const productsCreateOne = async (req, res) => {
    //if one of the key,value pairs is missing server will crash    
    const product = await Prod.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            options: req.body.options.split(','),
            rating: parseInt(req.body.rating),
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
    });
    
    if(!product){
        res
            .status(400)
            .json({"message":"could not create product"});
    }
    else{
        res 
        .status(201)
        .json(product);
    }

};
const productsReadOne = async (req, res) => {
    //incorrect length of productId will cause the server to crash
    if(req.params.productId.length != 24 || !req.params.productId) {
        res
            .status(400)
            .json({"message":"invalid productId"});
    }
    else{
        const product = await Prod.findById(req.params.productId);
        if(!product){
            res
                .status(404)
                .json({"messsage": "product not found."});
        }
        else{
            res
            .status(200)
            .json(product);
        }
    }    
};
const productsUpdateOne = (req, res) => {
    if(req.params.product.length == 0 || !req.params.productId){
        res
            .status(400)
            .json({"message":"invalid product Id"});
    }
    else{

    }
    res
        .status(201)
        .json({status: 'updated one product'});
};
const productsDeleteOne = (req, res) => {

        res
            .status(400)
            .json({"message":"invalid product Id"});
   
};

module.exports = {
    productsReadAll,
    productsCreateOne,
    productsReadOne,
    productsUpdateOne,
    productsDeleteOne
};