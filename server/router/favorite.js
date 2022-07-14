const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite');

router.post('/favoriteNumber', (req, res) => {
  // DB에서 favorite 수를 가져온다
  Favorite.find({ movieId: req.body.movieId })
    .exec((err, info) => {
      if(err) return res.status(400).send(err);

      res.status(200).json({ success: true, favoriteNumber: info.length });
    });
});

router.post('/favorited', (req, res) => {
  // DB에서 내가 favorite을 눌렀는지 가져온다
  Favorite.find({ movieId: req.body.movieId, userFrom: req.body.userFrom })
    .exec((err, info) => {
      if(err) return res.status(400).send(err);

      let result = false;

      if(info.length !== 0) {
        result = true;
      }

      res.status(200).json({ success: true, favorited: result });
    });
});

router.post('/addToFavorite', (req, res) => {
  const favorite = new Favorite(req.body);
  favorite.save((err, doc) => {
    if(err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  })
});

router.post('/removeFromFavorite', (req, res) => {
  Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.body.userFrom })
    .exec((err, doc) => {
      if(err) return res.status(400).send(err);
    return res.status(200).json({ success: true, doc });
    });
});

router.post('/getFavoriteMovie', (req, res) => {
  Favorite.find({ userFrom: req.body.userFrom })
    .exec((err, favorites) => {
      if(err) return res.status(400).send(err);
    return res.status(200).json({ success: true, favorites });
    });
});

router.post('/removeFavorite', (req, res) => {
  Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.body.userFrom })
    .exec((err, result ) => {
      if(err) return res.status(400).send(err);
      return res.status(200).json({ success: true });
    })
})

module.exports = router;