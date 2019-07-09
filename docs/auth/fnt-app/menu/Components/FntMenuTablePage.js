'use strict';
import React from 'react';

var Reflux = require('reflux');
import { Form, Input, Button, Table, Icon, Modal } from 'antd';
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');

var Context = require('../../../AuthContext');
var FntMenuStore = require('../data/FntMenuStore');
var FntMenuActions = require('../action/FntMenuActions');
import MenuTree from './MenuTree';
import CreateFntMenuPage from './CreateFntMenuPage';
import MenuInfoPage from './MenuInfoPage';
import LeafNodePage from './LeafNodePage';
import ChildMenuPage from './ChildMenuPage';
import ChangeAuthPage from './ChangeAuthPage';

var expandedRows = [];
class FntMenuTablePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            menuSet: {
                recordSet: [],
                errMsg: '',
            },

            loading: false,
            fntMod: {},
            menuList: [],     // 实际的菜单表
            menuMap: {},      // 菜单对照表
        }
	}

	onServiceComplete = (data) => {
        if (data.errMsg === '') {
            var recordSet = data.recordSet;
            // console.log('recordSet', recordSet)
            var len = recordSet.length;
            for (var i = 0; i < len; i++) {
                var node = recordSet[i];
                var menuNode = this.state.menuMap[node.menuPath]
                if (menuNode) {
                    menuNode.appRoles = node.appRoles;
                    menuNode.node = node;
                }
            }
        }

        this.setState({
            loading: false,
            menuSet: data
        });
	}

	componentDidMount() {
		this.unsubscribe = FntMenuStore.listen(this.onServiceComplete);

        var prop = this.props.fntMod;
        var fntMod = {};
        fntMod.uuid = prop.modUuid;
        fntMod.modCode = prop.modCode;
        this.initAppMenu(fntMod, prop);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	componentWillReceiveProps(nextProps){
        var prop = nextProps.fntMod;
        if (prop.modUuid !== this.state.fntMod.uuid) {
            var fntMod = {};
            fntMod.uuid = prop.modUuid;
            fntMod.modCode = prop.modCode;

            this.initAppMenu(fntMod, prop);
        }
	}

	initAppMenu = (fntMod, prop) => {
        Context.fntMod = fntMod;

        this.setState({
            loading: true,
            modUuid: fntMod,
            menuList: prop.menuList,
            menuMap: prop.menuMap
        });
        if (fntMod.uuid) {
            FntMenuActions.initFntAppMenu(fntMod.uuid);
        }
	}

	onExpandedRowsChange = (expandedRows2) => {
        expandedRows = expandedRows2;
	}
	onAuthorize = (record) => {

        this.refs.createWindow.initPage(record, Context.fntApp.uuid, Context.fntMod.uuid);
        this.refs.createWindow.toggle();
	}
	render(){

        var recordSet = this.state.menuList
        const columns = [
            {
                title: '菜单编号',
                dataIndex: 'path',
                key: 'path',
                width: 180,
            },
            {
                title: '菜单标题',
                dataIndex: 'name',
                key: 'name',
                width: 120,
            },
            {
                title: '角色',
                dataIndex: 'appRoles',
                key: 'appRoles',
                width: 140,
            },
            {
                title: '操作',
                key: 'action',
                width: 40,
                render: (text, record) => (
                    <span style={{ marginLeft: '5px' }}>
                        <a href="#" onClick={this.onAuthorize.bind(this, record)} title='权限'><Icon type='safety' /></a>
                    </span>
                ),
            }
        ]

        return (
            <div className='grid-body' style={{ paddingTop: '10px' }}>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.id} defaultExpandedRowKeys={expandedRows} onExpandedRowsChange={this.onExpandedRowsChange} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder} />
                <ChangeAuthPage ref="createWindow" />
            </div>
        )
	}
}

export default FntMenuTablePage;
