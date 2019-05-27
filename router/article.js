const express = require('express');
const fs = require('fs');
const articleRouter = express.Router();
const path = require('path');
const mongoose = require("mongoose");
const ArticleTable = require('../database/articles')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../config/keys');
const passport = require('passport');

articleRouter.post('/publish', passport.authenticate("jwt", { session: false }), (req, res) => {
    const articleData = { user, user_id, email, articleTitle, articleContent, avatar } = req.body;
    console.log(articleData);
    new ArticleTable(articleData).save().then((article) => {
        res.json(article)
    }).catch(err => {
        console.log('/publish 错误')
    })
});

articleRouter.get('/get-articles', (req, res) => {
    ArticleTable.find()
        .then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json('连接数据库失败')
        })

});

//获取某一个
articleRouter.get('/get-articles/:id', (req, res) => {

    ArticleTable.findOneAndUpdate({ _id: req.params.id }, { $inc: { watchTimes: 1 } }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json("没有任何内容")
            }
            console.log(data)
            res.json(data);
        }).catch((err) => {
            console.log('/get-articles/:id 错误')
        })
})



//编辑
articleRouter.post('/edit/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    const articleData = { user, email, articleTitle, articleContent, avatar } = req.body;
    ArticleTable.findOneAndUpdate({ _id: req.params.id }, { $set: articleData }, { new: true })
        .then(updateArticle => res.json(updateArticle))
        .catch(err => res.status(404).json("编辑失败"))

})

articleRouter.delete('/delete/:id', passport.authenticate("jwt", { session: false }), (req, res) => {
    ArticleTable.findOneAndRemove({ _id: req.params.id })
        .then(updateArticle => {
            profile.save().then(profile => res.json(updateArticle))
        })
        .catch(err => res.status(404).json("删除失败"))

})

articleRouter.post('/test', passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req.body);
    res.json(req.body)
})




module.exports = articleRouter;