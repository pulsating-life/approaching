"use strict";

import React from 'react';
var Reflux = require('reflux');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');

import ModalForm from '../../../lib/hoc/ModalForm';
import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var FuncStore = require('../data/FuncStore.js');
var FuncActions = require('../action/FuncActions');

@ModalForm('func')
class CreateFuncPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            funcSet: {
                recordSet:[],
  		    	operation : '',
  		    	errMsg : ''
            },
    	    modal: false,
    	    func: {},
            hints: {},
            validRules: []
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
                    funcSet: data
                });
            }
        }
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = FuncStore.listen(this.onServiceComplete);

        this.state.validRules = [
            {id: 'funcName', desc:'功能描述', required: true, max: 256},
            {id: 'funcCode', desc:'功能代码', max: 36}
        ];
	}
	componentWillUnmount() {
		this.unsubscribe();
	}
 
	clear = (func) => {
        this.state.hints = {};
        this.state.func= func;
    	
        this.state.func.funcName='';
        this.state.func.funcCode='';
        this.state.funcSet.operation = '';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined'){
          	this.refs.mxgBox.clear();
        }
	}
  
    //保存  确定
	onClickSave = () => {
    	if(Validator.formValidator( this, this.state.func )){
            this.setState({loading: true});
            this.state.funcSet.operation = '';
            FuncActions.createFuncInfo( this.state.func );
        }
	}
  
	render(){
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 4}),
            wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
    
    var hints=this.state.hints;
    return (
        <Modal visible={this.state.modal} width='540px' title="增加功能参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
            footer={[
            <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                <ServiceMsg ref='mxgBox' svcList={['auth-app-func/create']}/>
                <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
            </div>
            ]}>
            <Form layout={layout}>
            	<FormItem {...formItemLayout} label="模块名称" required={true} colon={true} className={layoutItem} help={hints.modNameHint} validateStatus={hints.modNameStatus}>
                  <Input type="text" name="modName" id="modName" value={this.state.func.modName} onChange={this.handleOnChange} disabled={true}/>
                </FormItem>
                <FormItem {...formItemLayout} label="功能代码" required={true} colon={true} className={layoutItem} help={hints.funcCodeHint} validateStatus={hints.funcCodeStatus}>
                  <Input type="text" name="funcCode" id="funcCode" value={this.state.func.funcCode} onChange={this.handleOnChange} />
                </FormItem>
                <FormItem {...formItemLayout} label="功能名称" colon={true} className={layoutItem} help={hints.funcNameHint} validateStatus={hints.funcNameStatus}>
                  <Input type="text" name="funcName" id="funcName" value={this.state.func.funcName} onChange={this.handleOnChange} />
                </FormItem>
            </Form>
        </Modal>
      );
	}
}

export default CreateFuncPage;
