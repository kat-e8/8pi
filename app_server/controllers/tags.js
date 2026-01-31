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
            renderTagList(req, res, {});
        }
        
    });
  
};

const renderDetailsPage = (req, res, tag) => {
    res.render('tag-info', {
        title: tag.name,
        pageHeader: {
            title: tag.name,
            sideBar: {
                context: 'random context that does not matter for now'
            }
        },
        tag
    });
};

const tagInfo = (req, res) => {
    path = '/api/tags/';
    requestOptions = {
        url: `${apiOptions.server}${path}${req.params.tagid}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, body) => {
        if(statusCode === 200) {
            renderDetailsPage(req, res, body);
        }
    });

};

const addTag = (req, res) => {
    res.render('tag-add', {title: 'Add Tag to Dataset'});
};


module.exports = {
    tagList,
    tagInfo,
    addTag
};