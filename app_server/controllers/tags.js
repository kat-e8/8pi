

const tagList = (req, res) => {
    res.render('tag-list', {
        title: 'List of Tags in Canary Historian',
        pageHeader: {
            title: 'Canary Tags',
            strapline: 'Test Out API Queries against endpoints on the Historian'
        },
        tags: [{
            name: 'Tag 1',
            description: 'Tag 1 Description',
            value: 3,
            quality: 'good',
            options: ['Hourly Average','Last Known Value','Peak Value']
        },{
            name: 'Tag 2',
            description: 'Tag 2 Description',
            value: 4,
            quality: 'good',
            options: ['Hourly Average','Last Known Value','Peak Value']
        },{
            name: 'Tag 3',
            description: 'Tag 3 Description',
            rating: 2,
            price: 'uncertain',
            options: ['Hourly Average','Last Known Value','Peak Value']
        }],
        sidebar: 'List of Tags in Dataset'
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