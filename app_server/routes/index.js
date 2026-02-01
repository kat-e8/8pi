const express = require('express');
const router = express.Router();

const ctrlMain = require('../controllers/main');
const ctrlTags = require('../controllers/tags');
const ctrlOthers = require('../controllers/others');


/* GET home page. */
router.get('/', ctrlMain.index);

/* Tag Pages */
router.get('/tags/:tagid', ctrlTags.tagInfo);
router.get('/add-tag', ctrlTags.addTag);

router
    .route('/tags')
    .get(ctrlTags.tagList)
    //.get(ctrlTags.getTagDetails)
    .post(ctrlTags.doAddTag);

router
    .route('/refresh')
    .post(ctrlTags.browseAndUpdateCanaryTags);


router
    .route('/tags/:tagid/annotation/new')
    .get(ctrlTags.addReview)
    .post(ctrlTags.doAddReview);

/* About Page*/
router.get('/about', ctrlOthers.about)

module.exports = router;
