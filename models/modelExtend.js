var Promise = require('bluebird');

var pageQuery = function (currentPage, pageSize, conditions, fields, options) {

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

	if ('function' == typeof conditions) {
		return m.find({}).limit(pageSize).skip(StartLine).exec();
	} else if ('function' == typeof fields) {
 		return m.find(conditions).limit(pageSize).skip(StartLine).exec();
	} else if ('function' == typeof options) {
		return m.find(conditions,fields).limit(pageSize).skip(StartLine).exec();
	} else {
		return m.find(conditions,fields,options).limit(pageSize).skip(StartLine).exec();
	}
}

/**
 * 上翻下翻刷新
 * @param {number} orientation 上翻下翻 1:上  0:下
 * @param {string} 起始_id
 * @param {Object} 查询条件
 * @param {Object} 查询field
 * @param {Object} 查询选项
 */
var pageQueryFeeds = function (orientation, startId, limit, conditions, fields, options) {

	conditions = conditions || {};
	options = options || {};
	fields = fields || null;
	limit = parseInt(limit, 10);
	
	orientation = parseInt(orientation, 10);

	var self = this;

	if (orientation === 1) {
		options['sort'] = {_id: -1};
	} else {
		options['sort'] = {_id: 1};

		if (limit) {
			options['limit'] = limit;
		}
	}

	return new Promise(function (resolve, reject) {

		try {
			var stream = self.find(orientation, fields, options).stream();
			var cache=[];
			
		    stream.on('data',function(item) {
		    	if ((orientation === 1 && item._id > startId) || (orientation === 0 && item._id < startId)) {
		    		cache.push(item);
		    	} else {
		    		stream.destroy();
		    		resolve(cache);
		    	}
		    }).on('end', function() {
		    	resolve(cache);
		    	console.log('query ended'); 
		    }).on('close', function() {
		    	resolve(cache);
		    	console.log('query closed');
		    }).on('error', function (err) {
		    	reject(err);
		    });
		} catch (err) {
			reject(err);
		}
	});

	/*if (orientation === 1) {
		conditions['_id'] = {$gt: startId};
		options['sort'] = {_id: -1};
	} else {
		conditions['_id'] = {$lt: startId};
		options['sort'] = {_id: -1};
	}*/

	

	
}

ModelExtend = {
	doApply: function (obj) {
		obj.pageQuery = pageQuery;
		obj.pageQueryFeeds = pageQueryFeeds;
	}
}


module.exports = ModelExtend;