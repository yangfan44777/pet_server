var express = require( 'express' );
var _ = require( 'underscore' );
var Promise = require('bluebird');
var PhoneCode = require('../models/phone_code');
var router = express.Router();

TopClient = require('../third_libs/alidayu/topClient').TopClient;
var client = new TopClient({
    'appkey': '23427982',
    'appsecret': '430ee560b133223895cb1d58a617ca40',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});

router.route('/code')
    .post(async (req, res) => {

        var phone = req.body.phone;
        /* 四个 0 - 9 随机数*/
        var code = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ].join('');

        client.execute('alibaba.aliqin.fc.sms.num.send', {
            // 'extend':'123456',
            'sms_type':'normal',
            'sms_free_sign_name':'宠拜',
            'sms_param':'{\"code\":\"' + code + '\",\"product\":\"[宠拜]\"}',
            'rec_num': phone,
            'sms_template_code':'SMS_13010787'
        }, async function(error, response) {
            if (!error) {
                
                /* 保存手机号和验证码信息，用于注册验证 */
                //savePhoneAndCode(phone, code);
                var phoneCode = new PhoneCode({
                    phone: phone,
                    code: code,
                    expire: + new Date() + 300000 //5分钟有效
                });
                try {
                    await phoneCode.save();
                    res.json({err: 0, data:{success: true}});
                } catch (err) {
                    res.json({err: 1, msg: '保存phoneCode失败'});
                }
            } else {
                console.log(error);
                res.json({err: 2, msg: '验证码发送失败'});
            }
        });
});
module.exports = router;
