require('dotenv').config();
const { errors } = require('celebrate');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use(requestLogger);

app.use('/signup', require('./routes/signup'));

app.use('/signin', require('./routes/signin'));

app.use(auth);

app.use('/articles', require('./routes/articles'));

app.use('/users', require('./routes/users'));

app.use(errors());

app.use('/', (req, res, next) => {
  const error = new Error('Запрашиваемый ресурс не найден');
  error.statusCode = 404;
  next(error);
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
