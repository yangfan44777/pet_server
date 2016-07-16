var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/**
 * 解密客户端发来的请求
 * 
 */
/*
var ticketsPool = (function () {

    var MAXTIME = 30000;

    var tickets = [];

    var create = function () {

        tickets.push({
            ticket: +new Date(),
            expire: +new Date() + MAXTIME
        });
    };
    var isValid = function (ticket) {
        var _t = tickets.find((n) => {
            return (n.ticket === ticket) && (n.expire - +new Date() > 0);
        });
        return _t ? true : false;
    };
    return {

        create: create,
        isValid: isValid
    };
}());
*/

var guidPool = (function () {

    var MAXLEN = 2000;

    var GUID = [];

    var push = function (id) {

        if (GUID.length >= MAXLEN) {
            GUID = GUID.slice(MAXLEN / 2);
        }
        GUID.push(id);
    };
    var hasGUID = function (id) {
        return GUID.indexOf(id) >= 0;
    };

    return {
        push: push,
        has: hasGUID
    };
})();
/*
var apiExps = [
    /^\/api\/topic\/$/
];

var hasApi = function (api) {
    var ret = false;
    apiExps.forEach((apiExp) => {
        if (apiExp.test(api)) {
            ret = true;
        }
    });
    return ret;
};
*/
/*
var checkApi = function (secret) {

    router.all('*', function (req, res, next) {

        var oriUrl = req.originalUrl;

        if (req.query.ticket) {
            if (ticketsPool.isValid(ticket)) {
                next();
            } else {
                res.json({err: 0, msg: 'ticket error'});
            }
        } else if (/^\/c\/\w+$/.test(oriUrl)) {

            var decipher = crypto.createDecipher('aes192', secret);
            var decStr = decipher.update(oriUrl.match(/^\/c\/(\w+)$/)[1], 'hex', 'utf8');
            decStr += decipher.final('utf8');

            var info = decStr.match(/^(\w+)\+(.+)$/);
            var guid = info[1];
            var api = info[2];

            console.log("guid:" + guid,"aaa",api);
            if (!guidPool.has(guid) && hasApi(api)) {
                guidPool.push(guid);
                res.redirect(api + '&ticket=' + ticketsPool.create());
            } else {
                res.end();
            }
        } else {
            res.end();
        }
    });


    return router;

}
*/

var checkApi2 = function (secret) {

    router.all('*', function (req, res, next) {
        /* 接收到的未经处理的url */
        var query = req.query;

        if (query.ticket) {
            /* 经过解码得到的信息 */
            try {
                var decipher = crypto.createDecipher('aes192', secret);
                var decTicket = decipher.update(query.ticket, 'hex', 'utf8');
                decTicket += decipher.final('utf8');
                
                if (!guidPool.has(decTicket)) {
                    guidPool.push(decTicket);
                    next();
                } else {
                    res.end();
                }
            } catch (e) {
                res.end();
            }
        }
    });
    return router;
}

module.exports = checkApi2;
