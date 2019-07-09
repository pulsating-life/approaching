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
import LoginUtil from './LoginUtil';

@withRouter
class LoginInnPage extends React.Component {
    constructor(props) {
        super(props);

        var isLogined = false;
        if (LoginUtil.loadContext()) {
            isLogined = true;

            var page = LoginUtil.mainPage;
            if (!page) {
                page = Common.getHomePage().home;
            }

            var hrefData = LoginUtil.getHrefData();
            if (hrefData.page) {
                delete hrefData.linkid;
                delete hrefData.page;
            }
            else {
                hrefData = { from: 'login' };
            }

            this.props.history.push({
                pathname: page,
                state: hrefData
            });
        }

        // 用户信息
        var user = LoginUtil.getUsetInfo();
        this.state = {
            user: user,
            isLogined: isLogined,
            loading: false,
            isRemember: true,
            errMsg: '',
            hints: {},
            validRules: []
        }
    }

    // 第一次加载
    componentDidMount() {
        if (!this.state.isLogined) {
            var self = this;
            LoginUtil.downConfig(this).then(function (result) {
                if (Common.corpStruct === '单公司') {
                    self.state.user.corpUuid = Common.corpUuid;
                }

                self.onConfigLoaded();
            }, function (value) {
                Common.errMsg('加载配置文件错误');
            });
        }

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

        var self = this;
        this.setState({ loading: true });
        var user = { username: this.state.user.userName, passwd: this.state.user.passwd };
        LoginUtil.doLogin(user).then(function (userData) {
            self.setState({ loading: false });
            self.loginSuccess(userData);
        }, function (errMsg) {
            self.setState({ loading: false });
            self.showError(errMsg);
        });
    }

    clickQuickLogin = (event) => {
        this.state.user.corpUuid = Common.corpUuid;

        var self = this;
        this.setState({ loading: true });
        var user = { username: 'admin', passwd: 'admin' };
        LoginUtil.doLogin(user).then(function (userData) {
            self.setState({ loading: false });
            self.loginSuccess(userData);
        }, function (errMsg) {
            self.setState({ loading: false });
            self.showError(errMsg);
        });
    }

    loginSuccess = (loginData) => {
        var corpUuid = this.state.user.corpUuid;
        LoginUtil.saveLoginData(loginData, corpUuid);

        var storage = window.localStorage;
        storage.isRemember = (this.state.isRemember ? '1' : '0');
        storage.devUserName = (this.state.isRemember ? this.state.user.userName : '');
        storage.devCorpUuid = (this.state.isRemember ? this.state.user.corpUuid : '');

        // 下载菜单
        var self = this;
        Utils.downAppMenu(Common.getHomePage().appName, Common.getHomePage().appGroup).then(function (data) {
            self.setState({ loading: false });

            self.props.router.push({
                pathname: Common.getHomePage().home,
                state: { from: 'login' }
            });
        }, function (errMsg) {
            self.setState({ loading: false });
            self.showError(errMsg);
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

    render() {
        var errMsg = this.state.errMsg;

        var layout = 'vertical';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 0 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 24 }),
        };

        var hints = this.state.hints;
        var corpBox = (Common.corpStruct === '单公司') ?
            null :
            <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.compUuidHint} validateStatus={hints.compUuidStatus}>
                <CompSelect style={{ opacity: '.9' }} name="corpUuid" id="corpUuid" ref='compSelect' value={this.state.user.corpUuid} onSelect={this.handleOnSelected.bind(this, "corpUuid")} onLoaded={this.onLoadCamp} />
            </FormItem>;

        var urlBox = (!window.rootPath) ?
            null :
            <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} help={hints.svrUrlHint} validateStatus={hints.svrUrlStatus}>
                <Input prefix={<Icon type="login" style={{ fontSize: 13 }} />} style={{ opacity: '.9' }} placeholder="服务器" type="text" name="svrUrl" id="svrUrl" value={this.state.user.svrUrl} onChange={this.handleOnChange} onBlur={this.onSvrUrlFinished} />
            </FormItem>;

        return (
            <div style={{ width: '100%' }}>
                <div style={{ width: '300px', paddingTop: '100px', margin: '0 auto' }}>
                    <Form layout={layout}>
                        {urlBox}
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} help={hints.userNameHint} validateStatus={hints.userNameStatus}>
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} style={{ opacity: '.9' }} placeholder="用户名" type="text" name="userName" id="userName" value={this.state.user.userName} onChange={this.handleOnChange} onBlur={this.onUserNameFinished} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="" colon={true} style={{ marginBottom: '20px' }} className={layoutItem} help={hints.passwdHint} validateStatus={hints.passwdStatus}>
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} style={{ opacity: '.9' }} placeholder="密码" type="password" name="passwd" id="passwd" value={this.state.user.passwd} onChange={this.handleOnChange} />
                        </FormItem>
                        {corpBox}
                        <FormItem>
                            <ErrorMsg message={errMsg} toggle={this.onDismiss} />
                            <Checkbox id='remember' style={{ color: '#fff', opacity: '.9' }} checked={this.state.isRemember} onChange={this.handleCheckBox}>记住用户名</Checkbox>
                            <Button key="btnOK" type="primary" size="large" onClick={this.clickLogin} style={{ width: '100%', opacity: '.9' }} loading={this.state.loading}>登录</Button>
                            {Common.resMode ? null : <Button key="btnOK1" type="primary" size="large" onClick={this.clickQuickLogin} style={{ width: '100%', marginTop: '20px', opacity: '.9' }} loading={this.state.loading}>快速登录</Button>}
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default LoginInnPage;
