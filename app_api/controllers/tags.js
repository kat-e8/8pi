const mongoose = require('mongoose');
const Tag = mongoose.model('Tag')

const tagsReadOne = (req, res) => {
    Tag
        .findById(req.params.tagid)
        .then((tag) => {
            if (!tag) {
                return res
                    .status(404)
                    .json({"message": "tag not found."});
            }
            else {
                return res
                    .status(200)
                    .json(tag);
            }
        }).catch((err) => {
            return res
                .status(404)
                .json({"message": "tagid not found"});
        });
};

const tagsListByDataset = (req, res) => {
    Tag
        .find()
        .then((tags) => {
            if(tags && tags.length > 0){
                return res
                        .status(200)
                        .json(tags)
            }
        })
        .catch((err) => {
                return res
                    .status(404)
                    .json({"message": "tag list empty"});
        });

};

const tagsUpdateOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});

};

const tagsCreate = (req, res) => {
    Tag
        .create({
            name: req.body.name,
            description: req.body.description,
            value: req.body.value,
            quality: req.body.quality
           // options: req.body.options.split(",")

        }).then((tag) => {
            return res
                    .status(201)
                    .json(tag);

        }).catch((err) => {
            return res
                    .status(400)
                    .json(err);
        });
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