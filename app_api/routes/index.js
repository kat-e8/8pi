const express = require('express');
const router = express.Router();

const ctrlTags = require('../controllers/tags');
const ctrlAnnotations = require('../controllers/annotations');

// tags
router
    .route('/tags')
    .get(ctrlTags.tagsListByDataset)
    .post(ctrlTags.tagsCreate);
router
    .route('/tags/:tagid')
    .get(ctrlTags.tagsReadOne)
    .put(ctrlTags.tagsUpdateOne)
    .delete(ctrlTags.tagsDeleteOne);

router
    .route('/tags/find/:name')
    .get(ctrlTags.findTagByName);

//annotations
router
    .route('/tags/:tagid/annotations/')
    .post(ctrlAnnotations.annotationsCreate);

router
    .route('/tags/:tagid/annotations/:annotationid')
    .get(ctrlAnnotations.annotationsReadOne)
    .put(ctrlAnnotations.annotationsUpdateOne)
    .delete(ctrlAnnotations.annotationsDeleteOne);

module.exports = router;