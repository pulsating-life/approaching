'use strict';
var $ = require('jquery');

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { withRouter } from 'react-router-dom';

import { Form, Button, Input, Icon, Checkbox } from 'antd';
const FormItem = Form.Item;

var Common = require('../public/script/common');
var Utils = require('../public/script/utils');
import ErrorMsg from '../lib/Components/ErrorMsg';
import CompSelect from './Components/CompSelect';
import ModPasswdPage from './Components/ModPasswdPage';
import ResetPasswdPage from './Components/ResetPasswdPage';
import LoginUtil from './LoginUtil';

import CanvasDotePage from './Components/CanvasDotePage';

@withRouter
class LoginPage2 extends React.Component {
    constructor(props) {
        super(props);

        var loginData = window.sessionStorage.getItem('loginData');
        if (loginData !== null && typeof (loginData) !== 'undefined') {
            var skip = false;
            var loc = this.props.location;
            if (loc !== null && typeof (loc) !== 'undefined') {
                var path = loc.pathname;
                if (path !== '') {
                    if (loc.search !== '') {
                        skip = true;
                    }
                    else if (path !== '/' && path !== '/index.html' && path !== '/test.html' && path !== '/electron.html') {
                        skip = true;
                    }
                }
            }

            // console.log('loc', loc, skip);
            if (skip && LoginUtil.loadContext()) {
                var homePage = Utils.indexPage;
                var hrefData = LoginUtil.getHrefData();
                if (hrefData.page) {
                    homePage = hrefData.page;
                }

                // console.log('homePage', homePage);
                this.props.history.push({
                    pathname: homePage,
                    state: { from: 'login' }
                });
            }
            else {
                var href = window.location.href;
                if (href.indexOf('linkid=') < 0) {
                    window.sessionStorage.removeItem('loginData');
                }
            }
        }

        var user = LoginUtil.getUsetInfo();
        this.state = {
            user: user,
            loading: false,
            isRemember: user.flag,
            errMsg: '',
            hints: {},
            action: 'login',
            validRules: []
        }
    }

    // 第一次加载
    componentDidMount() {
        var self = this;
        LoginUtil.downConfig(this).then(function (result) {
            if (Common.corpStruct === '单公司') {
                self.state.user.corpUuid = Common.corpUuid;
            }

            self.onConfigLoaded();
        }, function (value) {
            Common.errMsg('加载配置文件错误');
        });

        this.state.validRules = [
            { id: 'svrUrl', desc: '服务器', dataType: 'url', required: false, max: 64 },
            { id: 'userName', desc: '用户名', required: true, max: 24 },
            { id: 'passwd', desc: '密码', required: true, max: 16 }
        ];
    }
    showError = (msg) => {
        this.setState({
            errMsg: msg
        });
    }
    onConfigLoaded = () => {
        if (LoginUtil.isSafetyLogin(this)) {
            // 自动登录
        }
        else if (Common.corpStruct !== '单公司') {
            if (this.refs.compSelect) {
                this.refs.compSelect.loadCorps();
            }
        }
    }
    onSafetyNavi = (loginData) => {
        LoginUtil.safeNavi(this, loginData);
    }

