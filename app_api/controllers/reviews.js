const mongoose = require('mongoose');
const Prod = mongoose.model('Product');

const reviewsReadOne = async (req, res) => {
    if(req.params.productId.length == 0 || !req.params.productId){
        return res
            .status(400)
            .json({"message":"invalid product Id"});
    }
    else{
        product = await Prod.findById(req.params.productId);
        if(!product){
            return res
                .status(404)
                .json({"message":"product not found"});
        }
        else{
            if(product.reviews && product.reviews.length > 0){
                review = product.reviews.id(req.params.reviewId);
                if(!review){
                    return res
                                .status(400)
                                .json({"message":"review not found."});
                }
                else{
                    response = {
                        product: {
                            product: product.name,
                            id: req.params.productId
                        },
                        review
                    };
                    return res
                        .status(200)
                        .json(response);
                }
            }
            else{
                return res
                    .status(404)
                    .json({"message":"reviews not found."});
            }
        }
        
    }
};

const doUpdateAverageRating = (product) => {
    if(product.reviews && product.reviews.length > 0){
        const count = product.reviews.length;
        const curRating =parseInt(product.reviews.slice(-1).pop()).rating;
        const total = product.reviews.reduce((acc, {rating}) => {
            return acc + rating;
        }, 0);
        product.rating = parseInt(total/count, 10);
        product.save().then(() => {
            console.log(`Average rating updated to ${product.rating}`);
        }).catch(err => {
            console.log(err);
        })

    }
};

const updateAverageRating = async (productId, res) => {
    const prod = await Prod.findById(productId);
    if(!prod) {
        res
            .status(404)
            .json({"message": "not found"});
    }
    else{
        doUpdateAverageRating(prod);       
    }
};

const doAddReview = (req, res, product) => {
    console.log('rating ', req.body.rating);
    const review = {
        author: req.body.author,
        rating: parseInt(req.body.rating),
        reviewText: req.body.reviewText
    };
    product.reviews.push(review);
    product.save().then(() => {
        updateAverageRating(product._id, res);
        const curReview = product.reviews.slice(-1).pop();
        res
            .status(201)
            .json(curReview);
    }).catch(err => {
        console.log(err);
    })

}

const reviewsCreateOne = async (req, res) => {
    if(req.params.productId.length == 0 || !req.params.productId){
        return res
            .status(400)
            .json({"message":"invalid product Id"});
    }
    else{
        product = await Prod.findById(req.params.productId);
        if(!product){
            return res
                .status(404)
                .json({"message":"product not found"});
        }
        else{
            doAddReview(req, res, product);
        }    
    }
};
const reviewsUpdateOne = async (req, res) => {
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
const reviewsDeleteOne = (req, res) => {
    res
    .status(204)
    .json({status: 'deleted one review'});
};

module.exports = {
    reviewsReadOne,
    reviewsCreateOne,
    reviewsUpdateOne,
    reviewsDeleteOne
};