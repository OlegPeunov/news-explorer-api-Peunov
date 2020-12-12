const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createArticle, getArticles, deleteArticle } = require('../controllers/articles');

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }).unknown(true),
}), createArticle);

router.get('/', getArticles);

router.delete('/:id', deleteArticle);

module.exports = router;
