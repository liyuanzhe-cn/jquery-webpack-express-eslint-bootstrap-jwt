const express = require('express');
const server = express();
//数据处理插件
const multer = require('multer');
const bodyParser = require('body-parser');
//引入数据库
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
//验证插件
const passport = require('passport');
//引入路由
const userRouter = require('./router/index');
const articleRouter = require('./router/article');
const userCommentsRouter = require('./router/user-comments');
const articleCommentsRouter = require('./router/article-comments');

//连接到数据库
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB数据库已链接'))
    .catch(err => console.log('数据库连接失败'));

//头像存储位置

// 初始化passport插件， 加入token验证的passport
server.use(passport.initialize());
require('./config/passport')(passport);




server.use(bodyParser({}));
server.use(multer({ dest: './avatar' }).any());

//api接口
server.use('/api/user', userRouter);
server.use('/api/article', articleRouter);
server.use('/api/art-comments', articleCommentsRouter);
server.use('/api/usr-comments', userCommentsRouter);
//监听和静态资源
server.listen(5000);
server.use( express.static('./client/build'))