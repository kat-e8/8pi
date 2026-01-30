const express = require('express');
const router = express.Router();

const ctrlProducts = require('../controllers/products');
const ctrlReviews = require('../controllers/reviews');

router
    .route('/products')
    .get(ctrlProducts.productsReadAll)
    .post(ctrlProducts.productsCreateOne);

router
    .route('/products/:productId')
    .get(ctrlProducts.productsReadOne)
    .put(ctrlProducts.productsUpdateOne)
    .delete(ctrlProducts.productsDeleteOne);

router
    .route('/products/:productId/reviews')
    .post(ctrlReviews.reviewsCreateOne);

router
    .route('/products/:productId/reviews/:reviewId')
    .get(ctrlReviews.reviewsReadOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);

module.exports =  router;
