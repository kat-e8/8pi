const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

const annotationsReadOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});
};

const annotationsUpdateOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});
};

const annotationsDeleteOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});
};

const annotationsCreate = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});
};

module.exports = {
    annotationsReadOne,
    annotationsUpdateOne,
    annotationsDeleteOne,
    annotationsCreate
};