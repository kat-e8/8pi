const ignitionList = (req, res) => {
    res.render('ignition', {
        title: 'Ignition 8.3 comes with an onboard REST API',
        pageHeader: {
            title: 'E8 API',
            strapline: 'Configure Gateway using API Requests'
        },
        products: [{
            name: 'Devices',
            description: 'Query Status of Devices',
            rating: 3,
            price: 'n/a',
            options: ['Simulated Device','Siemens Driver','Modbus']
        },{
            name: 'Databases',
            description: 'Interact with Connected Databases',
            rating: 4,
            price: 'n/a',
            options: ['Postgres','MSSQL','MongoDB', 'PostGres']
        },{
            name: 'Gateway Networks',
            description: 'Query the health metrics of the Canary Historian',
            rating: 2,
            price: 'n/a',
            options: ['CPU','Memory','Strage']
        },{
            name: 'Offline Functionaliry',
            description: 'Network Problems?No Problem!',
            rating: 2,
            price: 'n/a',
            options: ['File Upload','Image Processing','Forms']
        }],
        sidebar: 'Ignition 8.3 is equipped with a REST API that simplifies gateway configurations and makes managing large scale projects enjoyable'
    });
};

const ignitionInfo = (req, res) => {
    res.render('product-info', {title: 'Product Info'});
};

const addReview = (req, res) => {
    res.render('product-review', {title: 'Add a Review'});
};


module.exports = {
    ignitionList,
    ignitionInfo,
    addReview
};