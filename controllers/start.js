
exports.getStarted = (req, res, next) => {
    res.render('getStarted', {
        pageTitle: 'BlogON!',
        path: '/getStarted',
        editing: false,
        userId: req.user
    })
}