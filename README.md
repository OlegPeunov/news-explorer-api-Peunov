# news-explorer-api-Peunov

#### Версия 1

## О проекте:  

Бэкенд для работы с данными пользователей, полученных с news-explorer-api-Peunov: https://github.com/OlegPeunov/news-explorer-frontend-Peunov/blob/main/README.md  
В проекте две сущности пользователя и статьи (**user** и **article**)  
Все полученные данные хранится в ситеме MongoDB

Проект также размещен на яндекс облаке:  
Домен: https://diplompeunov.students.nomoreparties.space  
Публичный ip:178.154.228.31


## Основной функционал:

* Регистрация новго пользователя, с переданными данными(email, password и name) - **POST /signup**
* Авторизация пользователя, проверяет переданные почту и пароль и возвращает JWT - **POST /signin**
* Запрос данных авторизованного пользователя - **GET /users/me**
* Запрос всех сохранённыех пользователем стаей - **GET /articles**
* Создание статьи с переданными в теле данными(keyword, title, text, date, source, link и image) - **POST /articles** 
* Удаляет сохранённую статью по id - **DELETE /articles/articleId **




Для запуска проета нужно скачать проект через: git clone https://github.com/OlegPeunov/news-explorer-api-Peunov.git
и запустить через команду "npm run start"



***

Работа с проектом закончена.

Проект создан с помощью следующих технологий: JS, Git, Node, Mongo, Яндкс-Облако.
