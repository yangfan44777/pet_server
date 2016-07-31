var express = require('express');
var router = express.Router();
var Feedback =  require('../models/feedback');

/*  */
router.route('/feedback')
	.get(async (req, res) => {

		try {
			var fd = req.query.fd;
			var userid = req.query.userid;

			if (fd && userid && fd.length > 0) {
				var feedback = new Feedback({
					userid: userid,
					content: fd,
					date: (new Date()).toString()
				});
				await feedback.save();
				res.json({err: 0, msg: 'success'});
			} else {
				throw new Error('');
			}
		} catch (err) {
			res.json({err: 1, msg: 'failed'});
		}
	});

module.exports = router;