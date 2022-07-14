const { User } = require('../models/User');

const auth = (req, res, next) => {
  // get token from the client's cookie
  let token = req.cookies.x_auth;

  // decode the token and find the user
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({ isAuth: false, error: true});
    
    req.token = token;
    req.user = user;
    next();
  });
}

module.exports = { auth };