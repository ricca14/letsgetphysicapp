var mysql = require('mysql');
var log4js = require('log4js');
var logger = log4js.getLogger();
var db;
var exports = module.exports = {};

// Se non è presente crea una connessione al DB
function connectDatabase() {
    if (!db) {
        db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        db.connect(function (err) {
            if (!err) {
                logger.info('Database is connected!');
            } else {
                logger.error('Error connecting database!');
                logger.error(err);
            }
        });
    }
    return db;
}

// Gli viene passata in ingresso una query e ritorna i risultati
exports.executeQuery = function (query, callback) {  
    var t0 = Date.now();
    db = connectDatabase();
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            throw err;
        }
        // logger.debug('Data received from Db:\n', rows);
        var t1 = Date.now();
        var timeQuery = (t1 - t0);
        if (timeQuery > 50) {
            if (query.search("password") > -1) { logger.warn('Query login lenta'); }
            else { logger.warn(query); }
            logger.warn("SLOW QUERY ALERT: " + timeQuery + " milliseconds.");
        }

        // db.end();
        callback(err, rows);
    });
};

