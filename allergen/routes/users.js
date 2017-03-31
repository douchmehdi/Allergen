var express = require('express');
var router = express.Router();

// Users authentification
router.get('/auth', function(req, res, next) {
  res.render('auth');
});

router.get('/ajout/repas', function(req, res, next) {
  res.render('user');
});

router.get('/repas', function(req, res, next) {
  res.render('repas');
});

router.get('/calendar', function(req, res, next) {
  res.render('calendar');
});

module.exports = router;
