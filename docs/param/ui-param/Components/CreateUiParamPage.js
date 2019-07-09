﻿import React from 'react';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/hoc/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var UiParamStore = require('../data/UiParamStore.js');
var UiParamActions = require('../action/UiParamActions');

@ModalForm('uiParam')
class CreateUiParamPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uiParamSet: {},
			loading: false,
			modal: false,
			uiParam: {},
			hints: {},
			validRules: []
		}
	}

	onServiceComplete = (data) => {
		if(this.state.modal && data.operation === 'create'){
			if( data.errMsg === ''){
				// 成功，关闭窗口
				this.setState({
					modal: false
				});
			}
			else{
				// 失败
				this.setState({
					loading: false,
					uiParamSet: data
				});
			}
		}
	}

	// 第一次加载
	componentDidMount() {
		this.unsubscribe = UiParamStore.listen(this.onServiceComplete);

		this.state.validRules = [
			{ id: 'paramName', desc: '参数名称', required: true, max: 64,},
			{ id: 'paramValue', desc: '参数值', max: 2048,},
		];
	}
	componentWillUnmount() {
		this.unsubscribe();
	}
	
	clear = (corpUuid) => {
		// FIXME 输入参数，对象初始化
		this.state.hints = {};
		this.state.uiParam.uuid='';
		this.state.uiParam.corpUuid = corpUuid;
		this.state.uiParam.paramName='';
		this.state.uiParam.paramValue='';
		
		this.state.loading = false;
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	}

	onClickSave = () => {
		if(Common.formValidator(this, this.state.uiParam)){
			this.setState({loading: true});
			UiParamActions.createUiParam( this.state.uiParam );
		}
	}

	render(){
		var layout='horizontal';
		var layoutItem='form-item-'+layout;
		const formItemLayout = {
			labelCol: ((layout=='vertical') ? null : {span: 4}),
			wrapperCol: ((layout=='vertical') ? null : {span: 20}),
		};
		const formItemLayout2 = {
			labelCol: ((layout == 'vertical') ? null : { span: 8 }),
			wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
		};

		var hints=this.state.hints;
		return (
			<Modal visible={this.state.modal} width='540px' title="增加UI参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['ui-param/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
		   		<Form layout={layout}>
					<FormItem {...formItemLayout} className={layoutItem} label='参数名称' required={true} colon={true} help={hints.paramNameHint} validateStatus={hints.paramNameStatus}>
							<Input type='text' name='paramName' id='paramName' value={this.state.uiParam.paramName} onChange={this.handleOnChange} />
					</FormItem>
					<FormItem {...formItemLayout} className={layoutItem} label='参数值' colon={true} help={hints.paramValueHint} validateStatus={hints.paramValueStatus}>
							<TextArea name='paramValue' id='paramValue' style={{ height: '200px' }} value={this.state.uiParam.paramValue} onChange={this.handleOnChange} />
					</FormItem>
				</Form>
			</Modal>
		);
	}
}

export default CreateUiParamPage;