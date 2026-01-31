const mongoose = require('mongoose');
const Tag = mongoose.model('Tag')

const tagsReadOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});

};

const tagsListByDataset = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});

};

const tagsUpdateOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});

};

const tagsCreate = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});

};

const tagsDeleteOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});
};

module.exports = {
    tagsReadOne,
    tagsListByDataset,
    tagsUpdateOne,
    tagsCreate,
    tagsDeleteOne
};