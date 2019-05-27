const jwtDecode = require('jwt-decode');
const axios = require('./http');
const imgCompress = require('./imageCompress');
const { reLoad, validateEmail } = require('./utils');
/*

    这个是导航条公共部分的js文件

*/

//返回主页
function backToHome() {
    $('.back-to-index').on({
        click: function () {
            console.log('返回主页')
            window.location.href = '/'
        }
    })

}


//退出登录
function logout() {
    $('.logout-btn').on({
        'click': function () {
            localStorage.removeItem('lyz-blog-token');
            window.location.reload();
        }
    });
}

//发布按钮
function publishArticle() {
    $('.publish-btn').on({
        'click': function () {
            let token = localStorage.getItem('lyz-blog-token');
            if (token) {
                let { user, _id, email, avatar, identity } = jwtDecode(token);
                console.log(jwtDecode(token))
                if (identity !== 'admin') {
                    alert('游客不能发表文章，只能查看和留言。');
                    return;
                }
                var markupStr = $('#summernote').summernote('code');
                const articledata = {
                    user: user,
                    email: email,
                    user_id: _id,
                    identity: identity,
                    articleTitle: $('#article-title').val(),
                    articleContent: markupStr,
                    avatar: avatar
                }
                axios.post('/article/publish', articledata)
                    .then((res) => {
                        console.log(res);
                        $('#ArticleModal').modal('toggle');
                    }).catch((err) => {
                        console.log(err);
                    })
            }
        }
    })
}

// 登陆按钮点击
function login() {
    $('.login-btn').on({
        'click': function () {

            var formNode = new FormData();
            //检查是否输入必填内容
            var loginCheck = loginInputCheck();
            //检查email格式
            var emailCheck = validateEmail($('#email-for-login').val());
            console.log(loginCheck, emailCheck)
            if (!emailCheck) {
                alertMsg('.email-ilegal');
            }
            //通过后执行网络请求
            if (loginCheck && emailCheck) {
                formNode.append('pass', $('#pass-for-login').val());
                formNode.append('email', $('#email-for-login').val());

                axios.post('/user/login', formNode)
                    .then(res => {
                        //隐藏登陆输入框
                        $('#loginModal').modal('toggle');
                        //将token存入到localstorage
                        localStorage.setItem('lyz-blog-token', res.data.token)
                        var decoded = jwtDecode(res.data.token);
                        console.log(decoded);
                        //清空输入框中的内容
                        clearLoginModal();
                        //提示登陆成功
                        alertMsg('.login-success')
                        reLoad();
                    })
                    .catch(() => {
                        alertMsg('.pass-or-email-wrong');
                    })
            }
        }
    });
}

//注册
function register() {
    $('.register-btn').on({
        'click': function () {

            //验证表单是否有没输入的
            var inputValidation = registerInputCheck();
            //检验两次密码是否一致
            var passCheckValidation = passCheck();
            console.log(passCheckValidation)
            if (!passCheckValidation) {
                alertMsg('.pass-not-equal-to-checkpass');
            }

            var emailCheck = validateEmail($('#email-for-login').val());
            if (emailCheck) {
                alertMsg('.email-ilegal');
            }

            if (inputValidation && passCheckValidation) {
                //创建表单
                var formNode = new FormData();
                formNode.append('user', $('#user-for-register').val());
                formNode.append('pass', $('#pass-for-register').val());
                formNode.append('email', $('#email').val());
                formNode.append('username', $('#username').val());
                formNode.append('wechat', $('#wechat').val() ? $('#wechat').val() : '用户未填写');
                formNode.append('birthdate', $('#birthdate').val() ? $('#birthdate').val() : '用户未填写');
                formNode.append('realname', $('#realname').val() ? $('#realname').val() : '用户未填写');
                formNode.append('gender', $('input.gender[type="radio"]:checked').eq(0).val());
                formNode.append('identity', $('input.identity[type="radio"]:checked').eq(0).val());
                //先压缩图片，再执行ajax
                imgCompress($('#avatar')[0].files[0])
                    .then(blob => {
                        return new Promise((res) => {
                            formNode.append('avatar', blob);
                            res();
                        })
                    }).then(() => {
                        axios.post('/user/register', formNode)
                            .then(res => {
                                console.log(res);
                                $('#registerModal').modal('toggle');
                                clearLoginModal();
                                alertMsg('.registion-success');
                            })
                            .catch(() => {
                                alertMsg('.email-was-registed');
                            })
                    })
            }
        }
    });
}

//提醒函数
function alertMsg(selector) {
    $(selector).removeClass('fade');
    setTimeout(() => {
        $(selector).addClass('fade');
    }, 3000);
}
// 两次输入的密码检测
function passCheck() {
    console.log('密码检测： ', $('#checkpass').val() !== $('#pass-for-register').val())
    if ($('#checkpass').val() !== $('#pass-for-register').val()) {
        console.log($('#checkpass').val(), $('#pass-for-register').val())
        $('#checkpass').addClass('is-invalid');

        return false;
    } else {
        $('#checkpass').removeClass('is-invalid');
        return true;
    }
}
//注册信息检测是否为空字符串
function registerInputCheck() {
    var flag = true;
    $('.register-form').find('.form-group').find('.input-required').each((index, ele) => {
        if (ele.value == '') {
            $(ele).addClass('is-invalid');
            flag = false;
        } else {
            $(ele).removeClass('is-invalid');
        }
    });
    return flag;
}
//登陆输入框检查
function loginInputCheck() {
    var flag = true;
    $('.login-form').find('.form-group').find('.input-required').each((index, ele) => {
        if (ele.value == '') {
            $(ele).addClass('is-invalid');
            flag = false;
        } else {
            $(ele).removeClass('is-invalid');
        }
    });
    return flag;
}
// 清空注册的模态框
function clearLoginModal() {
    $('.login-form').find('.form-group').find('input').each((index, ele) => {
        ele.value = '';
    });
}

module.exports = {
    logout, publishArticle, login, register, backToHome
}