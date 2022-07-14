const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 30
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

userSchema.pre('save', function(next) {
  const user = this;  // this는 이 메소드 앞에 있는 오브젝트인 userSchema를 의미

  if(user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);
  
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(plainPassword, callback) {
  // plainPassword를 암호화한 것과 DB에 있는 암호화된 것이 같은지 체크
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return callback(err);
    callback(null, isMatch);
  });
}

userSchema.methods.generateToken = function(callback) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function(err, user) {
    if(err) return callback(err);
    callback(null, user);
  })
};

userSchema.statics.findByToken = function(token, callback) {
  const user = this;

  // decode token
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // find user with decoded one

    user.findOne({ "_id": decoded, "token": token }, function(err, user) {
      if(err) return callback();

      callback(null, user);
    });
  });
}

const User = mongoose.model('User',userSchema);

module.exports = {User};