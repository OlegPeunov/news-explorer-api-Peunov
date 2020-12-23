const mongoose = require('mongoose');
const Articles = require('../models/articles');
const ServerError = require('../errors/server-error');
const InvalidData = require('../errors/invalid-data');
const Forbidden = require('../errors/forbidden');
const NotFoundError = require('../errors/not-found-err');

module.exports.createArticle = ('/', (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Articles.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then(() => {
      res.json({
        keyword, title, text, date, source, link, image,
      });
    })
    .catch((err) => {
      if (err._message === 'cards validation failed') {
        throw new InvalidData('Invalid Card-data');
      } else {
        throw new ServerError('Internal server error');
      }
    })
    .catch(next);
});

module.exports.getArticles = ('/', (req, res, next) => {
  const userId = req.user._id;
  Articles.find({ owner: userId })
    .then((users) => {
      if (!users) {
        throw new ServerError('Server error');
      }
      res.json({ data: users });
    })
    .catch(next);
});

module.exports.deleteArticle = ((req, res, next) => {
  const articleId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    next(new InvalidData('Invalid Id'));
    return;
  }
  Articles.findById(articleId).select('+owner')
    .orFail(new Error('notValidId'))
    .then((article) => {
      if (article.owner.toString() === req.user._id.toString()) {
        article.remove(articleId)
          .then((articleTo) => {
            res.json({
              keyword: articleTo.keyword,
              title: articleTo.title,
              text: articleTo.text,
              date: articleTo.date,
              source: articleTo.source,
              link: articleTo.link,
              image: articleTo.image,
            });
          });
      } else {
        next(new Forbidden('Вы не можете удалять чужие карточки'));
      }
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        next(new NotFoundError('Нет пользователя с таким id'));
      } else {
        next(new ServerError('Internal server error'));
      }
    })
    .catch(next);
});
