const { NODE_ENV, JWT_SECRET } = process.env;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const InvalidData = require('../errors/invalid-data');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/unauthorized');
const NotFoundError = require('../errors/not-found-err');

module.exports.createUser = ('/', (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({ name, email, password: hash })
      .then((users) => {
        res.json({ name: users.name, email: users.email });
      })
      .catch((err) => {
        if (err._message === 'user validation failed') {
          next(new InvalidData('Invalid User-data'));
          return;
        }
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new Conflict('Пользователь с таким email уже существует');
        }
        res.status(500).send({ message: 'Internal server error' });
      }))
    .catch(next);
});

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Требуется аутентификация'));
        return;
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserId = ('/', (req, res, next) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new InvalidData('Invalid Id'));
    return;
  }
  Users.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send({ name: user.name, email: user.email });
    })
    .catch(next);
});
