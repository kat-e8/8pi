const productsList = (req, res) => {
    res.render('product-list', {
        title: 'API Interactions with Canary Historian',
        pageHeader: {
            title: 'E8 API',
            strapline: 'Test Out API Queries against endpoints on the Historian'
        },
        products: [{
            name: 'Read Tags',
            description: 'Read all tags in the specified folder',
            rating: 3,
            price: 'n/a',
            options: ['DatasetX','DatasetY','DatasetZ']
        },{
            name: 'Read last known value',
            description: 'Pull last known value from historian',
            rating: 4,
            price: 'n/a',
            options: ['VirtualViewX','VirtualViewY','VirtualViewZ']
        },{
            name: 'Read Diagnostics',
            description: 'Query the health metrics of the Canary Historian',
            rating: 2,
            price: 'n/a',
            options: ['CPU','Memory','Strage']
        }],
        sidebar: 'Canary has Read and Write APIs that make it possible to automate interactions with the Historian. Using the APIs, one is able to pull data from the Views, create Datasets and Tags and write Tags to the Historian.'
    });
};

const productInfo = (req, res) => {
    res.render('product-info', {title: 'Ignition Info'});
};

const addReview = (req, res) => {
    res.render('product-review', {title: 'Add a Review'});
};


module.exports = {
    productsList,
    productInfo,
    addReview
};