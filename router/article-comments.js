const express = require('express');
const ArticleCommentsRouter = express.Router();
const ArticleCommentsTable = require('../database/articleComments')
const passport = require('passport');

//发表评论

ArticleCommentsRouter.post('/publish', passport.authenticate("jwt", { session: false }), (req, res) => {
    const articleData = {
        user, //评论者的用户名
        publisher_id,
        article_id, //被评论的文章的 _id
        avatar, //评论者的avatar
        identity, //评论者的身份
        contents
    } = req.body;
    console.log(articleData);
    new ArticleCommentsTable(articleData).save().then((article) => {
        res.json(article)
    }).catch(err => {
        console.log(err)
    })
});

// 获取评论
// http://localhost:5000/article-comments/get-articles/5cea16a363ae4906649a01cf 测试可以
ArticleCommentsRouter.get('/get-articles/:article_id', (req, res) => {
    ArticleCommentsTable.find({ article_id: req.params.article_id })
        .then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json('连接数据库失败')
        })
});

//测试接口
ArticleCommentsRouter.post('/test', passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req.body);
    res.json(req.body)
})





module.exports = ArticleCommentsRouter;