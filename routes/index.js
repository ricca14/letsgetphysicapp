var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
moment.locale("it");

var log4js = require('log4js');
var logger = log4js.getLogger();
var async = require("async");
logger.level = 'debug'; // debug, info, warn, error
// var mobile = require('is-mobile');

const Landing = require('../model/landing.js');

const Utils = require('./utils/utils.js');
const utility = new Utils();
const route = 'homepage';
const main_url = 'www.rifuging.com/';

/* GET home page. */
router.get('/', function(req, res, next) {
  utility.getSiteStatus( function (err, result) {
    if (err == 418) { return res.render('site/default/404', { title: ' 404' }); }
    switch (result.chiave) {
      case 'landing':
        res.redirect('/landing');
        break;
      case 'work_in_progress':
        res.redirect('/work_in_progress');
        break;
      case 'sito':
        roadToIndex(req, res);
        break;
      default:
        roadToIndex(req, res);
    }
  });
});

router.get('/landing', function (req, res, next) {
  res.setHeader('Cache-Control', 'max-age=31536000');
  res.render(utility.getViewByURL('default', 'landing'), {
    title: 'Home', 
    page_url: main_url + 'landing',
    page_description: 'Landing di benvenuto',
    page_title: 'Rifuging | Benvenuto',
    analytics: process.env.GOOGLE_ANALYTICS });
});

router.get('/work_in_progress', function (req, res, next) {
  res.setHeader('Cache-Control', 'max-age=31536000');
  res.render(utility.getViewByURL('default', 'wip'), {
    title: ' Home', 
    page_url: main_url + 'work_in_progress',
    page_description: 'Work in progress',
    page_title: 'Rifuging | Work in progress',
    analytics: process.env.GOOGLE_ANALYTICS });
});

router.post('/contact', function (req, res, next) {

  // setta fields come da tabella
  fields = {
    'nome': req.body.nome,
    'cognome': req.body.cognome,
    'email': req.body.email,
    'suggerimenti': req.body.suggerimenti,
    'premium': 1,
    'from_landing': 1
  };
  
  var landing = new Landing();
  landing.insertUserFromLanding(fields, function (err, result) {
    res.sendStatus(err);
  });

});


module.exports = router;