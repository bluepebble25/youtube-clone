const express = require('express');
const router = express.Router();

const { Subscriber } = require('../models/Subscriber');

router.get('/subscriberNumber/:userId', (req, res) => {
  const userTo = req.params.userId;

  Subscriber.find({ 'userTo': userTo })
    .exec((err, subscribe) => {
      if(err) return res.status(400).send(err);
      return res.status(200).json({ subscriberNumber: subscribe.length });
    });
});

router.post('/subscribed', (req, res) => {
  Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, subscribed) => {
      if(err) return res.status(400).send(err);

      let result = false;

      if(subscribed.length !== 0) {
        result = true;
      }
      return res.status(200).json({ isSubscribed: result });
    });
});

router.post('/subscribe', (req, res) => {
  const subscriber = new Subscriber(req.body);
  
  subscriber.save((err, doc) => {
    if(err) return res.status(400).send(err);
    return res.status(200).end();
  });
});

router.post('/unSubscribe', (req, res) => {
  Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
  .exec((err, doc) => {
    if(err) return res.status(400).send(err);

    return res.status(200).json({ doc });
  });
});



module.exports = router;