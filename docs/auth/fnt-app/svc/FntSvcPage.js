'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Spin} from 'antd';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import Card from '../../../lib/Components/Card';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var Context = require('../../AuthContext');
var FntSvcStore = require('./data/FntSvcStore');
var FntSvcActions = require('./action/FntSvcActions');
var AuthAppStore = require('../../app/data/AppStore.js');
var AuthAppActions = require('../../app/action/AppActions');
import SelectAppPage from './Components/SelectAppPage';

class FntSvcPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fntSvcSet: {
				recordSet: [],
				errMsg : ''
			},
			loading: false,
			appLoading: false,
			appMap: {},
			appList: [],
		}
	}

	onServiceComplete = (data) => {
        this.setState({
            loading: false,
            fntSvcSet: data
        });
	}
	onLoadAppComplete = (data) => {
    	var appMap={};
    	if(data.errMsg === ''){
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
    
	// 刷新
	handleQueryClick = (event) => {
		this.setState({loading: true});
		
        var fntApp = Context.fntApp;
        var appUuid = (fntApp === null) ? '' : fntApp.uuid;
		FntSvcActions.retrieveFntAppSvc( appUuid );
	}

	// 第一次加载
	componentDidMount() {
		this.unsubscribe = FntSvcStore.listen(this.onServiceComplete);
		this.unsubscribe2 = AuthAppStore.listen(this.onLoadAppComplete);

		this.setState({loading: true, appLoading: true});
        AuthAppActions.initAuthAppInfo();
		
        var fntApp = Context.fntApp;
        var appUuid = (fntApp === null) ? '' : fntApp.uuid;
		FntSvcActions.initFntAppSvc(appUuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
		this.unsubscribe2();
	}

	handleOpenCreateWindow = (event) => {
        var fntApp = Context.fntApp;
        if(fntApp === null){
        	return;
        }

		this.refs.selectAppPage.clear(fntApp.uuid, this.state.fntSvcSet.recordSet, this.state.appList);
		this.refs.selectAppPage.toggle();
	}

	handleRemoveClick = (fntSvc, event) => 
	{
		this.setState({loading: true});
		FntSvcActions.deleteFntAppSvc( fntSvc.uuid );
	}
	handleAppClick = (corpApp) => 
	{
	}

	render(){
		var recordSet = this.state.fntSvcSet.recordSet;
        recordSet.map((fntSvc, i) => {
            var app = this.state.appMap[fntSvc.svcUuid];
            if(app !== null && app !== undefined){
            	fntSvc.svcCode = app.appCode;
            	fntSvc.svcName = app.appName;
            }
            else{
            	fntSvc.svcCode = fntSvc.svcUuid;
            	fntSvc.svcName = fntSvc.svcUuid;
            }
        });
		
		// console.log('selectedApps', selectedApps);
		var cardList =
			recordSet.map((fntSvc, i) => {
                return <div key={fntSvc.uuid} className='card-div' style={{ width: 300 }}>
                    <Card onClick={this.handleAppClick.bind(this, fntSvc)} hint='' title={fntSvc.svcCode}>
                        <a href="#" onClick={this.handleRemoveClick.bind(this, fntSvc)} title='删除'><Icon type={Common.iconRemove} /></a>
                        <div className="ant-card-body" style={{ cursor: 'default', height: '66px', overflow: 'hidden' }}>{fntSvc.svcName}</div>
                    </Card>
				</div>
			});
		
		// console.log('cardList', cardList);
		var loading = this.state.loading || this.state.appLoading;
		var cs = Common.getCardMargin(this);
		return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
				<ServiceMsg ref='mxgBox' svcList={['auth-corp-app/retrieve', 'auth-corp-app/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
	      				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>已关联{recordSet.length}个服务</div>
	                  		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='关联服务' className='toolbar-icon' style={{color: '#108ee9'}}/>
	                  		<Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{paddingLeft:'8px'}}/>
          				</div>
          			</div>
                </div>

		      	{
                    loading ?
                        <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
			    }
			    
				<SelectAppPage ref="selectAppPage"/>
			</div>
		);
	}
}

export default FntSvcPage;

