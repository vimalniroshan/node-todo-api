const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const getHashedPassword = (password, promise) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if(err) {
        reject(err);
      }

      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if(err) {
          reject(err);
        }

        resolve(hashedPassword);
      });
    });
  });
};

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'abc123asSecret').toString();

  user.tokens.push({access, token});
  return user.save().then(() => {
      return token;
    });
};

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123asSecret');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByEmailAndPassword = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
      if(!user) {
        Promise.reject('Invalid credentials');
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if(res) {
            return resolve(user);
          }
          return reject('Invalid credentials');
        });
      });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    getHashedPassword(user.password)
      .then((hashedPassword) => {
        user.password = hashedPassword;
        next();
      }).catch((err) => next());
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
