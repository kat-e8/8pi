const request = require('request');
const apiOptions = {
    server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://production';
}

const renderTagList = (req, res, responseBody) => {
    let message = null;
    if (!(responseBody instanceof Array)){
        message = "API lookup error";
    } else {
        message = "No tags found in dataset";
    }
    res.render('tag-list', {
        title: 'List of Tags in Canary Historian',
        pageHeader: {
            title: 'Canary Tags',
            strapline: 'Test Out API Queries against endpoints on the Historian',
            callToAction: 'Random call to action',
            context: 'random context'
        },
        tags: responseBody,
        message
    });

};

const showError = (req, res, status) => {
    let title = '';
    let content = '';
    if (status === 404) {
        title = '404,  page not found.';
        content = 'Oh dear, it looks like you can\'t find the page. Sorry. '
    } else {
        title = `${status}, something\'s gone wrong.`
        content = 'Something, somewhere has gone a little wrong.'
    }
    res.status(status);
    res.render('generic-text', {
        title,
        content
    });
};

const tagList = (req, res) => {
    const path = '/api/tags';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, body) => {
        if(statusCode === 200 && body.length){
            renderTagList(req, res, body);
        } else {
            showError(res, res, statusCode);
        }
        
    });  
};

const renderDetailsPage = (req, res, tag) => {
    res.render('tag-info', {
        title: tag.name,
        pageHeader: {
            title: tag.name,
            strapline: 'random strapline'
        },
        sidebar: {
                context: 'random context that does not matter for now',
                callToACtion: 'Call to Action!'
        },
        tag
    });
};

const addTag = (req, res) => {
    res.render('tag-add', {title: 'Add Tag to Dataset'});
};

const renderAnnotationForm = (req, res, {name}) => {
    res.render('tag-annotation-form', {
        title: `Annotate ${name} on 8pi`,
        pageHeader: {title: `Annotate ${name}`}
    });
}

const getTagInfo = (req, res, callback) => {
    const path = `/api/tags/${req.params.tagid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, body) => {
        let data = body;
        if (statusCode === 200){
            callback(req, res, data);
        } else {
            showError(req, res, statusCode);
        }
    });
};


const tagInfo = (req, res) => {
    getTagInfo(req, res, 
        (req, res, responseData) => renderDetailsPage(req, res, responseData));
};

const addReview = (req, res) => {
    getTagInfo(req, res, 
        (req, res, responseData) => renderAnnotationForm(req, res, responseData)
    );
};

const doAddReview = (req, res) => {
    tagid = req.params.tagid;
    path = `/api/tags/${tagid}/annotations`;
    postData = {
        author: req.body.name,
        comment: req.body.comment
    };
    requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, {statusCode}, body) => {
        if(statusCode === 201){
            res.redirect(`/tags/${tagid}`);
        } else {
            showError(req, res, statusCode);
        }
    });
};


module.exports = {
    tagList,
    tagInfo,
    addTag,
    addReview,
    doAddReview
};