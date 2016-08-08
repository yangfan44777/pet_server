var Banner = require('../models/banner');
var express = require('express');
var router = express.Router();

router.route('/banner/available').get((req, res) => {
  Banner.find({ available: 1 }).exec((err, banners) => {
    if (err) {
      return res.send(err);
    }
    res.json(banners);
  });
});

router.route('/banner').post((req, res) => {
  var reqBody = Object.assign(req.body, { available: 1 });

  const banner = new Banner(reqBody);

  banner.save((err, result) => {
    if (err) {
      return res.send(err);
    }
    res.send({ message: 'banner created' });
  });
});

router.route('/banner/disable/:banner_id').put((req, res) => {
  Banner.findOne({ _id: req.params.banner_id }, (err, banner) => {
    if (err) {
      return res.send(err);
    }
    banner.available = 0;
    banner.save(err => {
      if (err) {
        return res.send(err);
      }
      res.json({ message: 'Banner is not available now.' });
    });
  });
});

module.exports = router;