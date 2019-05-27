require('../less/index.less');
require('../css/Cooldog.css');
const axios = require('./http');
const jwtDecode = require('jwt-decode');
const picsSlider = require('./picsSlider');
const { chineseLocalTime } = require('./utils');
const { logout, publishArticle, login, register } = require('./common');

(() => {

    logout();
    publishArticle();
    login();
    register();


    //立即执行函数， 初始化登陆注册部分
    + function isLogin() {
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

    // 获取文章的页面
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
                 **/
                console.log(res.data);
                var node = ``;
                res.data.reverse().forEach((ele) => {
                    var chineseDate = chineseLocalTime(ele.date);
                    node += ` 
                    <tr class="text-info-table-row">
                        <td><a target="_blank" href="/article.html?_id=${ele._id}">${ele.articleTitle}</a></td>
                        <td class="publish-author"><a target="_blank" href="/info.html?user_id=${ele.user_id}">${ele.user}</a></td>
                        <td class="publish-date">${chineseDate}</td>
                        <td>${ele.watchTimes}</td>
                    </tr>`;
                });
                $('.table-info').append(node);

            }).catch((err) => {
                console.log(err);
            })
    }());

    //轮播图执行
    $(picsSlider);

})();




