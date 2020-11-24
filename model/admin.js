var db = require('./main/db');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
const defaultQueryLogin = "SELECT * FROM utenti WHERE username = '{username}' and password = '{password}';";

function setDefaultWhere(condition, limit = false) {
    return defaultQuery.replace("{where}", condition).replace("{limit}", limit ? ' LIMIT ' + limit : '');
}
class Admin {
    constructor() { }

    insertAccesso(utente, pagina) {
        var query = "INSERT INTO `accessi` (`utente`, `pagina`) VALUES ('{utente}', '{pagina}')".replace('{utente}', utente).replace('{pagina}', pagina);
        db.executeQuery(query, function (err, results) {
            logger.warn('Accesso inserito');
        });
    }
    checkLogin(params, callback) {
        var query = defaultQueryLogin.replace("{username}", params.username).replace("{password}", params.password);
        db.executeQuery(query, function (err, results) {
            callback(getErroceCodeByERR(err), results);
        });
    }
}

function getErroceCodeByERR(err) {
    if (err) { return 418; }
    else { return 200; }
}

module.exports = Admin;