    clickLogin = (event) => {
        this.state.errMsg = '';
        var passwd = this.state.user.passwd;
        if (!Common.formValidator(this, this.state.user)) {
            return;
        }

        if (window.rootPath) {
            var url = this.state.user.svrUrl;
            if (!url) {
                alert('请输入服务器地址');
                return;
            }
        }

        var url = Utils.authUrl + 'auth-user/login';
        var pwd = Common.calcMD5(passwd);

        var loginData = {};
        loginData.password = pwd;
        loginData.username = this.state.user.userName;

        var self = this;
        this.setState({ loading: true });
        Utils.loginService(url, loginData).then(function (userData, status, xhr) {
            self.setState({ loading: false });
            if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
                if (passwd == '11111111' || passwd == '12345678') {
                    self.setState({ action: 'modify' });
                } else {
                    self.loginSuccess(userData.object);
                }
            }
            else {
                self.showError("处理错误[" + userData.errCode + "][" + userData.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.setState({ loading: false });
            self.showError('未知错误');
        });
    }

    clickQuickLogin = (event) => {
        this.state.user.corpUuid = Common.corpUuid;

        var url = Utils.authUrl + 'auth-user/login';
        var loginData = {};
        loginData.password = 'admin';
        loginData.username = 'admin';

        var self = this;
        this.setState({ loading: true });
        Utils.loginService(url, loginData).then(function (userData, status, xhr) {
            self.setState({ loading: false });
            if (userData.errCode == null || userData.errCode == '' || userData.errCode == '000000') {
                self.loginSuccess(userData.object);
            }
            else {
                self.showError("处理错误[" + userData.errCode + "][" + userData.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.setState({ loading: false });
            self.showError('未知错误');
        });
    }

    loginSuccess = (loginData) => {
        var corpUuid = this.state.user.corpUuid;
        LoginUtil.saveLoginData(loginData, corpUuid);

        var storage = window.localStorage;
        storage.isRemember = (this.state.isRemember ? '1' : '0');
        storage.devUserName = (this.state.isRemember ? this.state.user.userName : '');
        storage.devCorpUuid = (this.state.isRemember ? this.state.user.corpUuid : '');

        this.props.history.push({
            pathname: Utils.indexPage,
            state: { from: 'login' }
        });
    }

    handleOnChange = (e) => {
        var user = this.state.user;
        user[e.target.id] = e.target.value;
        Common.validator(this, user, e.target.id);
        this.setState({
            user: user
        });
    }
    handleCheckBox = (e) => {
        var value = e.target.checked;
        this.setState({
            isRemember: value
        });
    }
    handleOnSelected = (id, value, option) => {
        var user = this.state.user;
        user[id] = value;
        this.setState({
            user: user
        });
    }
    onUserNameFinished = (e) => {
        if (Common.corpStruct !== '单公司') {
            this.refs.compSelect.loadData(this.state.user.userName);
        }
    }
    onSvrUrlFinished = (e) => {
        if (window.rootPath) {
            var url = this.state.user.svrUrl;
            if (url) {
                var len = url.length;
                if (url.charAt(len - 1) != '/') {
                    url = url + '/';
                }

                var storage = window.localStorage;
                storage.devSvrUrl = url;

                // 加载配置信息
                LoginUtil.downConfig(this);
            }
        }
    }
    onLoadCamp = (corpUuid) => {
        var user = this.state.user;
        user.corpUuid = corpUuid;
        this.setState({
            user: user
        });
    }
    onDismiss = () => {
        this.setState({
            errMsg: ''
        });
    }

    onGoBack = () => {
        this.setState({ action: 'login' });
    }

    reqPsd = () => {
        this.setState({ action: 'request' });
    }

    render() {
        var errMsg = this.state.errMsg;

        var layout = 'vertical';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 0 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 24 }),
        };
        var userName = this.state.user.userName;
        var hints = this.state.hints;
        var visible = (this.state.action === 'login') ? '' : 'none';

        var qr = { imageSize: '10', zoom: '3', title: 'icerno' };
        qr.data = 'http://118.184.186.2:8088/apk/icerno.apk';
        var str = JSON.stringify(qr);
        str = encodeURI(str);
        str = str.replace(/&/g, '%26');
        var qrUrl; // = Utils.paramUrl ? Utils.paramUrl +'QRCode/create?data=' + str : null;
        // var qrUrl = 'https://124.202.135.197:18443/param_s/' + 'QRCode/create?data=' + str;

        var corpBox = (Common.corpStruct === '单公司') ?
            null :
            <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.compUuidHint} validateStatus={hints.compUuidStatus}>
                <CompSelect style={{ opacity: '.9', borderColor: '#7f7f6f' }} name="corpUuid" id="corpUuid" ref='compSelect' value={this.state.user.corpUuid} onSelect={this.handleOnSelected.bind(this, "corpUuid")} onLoaded={this.onLoadCamp} />
            </FormItem>;

