'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Tree, Spin, Modal, Button, Form, Input} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/hoc/ModalForm';
var Context = require('../../AuthContext');
var Common = require('../../../public/script/common');

var FuncTableStore = require('../data/FuncTableStore');
var FuncTableActions = require('../action/FuncTableActions');

import FuncSelectTree from './FuncSelectTree';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

@ModalForm('funcTble')
class CreateFuncTablePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            funcTbleSet: {
                recordSet:[],
                operation : '',
                errMsg : ''
            },
            loading: false,
            modal: false,
            roleUuid: '',
            funcTable: {},
            checkedKeys: [],
        }
	}
    
	onServiceComplete = (data) => {
        if(this.state.modal && data.operation === 'create'){
            if( data.errMsg === ''){
                // 成功
                this.setState({
                    loading: false,
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    funcTbleSet: data
                });
            }
        }
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = FuncTableStore.listen(this.onServiceComplete);

        this.state.funcTbleSet.operation = '';
        this.setState({loading: true});
	}
	componentWillUnmount() {
		this.unsubscribe();
	}
	clear = (roleUuid) => {
    	this.state.roleUuid = roleUuid;
	}
  
    //保存  确定
	onClickSave = () => {
    	var funcTree = this.refs.funcTree;
    	if(funcTree === null || typeof(funcTree) === 'undefined'){
    		return;
    	}
    	
    	var list = [];
    	var len = this.state.checkedKeys.length;
    	for(var i=0; i<len; i++){
    		var uuid = this.state.checkedKeys[i];
    		var func = funcTree.state.funcMap[uuid];
    		if(func !== null && typeof(func) !== 'undefined'){
    			var node={
    				roleUuid: this.state.roleUuid,
    				funcUuid: func.uuid,
    				funcCode: func.funcCode,
    				funcName: func.funcName
    			};
    			
    			list.push(node);
    		}
    	}
    	
        FuncTableActions.createFuncTableInfo( list );
	}
	onSelects = (checkedKeys,modUuids) => {
    	this.setState({checkedKeys: checkedKeys});
	}
	render(){
	    return (
	        <Modal visible={this.state.modal} width='540px' title="增加功能参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	            footer={[
	            <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
	                <ServiceMsg ref='mxgBox' svcList={['auth-role-func/create', 'auth-app-module/retrieve', 'auth-app-func/retrieve']}/>
	                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>确定</Button>{' '}
	                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	            </div>
	            ]}>
	            <div style={{maxHeight: '400px', overflow: 'auto'}}>
	            	<FuncSelectTree ref='funcTree' onSelect={this.onSelects}/>
	            </div>
	        </Modal>
	      );
	}
}

export default CreateFuncTablePage;