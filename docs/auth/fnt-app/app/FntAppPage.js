'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
var Context = require('../../AuthContext');

import { Table, Button, Icon, Input, Spin, Modal, Tabs } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import Card from '../../../lib/Components/Card';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var FntAppStore = require('./data/FntAppStore');
var FntAppActions = require('./action/FntAppActions');
import CreateFntAppPage from './Components/CreateFntAppPage';
import UpdateFntAppPage from './Components/UpdateFntAppPage';

import FntModPage from '../mod/FntModPage';
import FntMenuPage from '../menu/FntMenuPage';
import FntRolePage from '../role/FntRolePage';
import FntSvcPage from '../svc/FntSvcPage';

var filterValue = '';
class FntAppPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fntAppSet: {
				recordSet: [],
				errMsg : ''
			},
	        loading: false,
	        selectedApp: null,
			selectKey: '20',
			fntMod:{},
		}
	}

	onServiceComplete = (data) => {
        this.setState({
            loading: false,
            fntAppSet: data
        });
	}

	// 刷新
	handleQueryClick = (event) => {
		this.setState({loading: true});
		FntAppActions.retrieveFntApp();
	}

	// 第一次加载
	componentDidMount() {
		this.unsubscribe = FntAppStore.listen(this.onServiceComplete);

		this.setState({loading: true,selectKey: '20'});
		FntAppActions.initFntApp();
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	handleOpenCreateWindow = (event) => {
		this.refs.createWindow.clear();
		this.refs.createWindow.toggle();
	}
	
	selectedApp = (fntApp) => {
		Context.fntApp = fntApp;
		this.setState({selectedApp: fntApp});
	}
	handleAppClick = (fntApp) => 
	{
		this.selectedApp( fntApp );
	}
	handleUpdateClick = (fntApp, event) => 
	{
		if(fntApp != null){
			this.refs.updateWindow.initPage(fntApp);
			this.refs.updateWindow.toggle();
		}

    	event.stopPropagation();
	}
	handleRemoveClick = (fntApp, event) => 
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的APP 【'+fntApp.appCode+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, fntApp)
		});

    	event.stopPropagation();
	}
	onClickDelete2 = (fntApp) => 
	{
        this.setState({loading: true});
		FntAppActions.deleteFntApp( fntApp.uuid );
	}
	onFilterRecord = (e) => {
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
	}

	selectsMod = (fntMod) => {
        this.setState({
            selectKey:'50',
			fntMod:fntMod,
        })
	}
	onLoadRedis = () => {
        var url = Utils.authUrl + 'sys/init';

        var self = this;
        Utils.doCreateService(url, {}).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                Common.infoMsg('权限已启用');
            }
            else {
                Common.errMsg("处理错误[" + result.errCode + "][" + result.errDesc + "]");
            }
        }, function (value) {
            Common.errMsg("调用服务错误");
        });
	}

    //点击Tab后回调
	onTabChange = (activeKey) => {
        if(activeKey === '1'){
			this.setState({
            	selectKey:'20',
        	})
			this.selectedApp(null);
        } else {
			this.setState({
            selectKey:activeKey,
        	})
		}
	}
	render(){
        var recordSet = [];
		var selectKey = this.state.selectKey;
        if(filterValue === ''){
            recordSet = this.state.fntAppSet.recordSet;
        }
        else{
            recordSet = Common.filter(this.state.fntAppSet.recordSet, filterValue);
        }
		
        var visible='';
        var app = this.state.selectedApp;
        if(app !== null){
            visible = 'none';
        }

		var cardList =
			recordSet.map((app, i) => {
                return <div key={app.uuid} className='card-div' style={{ width: 300 }}>
                    <Card onClick={this.handleAppClick.bind(this, app)} hint='点击修改APP信息' title={app.appCode}>
                        <a href="#" onClick={this.handleUpdateClick.bind(this, app)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <a href="#" onClick={this.handleRemoveClick.bind(this, app)} title='删除'><Icon type={Common.iconRemove} /></a>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{app.appName}</div>
                    </Card>
				</div>
			});

		var cs = Common.getCardMargin(this);
		var cardPage = (
    		<div className='card-page' style={{padding: cs.padding, display:visible}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['fnt-app/retrieve', 'fnt-app/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
	      				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个应用</div>
	                  		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加应用' className='toolbar-icon' style={{color: '#108ee9'}}/>
                                <Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{ paddingLeft: '8px' }} />
                                <Button key="btnLoadRedis" type="primary" size="small" onClick={this.onLoadRedis} style={{ marginLeft: '16px' }} >更新权限数据</Button>
          				</div>
          				<div style={{textAlign:'right', width:'100%'}}>
                              <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                          </div>
          			</div>
                </div>

		      	{
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
			    }

				<CreateFntAppPage ref="createWindow"/>
				<UpdateFntAppPage ref="updateWindow"/>
			</div>
		);
		
        if(app === null){
            return (
                <div style={{width: '100%', height: '100%'}}>
                    {cardPage}
                </div>
            );
        }

		return (
            <div style={{width: '100%', height: '100%'}}>
                {cardPage}
                <div className='tab-page'>
                    <Tabs ref='appTabs' defaultActiveKey='20' activeKey={this.state.selectKey} onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                        <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>

                        </TabPane>
                        <TabPane tab="模块" key="20" style={{width: '100%', height: '100%'}}>
							<FntModPage selectsMod={this.selectsMod.bind(this)}/>
                        </TabPane>
                        <TabPane tab="服务" key="30" style={{width: '100%', height: '100%'}}>
							<FntSvcPage/>
                        </TabPane>
                        <TabPane tab="角色" key="40" style={{width: '100%', height: '100%'}}>
							<FntRolePage/>
                        </TabPane>
                        <TabPane tab="菜单" key="50" style={{width: '100%', height: '100%'}}>
                            <FntMenuPage modUuid={this.state.fntMod.uuid} modCode={this.state.fntMod.modCode}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
		);
	}
}

export default FntAppPage;
