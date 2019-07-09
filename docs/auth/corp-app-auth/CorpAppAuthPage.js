'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');

import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Form, Modal, Button, Input, Select, Tabs, Col, Row, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');

import UserTablePage from './Components/UserTablePage';
import RoleCheckPage from './Components/RoleCheckPage';
import DeptTree from '../../auth/user/Components/DeptTree';

class CorpAppAuthPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            corpApp:{},
            loading: false,
        }
	}

    // 第一次加载
	componentDidMount() {

        this.initPage( this.props.corpApp );
	}
	componentWillUnmount() {
	}

	componentWillReceiveProps(newProps){
		this.initPage( newProps.corpApp );
	}

	initPage = (corpApp) => 
	{
		Utils.copyValue(corpApp, this.state.corpApp);
		this.setState({ loading: false });
		if(typeof(this.refs.mxgBox) != 'undefined' ){
			this.refs.mxgBox.clear();
		}
	}

	goBack = () => {
        this.props.onBack();
	}

	onTabChange = (activeKey) => {
        if(activeKey === '1'){
            this.props.onBack();
        }
	}

	onSelectDept = (dept) => {
    	if(dept === null){
        	this.refs.userTable.loadData('', '');
    	}
    	else{
        	this.refs.userTable.loadData(dept.uuid, dept.deptName);
        }
	}

	onSelectUser = (user) => {
        this.refs.roleCheck.loadData(user);
	}

	render(){
        var compUser = window.loginData.compUser;
        var corpUuid = (compUser === null) ? '' : compUser.corpUuid;
        var appUuid = (this.state.corpApp === null) ? '' : this.state.corpApp.appUuid;

        var cs = Common.getGridMargin(this, 0);
        return (
	      <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
				<Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
					<TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
					</TabPane>
					<TabPane tab="权限管理" key="2" style={{width: '100%', height: '100%'}}>
                        <div className='grid-page' style={{padding: cs.padding}}>
                            <div style={{margin: cs.margin}}>
                                <ServiceMsg ref='mxgBox' svcList={['auth-dept/retrieve', 'comp-user/retrieve','app-auth1/create','app-auth1/retrieve','app-auth1/update','app-auth1/delete']}/>
                            </div>
                            <div style={{ display: 'flex', height: '100%' }}>
                                <div style={{ width: '100%' }}>
                                    <UserTablePage ref='userTable' corpUuid={corpUuid} onSelectUser={this.onSelectUser} />
                                </div>
                                <div className='left-tree' style={{ flex: '0 0 280px', width: '280px', overflowY: 'auto', overflowX: 'hidden' }}>
                                    <RoleCheckPage ref='roleCheck' appUuid={appUuid} />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
	        </div>
        );
	}
}

export default CorpAppAuthPage;

/*
<div style={{display: 'flex', height:'100%'}}>
    <div className='left-tree' style={{flex: '0 0 230px', width: '230px', overflowY:'auto', overflowX:'hidden'}}>
        <DeptTree corpUuid={corpUuid} onSelectDept={this.onSelectDept}/>
    </div>
    <div style={{width:'100%'}}>
        <UserTablePage ref='userTable' corpUuid={corpUuid} onSelectUser={this.onSelectUser}/>
    </div>
    <div className='left-tree' style={{flex: '0 0 280px', width: '280px', overflowY:'auto', overflowX:'hidden'}}>
        <RoleCheckPage ref='roleCheck' appUuid={appUuid}/>
    </div>
</div>
*/
