var db = require('./main/db');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
const defaultQueryLogin = "SELECT * FROM utenti WHERE username = '{username}' and password = '{password}';";

function setDefaultWhere(condition, limit = false) {
    return defaultQuery.replace("{where}", condition).replace("{limit}", limit ? ' LIMIT ' + limit : '');
}
class Landing {
    constructor() { }

    insertUserFromLanding(params, callback) {
        var campi = ""; var valori = "";
        for (var key in params) {
            // check if the property/key is defined in the object itself, not in parent
            if (campi !== "") { campi += ', '; }
            if (valori !== "") { valori += ', '; }
            campi += escape(key);
            valori += '"' + params[key] + '"';
        }
        var query = "INSERT INTO `utenti` ({campi}) VALUES ({valori})".replace("{campi}", campi).replace("{valori}", valori);

        db.executeQuery(query, function (err, results) {
            callback(getErroceCodeByERR(err), results);
        });
    }
}

function getErroceCodeByERR(err) {
    if (err) { return 418; }
    else { return 200; }
}

module.exports = Landing;