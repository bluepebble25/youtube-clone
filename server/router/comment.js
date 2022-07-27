const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');
const { auth } = require('../middleware/auth');

router.post('/saveComment', auth, (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if(err) return res.status(400).json({ err });

    Comment.find({ '_id': comment._id })
      .populate('writer')
      .exec((err, result) => {
        if(err) return res.status(400).json(err);
        res.status(200).json({ result: result });
      });
  });
});

router.get('/:videoId', (req, res) => {
  const videoId = req.params.videoId;

  Comment.find({ 'videoId': videoId })
    .populate('writer')
    .exec((err, comments) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({ comments });
    });
});



module.exports = router;