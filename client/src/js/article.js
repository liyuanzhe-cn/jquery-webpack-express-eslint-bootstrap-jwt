require('../less/article.less');
const axios = require('./http');
const jwtDecode = require('jwt-decode');
const { searchToQuery, chineseLocalTime } = require('./utils');
const { logout, publishArticle, login, register, backToHome } = require('./common');

(() => {
    logout();
    publishArticle();
    login();
    register();
    backToHome();
    //立即执行函数， 初始化登陆注册部分
    +function isLogin() {
        var token = localStorage.getItem('lyz-blog-token');
        if (token) {
            var { exp, username } = jwtDecode(token);
            var currentTime = new Date().getTime();
            if (exp * 1000 < currentTime) {
                localStorage.removeItem('lyz-blog-token');
            } else {
                $('.login-and-register').remove();
                $('#registerModal').remove();
                $('#loginModal').remove();
                $('.nav-username').find('a').html(username);
                $(".nav-avatar").attr('src', 'http://localhost:5000/user/avatar/?avatar=' + jwtDecode(localStorage.getItem('lyz-blog-token')).avatar);

            }
        } else {
            $('.username-and-logout').remove();
        }
        // 显示导航栏
        $(".navigator").css('visibility', 'visible');
    }();

    // 获取最近的文章
    (function () {
        axios.get('/article/get-articles')
            .then((res) => {
                /**
                    articleContent: "222"
                    articleName: "111"
                    avatar: "avatar\\356fb1f16f7a5a1966ea60e1fddce462.jpg"
                    date: "2019-05-25T06:36:01.569Z"
                    email: "777@777.com"
                    identity: "true"
                    user: "777"
                    watchTimes: 0
                    __v: 0
                    _id: "5ce8e25120517f3a68a5b060"
                 */
                console.log(res.data);
                var node = ``;
                res.data.reverse().forEach((ele) => {
                    node += ` 
                    <tr class="text-info-table-row">
                     <td><a target="_blank" href="/article.html?_id=${ele._id}">${ele.articleTitle}</a></td>
                    </tr>`;
                });
                $('.text-info').append(node);

            }).catch((err) => {
                console.log(err);
            })
    }())


    //退出登录
    $('.logout-btn').on({
        'click': function () {
            localStorage.removeItem('lyz-blog-token');
            window.location.reload();
        }
    });


    // 根据 query 获取相应的 文章
    (function () {
        if (window.location.search) {

            var urlQuery = searchToQuery(window.location.search);
            console.log(window.location.search, '/user/get-articles/' + urlQuery._id)
            axios.get('/article/get-articles/' + urlQuery._id).then((res) => {
                console.log(res.data);
                var ele = res.data;
                var chineseDate = chineseLocalTime(ele.date);
                var articleHtml = `
                        <div class="article-info">
                            <div class="article-avatar"><img src="${'http://localhost:5000/user/avatar/?avatar=' + ele.avatar}" alt="">
                            </div>
                            <div class="article-author">
                                <p class="article-author-detail article-author-name">
                                    用户名：<span>${ele.user}</span>
                                </p>
                                <p class="article-author-detail  article-author-email">
                                    邮箱：<span><a href="mailto:${ele.email}">${ele.email}</a></span>
                                </p>
                                <p>
                                    发布日期： <span class="article-author-detail  article-author-date">${chineseDate}</span>
                                    浏览次数： <span class="article-author-detail  article-author-watchTime">${ele.watchTimes}</span>
                                </p>
                            </div>
                        </div>
                        <div class="article-title">
                            <strong>${ele.articleTitle}</strong>
                        </div>
                        <div class="article-content">
                            ${ele.articleContent}
                        </div>`;
                $(".article-wrapper").html(articleHtml);
            }).catch((err) => {
                console.log(err);
            })
        } else {
            alert('未读取到url中的query，您似乎并没有选择任何文章。')
        }
    }());

    //获取评论
    function getComments() {
        //获取文章的 _id
        var user_idObj = searchToQuery();
        var user_id = user_idObj._id;
        //
        axios.get('/art-comments/get-articles/' + user_id)
            .then((res) => {
                console.log(res.data);
                var ele = res.data
                var html = ``;
                ele.forEach((ele) => {
                    html += `
                            <div class="commentary-item">
                                <div class="commentary-user">
                                    <a href="${'/info.html?user_id=' + ele.publisher_id}">
                                        <img src="${'http://localhost:5000/user/avatar/?avatar=' + ele.avatar}" alt="${ele.user}">
                                    </a>
                                    <div class="commentary-username">${ele.user}</div>
                                    <div class="commentary-datae">${chineseLocalTime(ele.date)}</div>
                                </div>
                                <div class="conmentary-content">
                                    ${ele.contents}  
                                </div>
                            </div>`
                })
                $('.comments').empty().append(html);
            }).catch((err) => {
                console.log(err);
            })
    }
    getComments();

    //留言板发布按钮
    $('.publish-comments-to-article').on({
        'click': function () {
            // 给谁发表留言
            var user_idObj = searchToQuery();
            var article_id = user_idObj._id;
            // 获取自己的_id编号
            let token = localStorage.getItem('lyz-blog-token');

            if (token) {
                let { user, _id, avatar, identity } = jwtDecode(token);
                console.log(jwtDecode(token));
                // 
                if (!user) {
                    alert('未登陆用户不能发表评论');
                    return;
                }
                /**
                user, //评论者
                user_id, //被评论者的_id
                avatar, //头像
                identity, //身份
                contents
                 */
                var markupStr = $('#summernote-comments').summernote('code');
                const articledata = {
                    user: user,  //评论人
                    publisher_id: _id, //被评论人的 _id
                    article_id: article_id,//被评论的文章的 _id
                    identity: identity == 'admin' ? 'admin' : 'client', //评论者身份
                    avatar: avatar,
                    contents: markupStr
                }
                axios.post('/art-comments/publish', articledata)
                    .then((res) => {
                        $('#summernote-comments').next().find('.note-editable').empty();
                        getComments();
                        console.log(res);
                    }).catch((err) => {
                        console.log(err);
                    })
            } else {
                console.log('状态： 未登录');
            }
        }
    })

})();



