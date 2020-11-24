var fs = require('fs'); 
var db = require('../../model/main/db');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var aws = require('aws-sdk');
const s3 = new aws.S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
});

var moment = require('moment');
moment.locale("it");
class Utils {

    getViewByURL(route, url) {
        var path_file = './views/site/' + route + '/' + url + '.jade';
        logger.debug('VIEW: ' + path_file);
        if (fs.existsSync(path_file)) { return 'site/' + route + '/' + url; }
        else { return 'site/' + route + '/default'; }   
    }
    getAdminViewByURL(url) {
        var path_file = './views/admin/' + url + '.jade';
        if (fs.existsSync(path_file)) { return 'admin/' + url; }
        else { return 'admin/default'; }
    }
    getParametro(tipo, chiave, callback) {
        var query = "SELECT * FROM parametri WHERE tipo = '{tipo}' AND chiave = '{chiave}';".replace("{tipo}", tipo).replace("{chiave}", chiave);
        db.executeQuery(query, function (err, results) {
            callback(getErroceCodeByERR(err), results);
        });
    }
    
    getParametriByTipo(tipo, callback) {
        var query = "SELECT * FROM parametri WHERE tipo = '{tipo}';".replace("{tipo}", tipo);
        db.executeQuery(query, function (err, results) {
            callback(getErroceCodeByERR(err), results);
        });
    }
    getAllParametri(callback) {
        var query = "SELECT * FROM parametri;";
        db.executeQuery(query, function (err, results) {
            callback(getErroceCodeByERR(err), results);
        });
    }
    getSiteStatus(callback) {
        db.executeQuery("SELECT chiave FROM parametri WHERE tipo = 'site_status' AND valore = 1 LIMIT 1", function (err, results) {
            callback(getErroceCodeByERR(err), results[0]);
        });
    }
    formatLibro(flag=null, libri) {
        if (libri) {
            libri.forEach(libro => {
                libro.trama_short = ((libro.trama && libro.trama != '') ? libro.trama.slice(0, 250) : '');

                if (libro.image === null || libro.image === undefined || libro.image == '' ) { libro.image = ''; }
                if (flag == process.env.FLAG_SITO) { libro.image = (process.env.DOWNLOAD_IMG == true || process.env.DOWNLOAD_IMG == 'true' ? process.env.AMAZON_CDN + process.env.DB_PRE_IMG + '_' + libro.image : '/img/libri/prod_' + libro.image); }
                else { libro.image = '/img/libri/prod_' + libro.image; }
                
                libro.trama = ((libro.trama && libro.trama != '') ? libro.trama.split(/\r?\n/) : []);
                libro.motivo = ((libro.motivo && libro.motivo != '') ? libro.motivo.split(/\r?\n/) : []);
                if (libro.data) {
                    libro.data = moment(libro.data).format('DD MMMM');
                }
                else {delete libro.data; }
            });
        }
    }

    formatAutore(flag = null, autori) {
        if (autori) {
            autori.forEach(autore => {
                autore.image = s3.getSignedUrl('getObject', { Key: process.env.DB_PRE_IMG + '_' + autore.image, Bucket: process.env.S3_BUCKET });
                
                if (autore.image === null || autore.image === undefined || autore.image == '') { autore.image = '/img/autore/prod_'; }
                if (flag == process.env.FLAG_SITO) { autore.image = (process.env.DOWNLOAD_IMG == true || process.env.DOWNLOAD_IMG == 'true' ? process.env.AMAZON_CDN + process.env.DB_PRE_IMG + '_' + autore.image : '/img/autore/prod_' + autore.image); }
                else { autore.image = '/img/assets/default.jpg'; }
                
                if (autore.biografia) {
                    autore.biografia = autore.biografia.split(/\r?\n/);
                }
            });
        }
    }
    
    
    dateNowFormatted(days) {
        var d = new Date(Date.now());
        if (days !== 0) {
            d.setDate(d.getDate() + days);
        }
        var month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    getImageExtensionByBrowser(dict) {
        if (dict.name === 'safari') { return '.jpg'; }
        else {return '.webp';}
    }

    // LOGIN
    getCookie(req) {
        // check if client sent cookie
        var cookie = req.cookies.adminLogin;
        if (cookie !== undefined) { return cookie; }
        else { return undefined; }
    }

    checkLogin(req, res) {
        if (req.cookies.adminLogin === undefined) {
            res.redirect('/admin');
        }
    }
}
function getErroceCodeByERR(err) {
    if (err) { return 418; }
    else { return 200; }
}
module.exports = Utils;