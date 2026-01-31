const index = (req, res) => {
    res.render('index', {title: '8pi'})
}

module.exports = {
    index
};