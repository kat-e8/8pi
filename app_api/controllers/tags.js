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
    if(!req.params.tagid){
        return res
                .status(404)
                .json({"message": "tag not found, tag id required."});
    } else {
        Tag
            .findById(req.params.tagid)
            .select('-annotations')
            .then((tag) => {
                if(req.body.name){
                    tag.name = req.body.name;
                }
                if(req.body.description){
                    tag.description = req.body.description;
                }
                if(req.body.quality){
                    tag.quality = req.body.quality;                
                }
                if(req.body.value){
                    tag.value = req.body.value;
                }
                tag
                    .save()
                    .then((tag) => {
                        return res
                                .status(200)
                                .json(tag);
                    }).catch((err)=> {
                        return res
                                .status(404)
                                .json({"message": "tagid not found"});
                    });

            }).catch((err) => {
                return res
                        .status(400)
                        .json(err);
            });
    }
};

const tagsCreate = (req, res) => {
    Tag
        .create({
            name: req.body.name,
            description: req.body.description,
            value: req.body.value,
            quality: req.body.quality,
            tvs: req.body.tvs

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
    const {tagid} = req.params;
    if(tagid){
        Tag
            .findByIdAndDelete(tagid)
            .then((tag) => {
                return res
                        .status(204)
                        .json(null);

            }).catch((err) => {
                return res
                        .status(404)
                        .json({"message": "tag not found"});
            });
    } else {
        return res
                .status(404)
                .json({"message": "tag id required"});
    }
};

const findTagByName = (req, res) => {
    const tagName = req.params.name;
    Tag
        .find({name: tagName})
        .select('name _id')
        .then((tag) => {
            if(tag && tag.length > 0){
                return res
                    .status(200)
                    .json(tag);
            } else {
                return res
                        .status(404)
                        .json({});
            }
        }).catch((err) => {
            return res
                    .status(404)
                    .json({});
        });
};

module.exports = {
    tagsReadOne,
    tagsListByDataset,
    tagsUpdateOne,
    tagsCreate,
    tagsDeleteOne,
    findTagByName
};