'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { withRouter } from 'react-router-dom';
import { Table, Button, Icon, Input, Spin, Modal } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
import Card from '../../lib/Components/Card';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
var AppGroupStore = require('./data/AppGroupStore.js');
var AppGroupActions = require('./action/AppGroupActions');
import CreateAppGroupPage from './Components/CreateAppGroupPage';

var filterValue = '';
@withRouter
class AppGroupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appGroupSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            validRules: [],
            loading: false,
        }
    }

    onServiceComplete = (data) => {
        this.setState({
            loading: false,
            appGroupSet: data
        });
    }

    // 刷新
    handleQueryClick = (event) => {
        this.state.appGroupSet.operation = '';
        this.setState({loading: true});
        AppGroupActions.retrieveAuthAppGroup();
    }

    // 第一次加载
    componentDidMount() {
        this.unsubscribe = AppGroupStore.listen(this.onServiceComplete);
        this.state.appGroupSet.operation = '';
        this.setState({loading: true});
        AppGroupActions.initAuthAppGroup();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOpenCreateWindow(event) {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    }

    /*点击卡片页，跳转到修改页面*/
    handleAppGroupClick = (appGroup, e) => {
        if(appGroup != null){
            this.props.history.push({
                pathname: '/auth/GroupPage/',
                query: {
                    appGroup: JSON.stringify(appGroup),
                },
                state: { fromDashboard: true }
            });
        }
        e.stopPropagation();
    }

    handleUpdateClick = (appGroup, e) => {
        if(appGroup != null){
            this.refs.updateWindow.initPage(appGroup);
            this.refs.updateWindow.toggle();
        }
        e.stopPropagation();
    }
    handleRemoveClick = (appGroup, event) => {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的应用组 【'+appGroup.groupName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.handleRemoveClick2.bind(this, appGroup)
        });

        event.stopPropagation();
    }
    handleRemoveClick2 = (appGroup) => {
        this.state.appGroupSet.operation = '';
        this.setState({loading: true});
        AppGroupActions.deleteAuthAppGroup( appGroup.uuid );
    }
    onFilterRecord = (e) => {
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    }

    render () {
        var recordSet = [];
        if(filterValue === ''){
            recordSet = this.state.appGroupSet.recordSet;
        }
        else{
            recordSet = Common.filter(this.state.appGroupSet.recordSet, filterValue);
        }
        
        var cardList =
            recordSet.map((appGroup, i) => {
                return <div key={appGroup.uuid} className='card-div' style={{ width: 300 }}>
                    <Card onClick={this.handleAppGroupClick.bind(this, appGroup)} hint='点击修改APP组信息' title={appGroup.groupName}>
                        <a href="#" onClick={this.handleAppGroupClick.bind(this, appGroup)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <a href="#" onClick={this.handleRemoveClick.bind(this, appGroup)} title='删除'><Icon type={Common.iconRemove} /></a>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{appGroup.groupDesc}</div>
                    </Card>
                </div>
            });

		var cs = Common.getCardMargin(this);
        return (
    		<div className='card-page' style={{padding: cs.padding}}>
                <div style={{margin: cs.margin}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-app-group/retrieve','auth-app-group/remove']}/>

          		    <div className='toolbar-card'>
          		    	<div style={{float:'left'}}>
	      				    <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个APP组</div>
	                  		<Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加APP组' className='toolbar-icon' style={{color: '#108ee9'}}/>
	                  		<Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{paddingLeft:'8px'}}/>
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
                <CreateAppGroupPage ref="createWindow"/>
            </div>
        );
    }
}

export default AppGroupPage;
