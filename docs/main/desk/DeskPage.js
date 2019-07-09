'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { withRouter } from 'react-router-dom';

import Card from '../../lib/Components/Card';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Icon, Button, Spin } from 'antd';

class DeskPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            appList: []
        }
    }

    // 第一次加载
    componentDidMount() {
        this.setState({ loading: true });

        var self = this;
        Utils.downAppJson().then(function (appList) {
            // 可访问的应用
            var authApps = [];
            var appLen = appList.length;
            for (var x = 0; x < appLen; x++) {
                var app = appList[x];
                if (app.visible !== 'hidden') {
                    var flag = Utils.checkAppPriv(app.roleApp);
                    if (flag !== 0) {
                        authApps.push(app);
                    }
                }
            }
            
            window.sessionStorage.setItem('authApps', JSON.stringify(authApps));

            self.setState({ loading: false, appList: appList });
        }, function (value) {
            self.setState({ loading: false });
            alert(value)
        });
    }
    handleAppClick = (app) => {
        var m = Utils.getAppMenu(app.menu);
        if (m) {
            this.openApp(app);
            return;
        }

        // 先下载菜单
        this.setState({ loading: true });
        var url = Utils.authUrl + 'fnt-app-menu/appName';
        var self = this;
        Utils.doCreateService(url, app.menu).then(function (result) {
            self.setState({ loading: false });
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                Utils.saveAppMenu(app.menu, result.object);
                self.openApp(app);
            }
            else {
                Common.errMsg("下载菜单错误[" + result.errCode + "][" + result.errDesc + "]");
                if (result.errCode === 'AUTH09') {
                    this.props.history.push({
                        pathname: '/index.html'
                    });
                }
            }
        }, function (value) {
            self.setState({ loading: false });
            Common.errMsg("下载菜单错误");
        });
    }
    openApp = (app) => {
        Utils.setSelectedApp(app.roleApp);
        Utils.setActiveMenuName(app.menu);

        if (app.url.charAt(0) === '@') {
            Utils.showPage(app.url.substr(1));//会清空utils的数据
        }
        else {
            this.props.history.push({
                pathname: app.url,
                state: { from: 'desk' }
            });
        }
    }

    render() {
        var cardList = [];

        var appList = this.state.appList;
        var appLen = appList.length;
        for (var x = 0; x < appLen; x++) {
            var app = appList[x];
            var flag = (app.visible === 'hidden') ? 0 : Utils.checkAppPriv(app.roleApp);
            if (flag !== 0) {
                var style = (flag === 1) ? null : {border: '1px solid red'};
                cardList.push(
                    <div key={app.name} className='card-div' style={{ width: 300 }}>
                        <Card onClick={this.handleAppClick.bind(this, app)} style={style} hint='' title={app.name}>
                            <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>
                                {app.hint}
                            </div>
                        </Card>
                    </div>
                );
            }
        }

        return (
            <div className='form-page' style={{ width: '100%', padding: '24px 16px 0 16px' }}>
                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据2..."><div style={{ minHeight: '200px' }}>{cardList}</div></Spin>
                        :
                        <div>{cardList}</div>
                }
            </div>);
    }
}

export default DeskPage;
