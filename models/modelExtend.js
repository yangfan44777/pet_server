var async = require('async');

var pageQuery = function (currentPage, pageSize, conditions, fields, options, callback) {

	if ('function' == typeof conditions) {
   		callback = conditions;
   		conditions = {};
   		fields = null;
   		options = null;
  	} else if ('function' == typeof fields) {
   		callback = fields;
   		fields = null;
   		options = null;
  	} else if ('function' == typeof options) {
       callback = options;
       options = null;
  	}

	var StartLine = (currentPage - 1) * pageSize;
	var m = this;
	async.parallel([
		function(cb) {
			m.count({},cb);
		},
		function(cb) {
	    	if ('function' == typeof conditions) {
	    		m.find({}).limit(pageSize).skip(StartLine).exec(cb);
	    	} else if ('function' == typeof fields) {
	     		m.find(conditions).limit(pageSize).skip(StartLine).exec(cb);
	    	} else if ('function' == typeof options) {
	    		m.find(conditions,fields).limit(pageSize).skip(StartLine).exec(cb);
	    	} else {
	    		m.find(conditions,fields,options).limit(pageSize).skip(StartLine).exec(cb);
	    	}
	    }
	],
  	function(err,rs) {
		var page = {};
    	if('number' == typeof rs[0]){
	      	page.total = rs[0];
	      	page.rows =  rs[1];
    	} else {
      		page.total = rs[1];
      		page.rows =  rs[2];
    	}
    	callback(err,page);
 	});

}

ModelExtend = {
	doApply: function (obj) {
		obj.pageQuery = pageQuery;
	}
}


module.exports = ModelExtend;