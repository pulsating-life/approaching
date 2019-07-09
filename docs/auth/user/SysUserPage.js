'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
import UserTablePage from './Components/SysCompUserTablePage';
import UserPrivPage from './Components/UserPrivPage';

class SysUserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            deptUuid: Common.corpUuid,
            deptName: Common.corpName,

            viewType: 'user',
            compUser: null,
        }
	}

    // 第一次加载
	componentDidMount() {

	}
	componentWillUnmount() {
	}
	onClickPriv = (compUser) => {
        this.setState({ compUser: compUser, viewType: 'priv' });
	}
	onTabChange = (activeKey) => {
        if (activeKey === '1') {
            this.setState({ viewType: 'user' });
        }
	}

	render(){
        var visible = (this.state.viewType === 'user') ? '' : 'none';
        var privPage = null;
        if (this.state.viewType === 'priv') {
            privPage = (
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="权限管理" key="2" style={{ width: '100%', height: '100%' }}>
                        <UserPrivPage compUser={this.state.compUser} />
                    </TabPane>
                </Tabs>
            );
        }

        var cs = Common.getGridMargin(this, 0);
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className='grid-page' style={{ padding: cs.padding, display: visible }}>
                    <div style={{ margin: cs.margin }}>
                        <ServiceMsg ref='mxgBox' svcList={['comp-user/retrieve', 'comp-user/remove']} />
                    </div>
                    <div style={{ height: '100%' }}>
                        <UserTablePage ref='userTable' corpUuid={this.state.deptUuid} type='sys' onSetPriv={this.onClickPriv} />
                    </div>
                </div>
                {privPage}
            </div >
        );
	}
}

export default SysUserPage;
