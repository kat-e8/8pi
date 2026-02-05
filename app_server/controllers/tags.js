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

const canaryWriteApiOptions = {
    server: 'https://canary.dala-cirius.ts.net:55293',
    apiToken: 'e90d3e51-9722-42d4-9b01-6f6ba5cbbb9d',
    version: '/api/v1',
    historianServer: '100.122.242.13'
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
    //collect tag information before rendering
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
            //now we're ready to render
            res.render('tag-list', {
                title: 'Canary Tags',
                pageHeader: {
                    title: 'Canary Tags',
                    strapline: 'Test Out API Queries against endpoints on the Historian',
                    
                },
                sidebar: {
                    context: '8pi is used to absorb Canary tags into a local MongoDB. To absorb a tag first select the tag from the dropdown, type in the duration using format \'xu\' where xez & u{s,m,h,d}. Clicking the delete button on an absorbed tag deletes it locally only, not in Canary.',
                    callToACtion: 'Call to Action!'},
                tags: responseBody,
                message,
                fullTagPaths,
            });
        } else {
            showError(req, res, response.body.statusCode);
        }
   });


    //generate list of options
};

const readFullTagPaths = (req, res) => {
    path = `/getVirtualViews`;
    postData = {
        apiToken: `${canaryApiOptions.apiToken}`,
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
            virtualViews = response.body.tags;
            //dataset = "{Diagnostics}.Sys.Memory Virtual";
            //collect data from form field named depth
            //with all tags collected in an array, we get details for all tag paths in the array
        } else {
            showError(req, res, response.body.statusCode);
        }
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
            strapline: 'Detailed Information'
        },
        sidebar: {
                context: 'is pulled into 8pi through an API call to Canary\'s Read API that interacts with the Views Service of the Historian.',
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
    //generate sesssion token
    path = `/getSessionToken`;
    canaryPayload = {
        apiToken:`${canaryWriteApiOptions.apiToken}`,
        historians:[`${canaryWriteApiOptions.historianServer}`],
        clientId:'nodejs',
        settings:{
            clientTimeout:300000,
            fileSize:8,
            autoCreateDatasets: true
        }
    };
    requestOptions = {
        url: `${canaryWriteApiOptions.server}${canaryWriteApiOptions.version}${path}`,
        method: 'POST',
        json: canaryPayload
    };
    request(requestOptions, (err, response) => {
        if(response.body.statusCode === 'Good'){
            //use session token to write to Canary
            //console.log(response.body.sessionToken);
            writeToHistorian(req, res, response.body.sessionToken)
            
        } else {
                showError(req, res, response.body.statusCode);
        }
    });

    ////You might not do this, but it's chance to add description

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

const writeToHistorian = (req, res, sessionToken) => {
    path = `/storeData`;
    tagPath = req.body.name;
    value = req.body.value;
    canaryPayload = {
        sessionToken: sessionToken,
        tvqs: {
            [tagPath]: [
                [
                    (new Date()).toISOString(),
                    value
                ]
            ]
        }
    };
    //console.log(canaryPayload.tvqs);
    requestOptions = {
        url: `${canaryWriteApiOptions.server}${canaryWriteApiOptions.version}${path}`,
        method: 'POST',
        json: canaryPayload
    };
    //request to write to canary api
    request(requestOptions, (err, response) => {
        if(response.body.statusCode === 'Good'){
            //done writing to historian
            console.log('done writing to historian');
            //res.redirect(`/tags`);
        } else {
            showError(req, res, response.body.statusCode);
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
            //dataset = "{Diagnostics}.Sys.CPU Usage Historian";
            //collect data from form field named depth
            dataset = req.body.depth;
            finalFullTagPaths = [];
            //only select paths that have dataset in them
            for (const fullTagPath of fullTagPaths) {
                if (fullTagPath.includes(dataset)) {
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
        //console.log(finalFullTagPaths);
        duration = req.body.duration;
        path = `/getTagData2`;
        postData = {
            apiToken: `${canaryApiOptions.apiToken}`,
            tags: finalFullTagPaths,
            startTime: `now-${duration}`,
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
                //get last known value and annotations
                //before you create a new object you have to hit the db api and find out if the tag exists
                //either create or update
                createNewCanaryTagsOnly(req, res, tagsDict);
               // createCanaryTag(req, res, fullTagPath, data);
            } else {
                 showError(req, res, response.body.statusCode);
            }
        });
};

const createNewCanaryTagsOnly = (req, res, tagsDict, lastValue) => {
 
    for (const tag in tagsDict){
        //hit mongo api to see if tag exists
        path = `/api/tags/find/${tag}`;
        requestOptions = {
            url: `${apiOptions.server}${path}`,
            method: 'GET',
            json: {}
        };
        request(requestOptions, (err, {statusCode}, responseBody) => {
            path = `/getAnnotations`;
            postData = {
                apiToken: `${canaryApiOptions.apiToken}`,
                tags: [tag],
                startTime: `now - ${duration}`,
                endTime: 'now'
            };
            requestOptions = {
                url: `${canaryApiOptions.server}/api/${canaryApiOptions.apiVersion}${path}`,
                method: 'POST',
                json: postData
            };
            //console.log(requestOptions);
            //call to canary api to get all tag paths on historian
            request(requestOptions, (err, response) => {  
                //console.log(response.body); 
                if(response.body.statusCode === "Good"){
                    annotationDict = ((response.body.annotations[0]));
                    annotationDict2 = (annotationDict.annotations[0]);
                    finalAnnotationDict = (annotationDict2["entries"]); 
                    //get last known value
                    path = `/getTagData2`;
                    postData = {
                        apiToken: `${canaryApiOptions.apiToken}`,
                        tags: [tag],
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
                            tagName = (Object.keys(tagsDict))[0];
                            lastKnownValue = ((tagsDict[tagName])[0]).v;
                            if(statusCode === 200){
                                //console.log('exists...updating');
                                updateCanaryTag(req, res, responseBody, tagsDict, lastKnownValue, finalAnnotationDict);
                            } else {
                                //doesnt exist
                                createCanaryTag(req, res, tagsDict, lastKnownValue, finalAnnotationDict);
                            }
                            //before you create a new object you have to hit the db api and find out if the tag exists
                        } else {
                            showError(req, res, response.body.statusCode);
                        }
                    });

                } else {
                    showError(req, res, response.body.statusCode);
                }
            });
        });  
    }
};

//hit mongo api to update existing record with new tvs
const updateCanaryTag = (req, res, responseBody, tagsDict, lastValue, annotationsDict) => {
    tagName = responseBody[0].name;
    tagid = responseBody[0]._id;
    path = `/api/tags/${tagid}`;
    postData = {
        tvs: tagsDict[tagName],
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
const createCanaryTag = (req, res, tvsDict, lastValue, annotationsDictList) => { 
    //console.log(annotationsDictList);
    annotation = {
        author: annotationsDictList[0]['user'],
        comment: annotationsDictList[0]['message'],
        createdOn: annotationsDictList[0]['entryTime']
    };
    console.log(annotation);
    key = Object.keys(tvsDict)[0];
     tagName = key;
     tvs = tvsDict[tagName];
     path = `/api/tags`;
     postData = {
         name: tagName,
         description: 'No descripiton',
         quality: 'good',
         value: lastValue,
         tvs: tvs,
         annotations: [annotation]
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

const deleteCanaryTag = (req, res) => {
    console.log('deleting...');
    path = `/api/tags/${req.params.tagid}`;
    requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'DELETE',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, responseBody) => {
     if(statusCode === 204){
            console.log('tag deleted locally.');
            //re-route to tag list after successful creation of new tag
            res.redirect(`/tags`);
         } else {
             showError(req, res, statusCode);
         }
    });
}

const getAnnotations = (req, res, tag, duration) => {
    path = `/getAnnotations`;
    postData = {
        apiToken: `${canaryApiOptions.apiToken}`,
        tags: [tag],
        startTime: `now - ${duration}`,
        endTime: 'now'
    };
    requestOptions = {
        url: `${canaryApiOptions.server}/api/${canaryApiOptions.apiVersion}${path}`,
        method: 'POST',
        json: postData
    };
    //console.log(requestOptions);
    //call to canary api to get all tag paths on historian
    request(requestOptions, (err, response) => {  
        //console.log(response.body); 
        if(response.body.statusCode === "Good"){
            annotationDict = ((response.body.annotations[0]));
            annotationDict2 = (annotationDict.annotations[0]);
            finalAnnotationDict = (annotationDict2["entries"]); 
           // return finalAnnotationDict;
            path = `/getTagData2`;
            postData = {
                apiToken: `${canaryApiOptions.apiToken}`,
                tags: [tag],
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
                    tagName = (Object.keys(tagsDict))[0];
                    value = ((tagsDict[tagName])[0]).v;
                    //before you create a new object you have to hit the db api and find out if the tag exists
                } else {
                    showError(req, res, response.body.statusCode);
                }
            });

        } else {
            showError(req, res, response.body.statusCode);
        }
   });

};

const getLastKnownValue = (req, res, tag) => {
        path = `/getTagData2`;
        postData = {
            apiToken: `${canaryApiOptions.apiToken}`,
            tags: [tag],
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
                tagName = (Object.keys(tagsDict))[0];
                value = ((tagsDict[tagName])[0]).v;
                return value;
                //before you create a new object you have to hit the db api and find out if the tag exists
            } else {
                 showError(req, res, response.body.statusCode);
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
    getTagsDetails,
    deleteCanaryTag
}