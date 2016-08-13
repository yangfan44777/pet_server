TopClient = require('../third_libs/alidayu/topClient').TopClient;
var client = new TopClient({
    'appkey': '23427982',
    'appsecret': '430ee560b133223895cb1d58a617ca40',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});

client.execute('alibaba.aliqin.fc.sms.num.send', {
    // 'extend':'123456',
    'sms_type':'normal',
    'sms_free_sign_name':'宠拜',
    'sms_param':'{\"code\":\"1234\",\"product\":\"[宠拜]\"}',
    'rec_num':'18810935839',
    'sms_template_code':'SMS_13010787'
}, function(error, response) {
    if (!error) console.log(response);
    else console.log(error);
})
