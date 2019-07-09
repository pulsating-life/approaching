'use strict';
var $ = require('jquery');

var Common = require('../public/script/common');
var Utils = require('../public/script/utils');


export default class LoginUtil {
    static mainPage = null;

    static loadContext() {
        // 安全连接
        var data = LoginUtil.getHrefData();
        // console.log('data', data);
        if (data.linkid && data.linkid !== 'directed') {
            return false;
        }

        // session内转移
        var loginData = window.sessionStorage.getItem('loginData');
        if (loginData) {
            var utilConf = window.sessionStorage.getItem('utilConf');
            var commonConf = window.sessionStorage.getItem('commonConf');
            if (utilConf && commonConf) {
                var uConf = JSON.parse(utilConf);
                var cConf = JSON.parse(commonConf);
                Utils.initConf(uConf);
                Common.initConf(cConf);

                window.loginData = JSON.parse(loginData);
                // console.log(window.loginData);

                if (data.linkid === 'directed') {
                    LoginUtil.mainPage = data.page;
                }

                return true;
            }
        }

        return false;
    }

    static downConfig(loginPage) {
        var self = loginPage;

        var file = '/config.js';
        var href = window.location.href;
        if (href.startsWith('https:')) {
            file = '/config-s.js';
        }

        if (window.rootPath) {
            var storage = window.localStorage;
            var svrUrl = storage.devSvrUrl;
            if (!svrUrl) {
                svrUrl = 'http://10.10.10.201:7090/';
            }

            file = svrUrl + file;
        }

        var promise = new Promise(function (resolve, reject) {
            self.setState({ loading: true });
            $.getScript(file, function (response, status) {
                if (status === 'success' || status === 'notmodified') {
                    Utils.initConf(utilConf);
                    Common.initConf(commonConf);
                    window.sessionStorage.setItem('utilConf', JSON.stringify(utilConf));
                    window.sessionStorage.setItem('commonConf', JSON.stringify(commonConf));

                    self.setState({ loading: false });
                    resolve(response);
                }
                else {
                    reject(response);
                }
            })
        });

        return promise;
    }

    static getHrefData() {
        var href = window.location.href;
        // console.log('href', href)
        var pos = href.indexOf('?href=');
        if (pos < 0) {
            return { linkid: null };
        }

        var page = href.substr(pos + 6);
        pos = page.indexOf('?linkid=');
        if (pos < 0) {
            return { linkid: null };
        }

        var param = page.substr(pos + 8);
        page = page.substr(0, pos);
        pos = param.indexOf('&');
        var linkid = null;

        if (pos >= 0) {
            linkid = param.substr(0, pos);
            param = decodeURI(param.substr(1 + pos));
        }
        else {
            linkid = param;
            param = null;
        }

        if (page.charAt(0) !== '/') {
            page = '/' + page;
        }

        if (!page.endsWith('/')) {
            page = page + '/';
        }

        return { page: page, linkid: linkid, param: param };
    }

    // 检查是否安全导航
    static isSafetyLogin(loginPage) {
        var data = LoginUtil.getHrefData();
        if (!data.linkid) {
            return false;
        }

        loginPage.onSafetyNavi(null);
        return true;
    }

    static safeNavi(loginPage, loginData) {
        var data = LoginUtil.getHrefData();
        if (!data.linkid) {
            return false;
        }

        // 导航
        if (data.linkid !== 'directed') {
            // console.log('data', data)
            Common.isShowMenu = false;
            loginPage.props.router.push({
                pathname: '/safe' + data.page,
                state: { from: 'safe' }
            });
        }
    }

    static saveLoginData(loginData, corpUuid) {
        try {
            var corp = null;
            var len = loginData.compUser.length;
            for (var i = 0; i < len; i++) {
                if (loginData.compUser[i].corpUuid === corpUuid) {
                    corp = loginData.compUser[i];
                    break;
                }
            }

            loginData.compUser = corp;
            console.log(loginData);
            window.loginData = loginData;
            window.sessionStorage.setItem('loginData', JSON.stringify(loginData));
        }
        catch (err) {
            console.log(err);
        }

        try {
            // 清空缓存的菜单
            window.sessionStorage.setItem('loadedMenu', '');
        }
        catch (err) {
            console.log(err);
        }
    }

    // dev 工具专用
    static getUsetInfo() {
        var storage = window.localStorage;
        var flag = (storage.isRemember === '1');

        var userName = '';
        if (flag) {
            userName = storage.devUserName;
            if (!userName) {
                userName = storage.userName;
            }
        }

        var corpUuid = '';
        if (Common.corpStruct === '单公司') {
            corpUuid = Common.corpUuid;
        }
        else if (flag) {
            corpUuid = storage.devCorpUuid;
            if (!corpUuid) {
                corpUuid = storage.corpUuid;
            }
        }

        // 服务器地址
        var svrUrl = storage.devSvrUrl;
        if (!svrUrl) {
            svrUrl = 'http://10.10.10.201:7090/';
        }

        return { userName: userName, corpUuid: corpUuid, svrUrl: svrUrl, passwd: "", flag: flag };
    }
    static doLogin(user) {
        var loginData = {};
        loginData.password = Common.calcMD5(user.passwd);
        loginData.username = user.username;
        var url = Utils.authUrl + 'auth-user/login';

        var promise = new Promise(function (resolve, reject) {
            Utils.loginService(url, loginData).then(function (userData, status, xhr) {
                if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
                    resolve(userData.object);
                }
                else {
                    reject("处理错误[" + userData.errCode + "][" + userData.errDesc + "]");
                }
            }, function (xhr, errorText, errorType) {
                reject(JSON.stringify(xhr));
            });
        });

        return promise;
    }
}
