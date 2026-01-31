const request = require('request');
const apiOptions = {
    server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://production';
}

const renderTagList = (req, res, responseBody) => {
    res.render('tag-list', {
        title: 'List of Tags in Canary Historian',
        pageHeader: {
            title: 'Canary Tags',
            strapline: 'Test Out API Queries against endpoints on the Historian'
        },
        tags: responseBody,
        sidebar: 'List of Tags in Dataset'
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
            
        }
        renderTagList(req, res, body);
    });
  
};

const tagInfo = (req, res) => {
    res.render('tag-info', {title: 'Tag Information'});
};

const addTag = (req, res) => {
    res.render('tag-add', {title: 'Add Tag to Dataset'});
};


module.exports = {
    tagList,
    tagInfo,
    addTag
};