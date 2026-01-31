const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

const annotationsReadOne = (req, res) => {
   Tag
        .findById(req.params.tagid)
        .then((tag) => {
            if (tag.annotations && tag.annotations.length > 0) {
                annotation = tag.annotations.id(req.params.annotationid)
                if(!annotation){
                    return res
                        .status(404)
                        .json({"message": "annotation not found"});
                }
                else{
                    response = {
                        tag : {
                            name: tag.name,
                            id: req.params.tagid
                        },
                        annotation
                    }
                    return res
                            .status(200)
                            .json(response);
                }
            }
        }).catch((err) => {
            return res
                .status(404)
                .json({"message": "tag not found"});
        });

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