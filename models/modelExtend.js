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

ModelExtend = {
	doApply: function (obj) {
		obj.pageQuery = pageQuery;
	}
}


module.exports = ModelExtend;