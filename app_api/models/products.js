const mongoose = require('mongoose');

const openingTimeSchema = mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

const reviewSchema = mongoose.Schema({
    author: String,
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: String,
    createdOn: {
        type: Date,
        'default': Date.now
    }
});

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    rating: {
        type: Number,
        'default': 0,
        min: 0,
        max: 5
    },
    price: String,
    options: [String],
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]

});


mongoose.model('Product', productSchema);