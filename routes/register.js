var express = require( 'express' );
var _ = require( 'underscore' );
var Promise = require('bluebird');
var PhoneCode = require('../models/phone_code');
var User = require('../models/user');
var Followed = require('../models/followed');
var router = express.Router();

router.route('/register')
	.post(async (req, res) => {

		var pw = req.body.pw;
		var phone = req.body.phone;
		var nickname = req.body.nickname;
		var pic = req.body.pic;
		var code = req.body.code;

		var time = +new Date();
		/* 验证手机号和验证码是否匹配 */
		//checkCode(phone, code);
		try {

			var user = await User.findOne({openid: phone}).exec();
			if (user) {
				return res.json({err: 3, msg: '该手机号已注册'});
			}

			var phoneCode = await PhoneCode.findOneAndRemove({phone: phone, code: code, expire: {$gt: time}}).exec();
			

			if (phoneCode) {
				const user = new User({
					openid: phone,
					phone: phone,
					nickname: nickname,
					headimgpic: pic
				});
				//await user.save();

				const followed = new Followed({
	            	userid : user.openid,
	            	followed : [ user.openid ]
	          	});

	          	await Promise.all([user.save(), followed.save()]);

				res.json({err: 0, data:{success:true, user: user}});
			} else {
				res.json({err: 1, msg: '验证码错误'});
			}
		} catch (err) {
			res.json({err: 2, msg: '注册失败'});
		}
	});




module.exports = router;