'use strict';

import React from 'react';
var Reflux = require('reflux');

var Context = require('../../AuthContext');
var Common = require('../../../public/script/common');
import { Table, Button, Icon, Modal, Spin , Tabs} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var Utils = require('../../../public/script/utils');

var FuncTableStore = require('../data/FuncTableStore');
var FuncTableActions = require('../action/FuncTableActions');

import CreateFuncTablePage from './CreateFuncTablePage';

class FuncTablePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            funcTableSet: {
                recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
            },
            loading: false,
            roleUuid: '',
        }
	}
	onServiceComplete = (data) => {
		this.setState({
			loading: false,
			funcTableSet: data
		});
	}

	componentDidMount() {
		this.unsubscribe = FuncTableStore.listen(this.onServiceComplete);

        this.setState({loading: true, roleUuid:this.props.roleUuid});
        FuncTableActions.initFuncTableInfo(this.props.roleUuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}
	loadData = (roleUuid) => {
    	this.setState({loading: true, roleUuid:roleUuid});
    	FuncTableActions.retrieveFuncTableInfo(roleUuid);
	}

	handleOpenCreateWindow = () => {
    	this.refs.createWindow.clear(this.state.roleUuid);
        this.refs.createWindow.toggle();
	}
    
	handleRemoveClick = (func) => {
        Modal.confirm({
          title: Common.removeTitle,
          content: '是否删除选中的角色 【'+func.funcName+'】' ,
          okText: Common.removeOkText,
          cancelText: Common.removeCancelText,
          onOk: this.handleRemoveWindow2.bind( this, func )
        });
        
        event.stopPropagation();
	}
	handleRemoveWindow2 = (func) => {
        this.setState({loading: true});
        FuncTableActions.deleteFuncTableInfo( func.uuid );
	}
   
	render(){
	    const columns = [
	    {
	        title: '功能代码',
	        dataIndex: 'funcCode',
	        key: 'funcCode',
	        width: 140,
	    },
	    {
	        title: '功能名称',
	        dataIndex: 'funcName',
	        key: 'funcName',
	        width: 140,
	    },
	    {
	        title: '',
	        key: 'action',
	        width: 40,
	        render: (text, func) => (
	            <span>
	                <a href="#" onClick={this.handleRemoveClick.bind(this, func)} title='移除'><Icon type={Common.iconRemove}/></a>
	            </span>
	        ),
	    }
	    ];
	    
	    var recordSet = this.state.funcTableSet.recordSet;
	  	var title = '角色【'+Context.role.roleDesc + '】包含 ' + recordSet.length + ' 个功能';
	    return (
	        <div className='grid-page' style={{padding: '58px 0 0 0'}}>
	            <div style={{margin: '-58px 0 0 0'}}>
	            	<div className='toolbar-table'>
	            		<div style={{paddingTop:'8px', paddingRight:'8px', display: 'inline'}}>{title}</div>
	            		<Button icon={Common.iconAdd} type="primary" title="增加功能"  onClick={this.handleOpenCreateWindow} style={{marginLeft: '8px'}}/>
	            	</div>
	            </div>
	            <div className='grid-body'>
	                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} size="middle" pagination={false} bordered={Common.tableBorder}/>
	            </div>
	            <CreateFuncTablePage ref="createWindow"/>
	        </div>
	    );
	}
}

export default FuncTablePage;


