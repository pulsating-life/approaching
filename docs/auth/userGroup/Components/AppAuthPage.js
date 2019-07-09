'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Spin } from 'antd';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import Card from '../../../lib/Components/Card';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var UserPrivStore = require('../../user/data/UserPrivStore');
var UserPrivActions = require('../../user/action/UserPrivActions');

var UserGroupStore = require('../data/UserGroupStore');
var UserGroupActions = require('../action/UserGroupActions');

var FntAppStore = require('../../fnt-app/app/data/FntAppStore');
var FntAppActions = require('../../fnt-app/app/action/FntAppActions');

var AppAuthActions = require('../action/AppAuthActions');
var AppAuthStore = require('../data/AppAuthStore')

import CheckPage1 from './CheckPage1';


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
            userGroup: this.props.userGroup,
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
    
	}
	onLoadUserComplete1 = (data) => {
        this.setState({
            userLoading: false,
            userGroup: data.userGroup,
        });
	}

    // 刷新
	handleQueryClick = (event) => {

	}

	loadData = (userGroup) => {
        if (userGroup) {
            this.state.userGroup = userGroup;
            var corpUuid = window.loginData.compUser.corpUuid;
            UserGroupActions.initUserGroup(corpUuid);
            // 取用户权限
             AppAuthActions.getUserByUuid(userGroup.uuid);
        }

	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = UserPrivStore.listen(this.onServiceComplete);
		this.unsubscribe2 = FntAppStore.listen(this.onLoadAppComplete);
		this.unsubscribe3 = UserGroupStore.listen(this.onLoadUserComplete);
		this.unsubscribe4 = AppAuthStore.listen(this.onLoadUserComplete1);

        this.setState({ loading: true, appLoading: true });
        var corpUuid = window.loginData.compUser.corpUuid;
        UserPrivActions.initUserPriv(corpUuid);
        FntAppActions.initFntApp();

       
	}
	componentWillUnmount() {
		this.unsubscribe();
		this.unsubscribe2();
		this.unsubscribe3();
		this.unsubscribe4();
	}
	handleAppClick = (userPriv) => {
        if(this.state.userGroup){
            this.setState({ userPriv: userPriv });
            this.refs.roleCheck.loadData(this.state.userGroup, userPriv.appUuid);
        }else{
           Common.infoMsg('请选择用户组');
        }
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
        var value = "";
        var userGroup = this.state.userGroup;
        if(userGroup){
            if (userGroup.appAuthList !== undefined && userGroup.appAuthList !== null) {
                userGroup.appAuthList.map((app, i) => {
                    //暂时处理
                    if(app){
                        privAppMap[app.appUuid] = app;
                    }
                });
            }
            value = userGroup.groupName;
        }
        


        var cardList =
            selectedApps.map((app, i) => {
                var privApp = privAppMap[app.uuid];
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
            

        var visible = (this.state.action === 'query') ? '' : 'none';
        var loading = this.state.loading || this.state.appLoading || this.state.userLoading;
        var cs = Common.getCardMargin(this);
        var appCard =
            <div className='card-page' style={{ padding: cs.padding, display: visible }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['user-group/retrieve', 'user-group/remove','appAuth/create','appAuth/retrieve','appAuth/update','appAuth/delete']}/>
                    <div className='toolbar-card' >
                        <div style={{ float: 'left',width:'200px' }}>
                            <div style={{ paddingTop: '16px', paddingRight: '4px', display: 'inline' }}>用户组【{value}】的权限设置</div>
                        </div>
                    </div>
                </div>

                {
                    loading ?
                        <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
                }
            </div>;
        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <div className='left-tree' style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    {appCard}
                </div>
                <div className='left-tree' style={{ flex: '0 0 280px', width: '280px',  overflowY: 'auto', overflowX: 'hidden',paddingTop:'0' }}>
                    <CheckPage1 ref='roleCheck' appUuid={appUuid} user={this.state.userGroup} />
                </div>
            </div>
        );
	}
}

export default UserPrivPage;


