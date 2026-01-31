const express = require('express');
const router = express.Router();

const ctrlMain = require('../controllers/main');
const ctrlTags = require('../controllers/tags');
const ctrlOthers = require('../controllers/others');


/* GET home page. */
router.get('/', ctrlMain.index);

/* Tag Pages */
router.get('/tags', ctrlTags.tagList);
router.get('/tags/:tagid', ctrlTags.tagInfo);

router
    .route('/tags/:tagid/annotation/new')
    .get(ctrlTags.addReview)
    .post(ctrlTags.doAddReview);

/* About Page*/
router.get('/about', ctrlOthers.about)

module.exports = router;
