'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Spin } from 'antd';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import Card from '../../../lib/Components/Card';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var UserPrivStore = require('../data/UserPrivStore');
var UserPrivActions = require('../action/UserPrivActions');
var CorpAppAuthStore = require('../../corp-app-auth/data/CorpAppAuthStore');
var CorpAppAuthActions = require('../../corp-app-auth/action/CorpAppAuthActions');

var FntAppStore = require('../../fnt-app/app/data/FntAppStore');
var FntAppActions = require('../../fnt-app/app/action/FntAppActions');

import RoleCheckPage1 from './RoleCheckPage1';


class UserPrivPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            userPrivSet: {
                recordSet: [],
                errMsg: ''
            },
            loading: false,
            appLoading: false,
            userLoading: false,
            appMap: {},
            appList: [],

            userPriv: null,	// 选中的APP
            action: 'query',
            compUser: this.props.compUser,
        }
	}

	onServiceComplete = (data) => {
        this.setState({
            loading: false,
            userPrivSet: data
        });
	}
	onLoadAppComplete = (data) => {
        var appMap = {};
        if (data.errMsg === '') {
            data.recordSet.map((app, i) => {
                appMap[app.uuid] = app;
            });
        }

        this.setState({
            appLoading: false,
            appMap: appMap,
            appList: data.recordSet,
        });
	}
	onLoadUserComplete = (data) => {
        this.setState({
            userLoading: false,
            compUser: data.compUser,
        });
	}

    // 刷新
	handleQueryClick = (event) => {
        this.setState({ loading: true });

        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
        UserPrivActions.retrieveUserPriv(corpUuid);
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = UserPrivStore.listen(this.onServiceComplete);
		this.unsubscribe2 = FntAppStore.listen(this.onLoadAppComplete);
		this.unsubscribe3 = CorpAppAuthStore.listen(this.onLoadUserComplete);

        this.setState({ loading: true, appLoading: true, userLoading: true });
        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
        UserPrivActions.initUserPriv(corpUuid);
        FntAppActions.initFntApp();

        // 取用户权限
        CorpAppAuthActions.getUserByUuid(this.props.compUser.uuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
		this.unsubscribe2();
		this.unsubscribe3();
	}
	handleAppClick = (userPriv) => {
        this.setState({ userPriv: userPriv });
        this.refs.roleCheck.loadData(this.state.compUser, userPriv.appUuid);
	}
	onBack = () => {
        this.setState({ action: 'query' });
	}

	render(){
        var selectedApps = [];
        var recordSet = this.state.userPrivSet.recordSet;
        var appUuid = (this.state.userPriv === null) ? '' : this.state.userPriv.appUuid;
        recordSet.map((userPriv, i) => {
            var app = this.state.appMap[userPriv.appUuid];
            if (app !== null && typeof (app) !== 'undefined') {
                userPriv['uuid'] = app.uuid;
                userPriv['appCode'] = app.appCode;
                userPriv['appName'] = app.appName;
                selectedApps.push(userPriv);
            }
        });

        var privAppMap = {};
        var user = this.state.compUser;
        if (user.appAuthList !== undefined && user.appAuthList !== null) {
            user.appAuthList.map((app, i) => {
                privAppMap[app.appUuid] = app;
            });
        }

        var cardList =
            selectedApps.map((app, i) => {
                var privApp = privAppMap[app.uuid];
                // console.log('privAppMap', privAppMap, app, privApp)
                var icon = (privApp === undefined || privApp === null) ? null : <Icon type="check" />;

                var title = null;
                if (this.state.userPriv === app) {
                    title = <span style={{ color: '#49a9ee'}}>{app.appCode}</span>;
                }
                else {
                    title = app.appCode;
                }

                return <div key={app.uuid} className='card-div' style={{ width: 300 }}>
                    <Card onClick={this.handleAppClick.bind(this, app)} hint='点击修改权限信息' title={title}>
                        {icon}
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{app.appName}</div>
                    </Card>
                </div>
            });

        var compUser = this.props.compUser;
        var visible = (this.state.action === 'query') ? '' : 'none';
        var loading = this.state.loading || this.state.appLoading || this.state.userLoading;
        var appCard = (
            <div className='card-page' style={{ overflowY: 'auto', display: visible }}>
                <div className='toolbar-card'>
                    <div style={{ float: 'left' }}>
                        <div style={{ paddingTop: '16px', paddingRight: '4px', display: 'inline' }}>用户【{compUser.perName}】的权限设置</div>
                    </div>
                </div>

                {
                    loading ?
                        <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>{cardList}</Spin>
                        :
                        <div>{cardList}</div>
                }
            </div>
        );

        return (
            <div className='grid-page'>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div className='left-tree' style={{ width: '100%', height: '100%' }}>
                        <ServiceMsg ref='mxgBox' svcList={['auth-corp-app/retrieve', 'app-auth1/update', 'app-auth1/create', 'app-auth1/remove', 'comp-user/get-by-uuid']} />
                        {appCard}
                    </div>
                    <div style={{ flex: '0 0 280px', width: '280px', overflowY: 'auto', overflowX: 'hidden' }}>
                        <RoleCheckPage1 ref='roleCheck' appUuid={appUuid} user={user} />
                    </div>
                </div>
            </div>  
        );
	}
}

export default UserPrivPage;


