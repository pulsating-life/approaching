"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import {Button, Spin, Icon, Modal} from 'antd';
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
import LeftList from '../../../lib/Components/LeftList';
var RolesStore = require('../data/RolesStore.js');
var RolesActions = require('../action/RolesActions');
import CreateRolesPage from './CreateRolesPage';
import UpdateRolesPage from './UpdateRolesPage';

class RoleListPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rolesSet: {
				recordSet: [],
				operation : '',
				errMsg : ''
			},
            loading: false,
            appUuid: '',
			selectedRows: null,
		}
	}
	onServiceComplete = (data) => {
        if(data.errMsg === '' && data.operation === 'remove'){
            this.handleRolesClick(null);
        }

        this.setState({
            loading: false,
            rolesSet: data
        });
	}
	componentDidMount() {
		this.unsubscribe = RolesStore.listen(this.onServiceComplete);

        var appUuid = this.props.appUuid;
        this.setState({loading: true, appUuid:appUuid});
		RolesActions.initAuthAppRoleGroup(appUuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}
	componentWillReceiveProps(nextProps){
        var appUuid = nextProps.appUuid;
        if(this.state.appUuid !== appUuid){
            this.setState({loading: true, appUuid:appUuid});
    		RolesActions.initAuthAppRoleGroup(appUuid);
        }
	}
	handleRolesClick = (roles) => {
        this.state.selectedRows = roles;
		this.props.onSelectRoles( roles );
	}
	handleOpenCreateWindow = () => {
		this.refs.createWindow.clear(this.state.appUuid);
		this.refs.createWindow.toggle();
	}
	handleOpenUpdateWindow = () => {
		if(this.state.selectedRows != null){
			this.refs.updateWindow.initPage(this.state.selectedRows);
			this.refs.updateWindow.toggle();
		}
	}
	onClickDelete = () => {
        var roles = this.state.selectedRows;
        if(roles === null){
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的角色 【'+roles.roleName+'】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, roles)
        });
	}
	onClickDelete2 = (roles) => {
        this.setState({loading: true});
        RolesActions.deleteAuthAppRoleGroup( roles.uuid );
	}

	render(){
        const {
        	appUuid,
        	onSelectRoles,
            ...attributes
        } = this.props;

        var isSelected = (this.state.selectedRows !== null);
		var recordSet = this.state.rolesSet.recordSet;
		
		var tool =
			<div style={{padding: '8px 0 8px 8px'}}>
				<Button icon={Common.iconAdd} type="primary" title="增加角色组" onClick={this.handleOpenCreateWindow} style={{marginLeft: '4px'}}/>
				<Button icon={Common.iconUpdate} type="primary" disabled={!isSelected} title="修改角色组" onClick={this.handleOpenUpdateWindow} style={{marginLeft: '4px'}}/>
				<Button icon={Common.iconRemove} title="删除角色组" disabled={!isSelected} onClick={this.onClickDelete} style={{marginLeft: '4px'}}/>
			</div>

		return (
            <div className='grid-page'>
                <div style={{height:'100%', overflow:'auto'}}>
                    {
                    this.state.loading
                        ? <Spin tip="正在努力加载数据..." style={{minHeight:'200px'}}>
                            <LeftList dataSource={recordSet} rowText='roleName' onClick={this.handleRolesClick} toolbar={tool} {...attributes}/>
                          </Spin>
        			    : <LeftList dataSource={recordSet} rowText='roleName' onClick={this.handleRolesClick} toolbar={tool} {...attributes}/>
                    }
                </div>
                <CreateRolesPage ref="createWindow"/>
                <UpdateRolesPage ref="updateWindow"/>
            </div>
		);
	}
}

export default RoleListPage;
