var logger = require("./logHelper").helper; 

var DurationLog = function (req) {
	this.st = +(new Date());
	this.req = req;
};
DurationLog.start = function (req) {
	return new DurationLog(req);
};
DurationLog.prototype = {
	end: function () {
		var req = this.req;
		logger.info(req.method + ' | ' + req.url + ' | ' + req.path + ' | tc: ' + (+(new Date) - this.st) + 'ms');
	}
};

var util = {
	DurationLog: DurationLog
};
module.exports = util;