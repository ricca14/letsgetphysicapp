var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const browser = require('browser-detect');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug'; 
var async = require("async");

const Admin = require('../../model/admin.js');
const Utils = require('../utils/utils.js');
const utility = new Utils();

var nome_utente = '';
var section = 'home';

/* GET users listing. */
router.get('/', function (req, res, next) {
  nome_utente = utility.getCookie(req);
  if (nome_utente) { 
    utility.getAllParametri(function (err, results) {
      var parametri_sito = [];
      results.forEach(element => {
        if (element.tipo == 'site_status') {
          parametri_sito.push(element);
        }
      });
      res.render(utility.getAdminViewByURL('index'), {
        title: 'HOME',
        section: section,
        nome_utente: nome_utente,
        parametri_sito: parametri_sito
      });
    });
  }
  else { 
    res.render(utility.getAdminViewByURL('login'), {
      title: 'login'
    });
  }
});

// POST
router.post('/login', function (req, res, next) {
  var admin = new Admin();
  var params = { 'username': req.body.username, 'password': crypto.createHash('sha1').update(req.body.password).digest('hex') };
  admin.checkLogin(params, function (err, result) {
    if (err === 200) {
      setCookie(res, result[0]);
    }
    res.sendStatus(err);
  });
});

function setCookie(res, result) {
  nome_utente = result.nome;
  // setto tempo expires a 15gg (3600000 sec = 1 ora)
  var expires = 3600000 * 24 * 15;
  res.cookie('adminLogin', nome_utente, { maxAge: expires, httpOnly: true });
}

module.exports = router;
