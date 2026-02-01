const request = require('request');
const apiOptions = {
    server: 'http://localhost:3000'
};

const canaryApiOptions = {
    server: 'https://canary.dala-cirius.ts.net:55236',
    apiToken: '31b08847-c1ba-4bb4-ad8f-e848c9d202b7',
    apiVersion: 'v2',
    viewName: 'canary'
};
if (process.env.NODE_ENV === 'production'){
    apiOptions.server = 'https://production';
}

const renderTagList = (req, res, responseBody) => {
    let message = null;
    if (!(responseBody instanceof Array)){
        message = "API lookup error";
    } else {
        message = "";
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


const addTag = (req, res) => {
   res.render('tag-add-form', {
        title: `Add Tag`,
        pageHeader: {title: `Add Tag`}
    });
};

const doAddTag = (req, res) => {
    path = `/api/tags`;
    postData = {
    name: req.body.name,
    description: req.body.description,
    quality: req.body.quality,
    value: req.body.value
   };
   requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'POST',
    json: postData
   };
   request(requestOptions, (err, {statusCode}, responseBody) => {
    if(statusCode === 201){
            res.redirect(`/tags`);
        } else {
            showError(req, res, statusCode);
        }
   });
};




//Canary Tags

const getCanaryTagPaths = (req, res) => {
    path = `/browseTags`;
    postData = {
        apiToken: `${canaryApiOptions.apiToken}`,
        path: '',
        deep: true,
        search: ''
    };
    requestOptions = {
        url: `${canaryApiOptions.server}/api/${canaryApiOptions.apiVersion}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, response) => {  
        //console.log(response.body);  
        if(response.body.statusCode === "Good"){
            fullTagPaths = response.body.tags;
            dataset = "{Diagnostics}.Sys";
            finalFullTagPaths = [];
            for (const fullTagPath of fullTagPaths){
                if (fullTagPath.includes(dataset)) {
                    finalFullTagPaths.push(fullTagPath);
                }
            }
            console.log(finalFullTagPaths);
            //res.redirect(`/tags`);
        } else {
            showError(req, res, response.body.statusCode);
        }
   });
};

//query canary api to get details of tag path specified
const getTagDetails = (req, res, fullTagPath) => {
        path = `/getTagData2`;
        postData = {
            apiToken: `${canaryApiOptions.apiToken}`,
            tags: [fullTagPath],
            startTime: 'now-2s',
            endTime: 'now'
        };
        requestOptions = {
        url: `${canaryApiOptions.server}/api/${canaryApiOptions.apiVersion}${path}`,
        method: 'POST',
        json: postData
        };
        request(requestOptions, (err, response) => {
            data = response.body.data;
            if (data){
                console.log(response.body.data);
            }

            /*if(response.body.statusCode === "Good"){
                data = response.body.data;
                console.log(data);
               // createCanaryTag(req, res, fullTagPath, data);
            } else {
                 showError(req, res, response.body.statusCode);
            }*/
        });
};

//pull from canary api and push to my express-based api
const createCanaryTag = (req, res, fullPath, tvsDict) => {
    //console.log(tvs);
     path = `/api/tags`;
     postData = {
         name: fullPath,
         description: 'none yet',
         quality: 'none yet',
         value: 0,
         tvs: tvsDict[fullPath]
    };
    requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, {statusCode}, responseBody) => {
     if(statusCode === 201){
            //console.log(responseBody);
            //res.redirect(`/tags`);
         } else {
             showError(req, res, statusCode);
         }
    });
};



module.exports = {
    tagList,
    tagInfo,
    addReview,
    doAddReview,
    doAddTag,
    addTag,
    getCanaryTagPaths,
    getTagDetails
}