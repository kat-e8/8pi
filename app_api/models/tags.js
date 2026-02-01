const mongoose = require('mongoose')


const annotationSchema = mongoose.Schema({
    author: String,
    comment: String,
    createdOn: {
        type: Date,
        'default': Date.now
    }
});

mongoose.model('Annotation', annotationSchema);


const tvSchema = mongoose.Schema({
    t: Date,
    v: Number,
});

mongoose.model('Tv', tvSchema);


const tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    value: {
        type: Number,
        'default': 0
    },
    quality: String, 
    annotations: [annotationSchema],
    tvs: [tvSchema]
});


mongoose.model('Tag', tagSchema);