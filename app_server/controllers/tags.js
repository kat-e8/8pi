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




////////////////////////////////////////////Canary Tags////////////////////////////////////////////////
const browseAndUpdateCanaryTags = (req, res) => {
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
    //call to canary api to get all tag paths on historian
    request(requestOptions, (err, response) => {  
        //console.log(response.body);  
        if(response.body.statusCode === "Good"){
            fullTagPaths = response.body.tags;
            //dataset = "{Diagnostics}.Sys.Memory Virtual";
            //collect data from form field named depth
            tagDepth = req.body.depth;
            finalFullTagPaths = [];
            //only select paths that have dataset in them
            for (const fullTagPath of fullTagPaths) {
                if (fullTagPath.includes(tagDepth)) {
                    finalFullTagPaths.push(fullTagPath);
                }
            }
            //with all tags collected in an array, we get details for all tag paths in the array
            getTagsDetails(req, res, finalFullTagPaths);
        } else {
            showError(req, res, response.body.statusCode);
        }
   });
};

//query canary api to get details of tag path specified
const getTagsDetails = (req, res, finalFullTagPaths) => {
        path = `/getTagData2`;
        postData = {
            apiToken: `${canaryApiOptions.apiToken}`,
            tags: finalFullTagPaths,
            startTime: 'now-10s',
            endTime: 'now'
        };
        requestOptions = {
            url: `${canaryApiOptions.server}/api/${canaryApiOptions.apiVersion}${path}`,
            method: 'POST',
            json: postData
        };
        //call getTagData2 endpoint on Canary Historian for tag path's tvs
        request(requestOptions, (err, response) => {
            data = response.body.data;
            if(response.body.statusCode === "Good"){
                tagsDict = response.body.data;
                //before you create a new object you have to hit the db api and find out if the tag exists
                //either create or update
                createNewCanaryTagsOnly(req, res, tagsDict);
               // createCanaryTag(req, res, fullTagPath, data);
            } else {
                 showError(req, res, response.body.statusCode);
            }
        });
};

const createNewCanaryTagsOnly = (req, res, tagsDict) => {
    for (const tag in tagsDict){
        //hit mongo api to see if tag exists
        path = `/api/tags/find/${tag}`;
        requestOptions = {
            url: `${apiOptions.server}${path}`,
            method: 'GET',
            json: {}
        };
        request(requestOptions, (err, {statusCode}, responseBody) => {
            if(statusCode === 200){
                //console.log('exists...updating');
                updateCanaryTag(req, res, responseBody, tagsDict);

            } else {
                //doesnt exist
                createCanaryTag(req, res, tagsDict);
            }
        });  
    }
};

//hit mongo api to update existing record with new tvs
const updateCanaryTag = (req, res, responseBody, tagsDict) => {
    tagName = responseBody[0].name;
    tagid = responseBody[0]._id;
    path = `/api/tags/${tagid}`;
    postData = {
        tvs: tagsDict[tagName]
    };
    requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'PUT',
        json: postData
    };
    //update tag with tvs received from Canary
    request(requestOptions, (err, {statusCode}, responseBody) => {
        if(statusCode === 200){
            console.log('updated existing tag.');
            //redirect to tags list after successfull update
            res.redirect(`/tags`);
        } else {
            showError(req, res, statusCode);
        }
    });
};


//pull from canary api and push to my express-based api
const createCanaryTag = (req, res, tvsDict) => {
     key = Object.keys(tvsDict)[0];
     console.log(key);
     tagName = key;
     tvs = tvsDict[tagName];
     path = `/api/tags`;
     postData = {
         name: tagName,
         description: 'none yet',
         quality: 'none yet',
         value: 0,
         tvs: tvs
    };
    requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, {statusCode}, responseBody) => {
     if(statusCode === 201){
            console.log('created new tag.');
            //re-route to tag list after successful creation of new tag
            res.redirect(`/tags`);
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
    browseAndUpdateCanaryTags,
    getTagsDetails
}