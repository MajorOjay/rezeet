const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const bcrypt = require('bcryptjs');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'default';

    next();
});


router.route('/')
    .get(defaultController.index);


router.route('/sign-up')
    .get(defaultController.signup)
    .post(defaultController.register);

router.route('/activate')
    .get(defaultController.activate);

router.route('/complete')
    .get(defaultController.complete);

router.route('/confirm')
    .get(defaultController.confirm);

router.route('/404')
    .get(defaultController.four);

router.route('/invalid')
    .get(defaultController.invalid);



router.get('/sitemap.xml', (req, res) => {
    res.sendFile('/views/default/sitemap.xml', {root: "."})
})





module.exports = router;
    