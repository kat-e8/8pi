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
    if(!req.params.tagid || !req.params.annotationid){
        return res
                .status(400)
                .json({"message": "tag id and annotation id required"});
    } else {
        Tag
        .findById(req.params.tagid)
        .select('annotations')
        .then((tag) => {
            if (tag.annotations && tag.annotations.length > 0) {
                annotation = tag.annotations.id(req.params.annotationid)
                if(!annotation){
                    return res
                        .status(404)
                        .json({"message": "annotation not found"});
                }
                else{
                    if(req.body.author){
                        annotation.author = req.body.author;
                    }
                    if(req.body.comment){
                        annotation.comment = req.body.comment;
                    }
                    tag
                        .save()
                        .then((tag) => {
                            return res
                                    .status(200)
                                    .json(annotation);

                        }).catch((err) => {
                            return res
                                    .status(404)
                                    .json({"message": "could not save changes."});
                        });   
                }
            }
        }).catch((err) => {
            return res
                .status(404)
                .json({"message": "tag not found"});
        });

    }
};

const annotationsDeleteOne = (req, res) => {
    res
        .status(200)
        .json({"status": "success"});
};

const annotationsCreate = (req, res) => {
    tagid = req.params.tagid;
    if(tagid){
        Tag
            .findById(tagid)
            .then((tag) => {
                doAddAnnotation(req, res, tag);

            }).catch((err) => {
                return res
                        .status(404)
                        .json({"message": "tag not found"});
            });
    }
    else{
        return res
                .status(404)
                .json({"message": "supply tag id"});
    }
};

const doAddAnnotation = (req, res, tag) => {
    if(!tag){
        return res
                .status(404)
                .json({"message":"tag not found"});
    } else {
        const { author, comment } = req.body;
        tag.annotations.push({
            author,
            comment
        });
        tag
            .save()
            .then((tag) => {
                const thisAnnotation = tag.annotations.slice(-1).pop();
                return res
                        .status(201)
                        .json(thisAnnotation);

            }).catch((err) => {
                return res
                        .status(400)
                        .json(err);
            });
    }
}

module.exports = {
    annotationsReadOne,
    annotationsUpdateOne,
    annotationsDeleteOne,
    annotationsCreate
};