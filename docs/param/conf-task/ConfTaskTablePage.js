'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Button, Icon, Input } from 'antd';

var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import FormUtil from '../../lib/Components/FormUtil';
import DictTable from '../../lib/Components/DictTable';

var FormDef = require('./Components/ConfTaskForm');
import CreateConfTaskPage from './Components/CreateConfTaskPage';
import UpdateConfTaskPage from './Components/UpdateConfTaskPage';
var ConfTaskStore = require('./data/ConfTaskStore');
var ConfTaskActions = require('./action/ConfTaskActions');

const tableName = 'ConfTaskTable';
class ConfTaskTablePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            confTaskSet: {
                recordSet: []
            },

            loading: false,
            filterValue: '',
            filter: {},

        }
	}

	onServiceComplete = (data) => {
        this.setState({
            loading: false,
            confTaskSet: data
        });
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = ConfTaskStore.listen(this.onServiceComplete);

        this.setState({ loading: true });
        // FIXME 查询条件
        ConfTaskActions.initConfTask(this.state.filter, 0, 0);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

    // 刷新
	handleQueryClick = () => {
        // FIXME 输入缺省条件

        this.setState({ loading: true });
        ConfTaskActions.retrieveConfTask(this.state.filter, 0, 0);
	}

	onChangeFilter = (e) => {
        this.setState({ filterValue: e.target.value });
	}
	onClickDelete = (confTask, event) => {
        var self = this;
        var msg = '是否删除选中的定时器配置【' + confTask.taskName + '】';
        Common.doConfirm(confTask, msg).then(function (result) {
            self.setState({ loading: true });
            ConfTaskActions.deleteConfTask(confTask.uuid);
        });
	}
	handleOpenCreateWindow = (event) => {
        // FIXME 输入参数

        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
	}
	onClickUpdate = (confTask, event) => {
        if (confTask) {
            this.refs.updateWindow.initPage(confTask);
            this.refs.updateWindow.toggle();
        }
	}
	handleSyncQuartz = () => {
        var self = this;
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'conf-task/reschedule';
        Utils.doGetRecord(url, '').then(function (result) {
            self.setState({ loading: false });
            Common.infoMsg('配置信息已更新');
        },
        function (errMsg) {
            self.setState({ loading: false });
            Common.errMsg(errMsg);
        });
	}

	render(){
        var dataSet = Common.filter(this.state.confTaskSet.recordSet, this.state.filterValue);

        // 左上角按钮
        var leftButtons = [
            <Button icon={Common.iconAdd} type="primary" title="增加定时器配置" onClick={this.handleOpenCreateWindow} />,
            <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
        ];

        // 右上角按钮
        var rightButtons = <Input placeholder="查询定时器配置" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} />;

        // 左下角按钮
        var bottomButtons = <Button icon="check-circle-o" type="primary" onClick={this.handleSyncQuartz} >刷新运行中的定时器配置</Button>;
        
        // 表格行按钮
        const operCol =
            {
                title: '更多操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改定时器配置'><Icon type={Common.iconUpdate} /></a>
                        <span className="ant-divider" />
                        <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除定时器配置'><Icon type={Common.iconRemove} /></a>
                    </span>
                ),
            };

        // 表格属性
        var attrs = {
            self: this,
            tableName: tableName,
            primaryKey: 'uuid',
            buttons: leftButtons,
            btnPosition: 'top',
            rightButtons: rightButtons,
            bottomButtons: bottomButtons,
            operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: true,
            defView: '定时器配置信息',
            views: null
        };

        return (
            <div className='grid-page' style={{ padding: '8px 0 10px 0', overflow: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['conf_task/retrieve', 'conf_task/remove']} />
                <DictTable dataSource={dataSet} loading={this.state.loading} attrs={attrs} />

                <CreateConfTaskPage ref="createWindow" />
                <UpdateConfTaskPage ref="updateWindow" />
            </div>
        );
	}
}

export default ConfTaskTablePage;
