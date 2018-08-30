var express = require('express');
var passport = require('passport');
require('../config/security')(passport);
var bookController = require('../controllers/book-controller');

var router = express.Router();


router.post('/book', passport.authenticate('jwt', { session: false}),function(req, res){ bookController.addNewBook(req, res)});

router.get('/book', passport.authenticate('jwt', { session: false}),function(req, res){ bookController.getBooks(req, res)});

module.exports = router;