        var urlBox = (!window.rootPath) ?
            null :
            <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} help={hints.svrUrlHint} validateStatus={hints.svrUrlStatus}>
                <Input prefix={<Icon type="login" style={{ fontSize: 13 }} />} style={{ opacity: '.9', borderColor: '#7f7f6f' }} placeholder="服务器" type="text" name="svrUrl" id="svrUrl" value={this.state.user.svrUrl} onChange={this.handleOnChange} onBlur={this.onSvrUrlFinished} />
            </FormItem>;

        var loginForm =
            <Form layout={layout}>
                {urlBox}
                <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} style={{ opacity: '.9', borderColor: '#7f7f6f' }} placeholder="用户名" type="text" name="userName" id="userName" value={this.state.user.userName} onChange={this.handleOnChange} onBlur={this.onUserNameFinished} />
                </FormItem>
                <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} style={{ opacity: '.9', borderColor: '#7f7f6f' }} placeholder="密码" type="password" name="passwd" id="passwd" value={this.state.user.passwd} onChange={this.handleOnChange} />
                </FormItem>
                {corpBox}
                <FormItem>
                    <ErrorMsg message={errMsg} toggle={this.onDismiss} />
                    <Checkbox id='remember' style={{ color: '#3f3f3f', opacity: '.9' }} checked={this.state.isRemember} onChange={this.handleCheckBox}>记住用户名</Checkbox>
                    <a onClick={this.reqPsd} style={{ float: 'right', marginTop: '1px', color: '#3f3f3f' }}>忘记密码？</a>
                    <Button key="btnOK" type="primary" size="large" onClick={this.clickLogin} style={{ width: '100%', opacity: '.9' }} loading={this.state.loading}>登录</Button>
                    {Common.resMode ? null : <Button key="btnOK1" type="primary" size="large" onClick={this.clickQuickLogin} style={{ width: '100%', marginTop: '20px', opacity: '.9' }} loading={this.state.loading}>快速登录</Button>}
                    {(window.rootPath) ? null : <a style={{ marginTop: '100px', color: '#3f3f3f' }} href="http://10.10.10.201:7090/electron/dev-tool.rar">下载windows客户端</a>}
                </FormItem>
            </Form>;

        var contactTable =
            <div style={{ width: '100%' }} style={{ display: visible }}>
                <div style={{ position: 'fixed', margin: '-180px 20px 20px -100px', top: '50%', left: '50%' }}>
                    <div style={{ border: '1px solid #a0a0a0', backgroundColor: '#fafafa', padding: '5px' }}>
                        <div style={{ border: '0.1rem solid #008ED2', padding: '30px 70px 10px 70px' }}>
                            <div style={{ width: '100%', paddingBottom: '30px', textAlign: 'center', fontSize: '13pt', color: '#3f3f3f' }}>用户登入</div>
                            <div style={{ width: '300px' }}>
                                {loginForm}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ padding: '15px 0 0 15px' }}>
                    {qrUrl ? <div style={{ width: '100px', height: '100px', zIndex: 9999, position: 'absolute', textAlign: 'center', lineHeight: '100px', backgroundColor: '#fefefe' }}><img src={qrUrl} style={{ width: '90%', border: '1px solid #7f7f7f' }} /></div> : null}
                    {qrUrl ? <p style={{ color: '#FFFFFF', position: 'absolute', top: '122px', left: '24px' }}>android 客户端</p> : null}
                </div>
            </div>

        var page = null;
        if (this.state.action === 'modify') {
            page = <ModPasswdPage onBack={this.onGoBack} />;
        } else if (this.state.action === 'request') {
            page = <ResetPasswdPage userName={userName} onBack={this.onGoBack} />;
        }

        return (
            <div style={{ width: '100%', height: '100%', background: '#0e1a53', opacity: '.92' }}>
                <CanvasDotePage />
                {contactTable}
                {page}
            </div>
        )
    }
}

export default LoginPage2;
