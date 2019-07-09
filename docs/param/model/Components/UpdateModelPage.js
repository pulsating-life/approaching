import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/hoc/ModalForm';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
var ModelStore = require('../data/ModelStore.js');
var ModelActions = require('../action/ModelActions');

@ModalForm('model2')
class UpdateModelPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pathSet: {
				operation : '',
				errMsg : ''
			},

			modal: false,
			model2: {},
			hints: {},
			validRules: [],
			loading:false
		}
	}
	onServiceComplete = (data) => {
	  if(this.state.modal && data.operation === 'update'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.setState({
	              modal: false,
	              loading: false,
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              pathSet: data
	          });
	      }
	  }
	}

	// 第一次加载
	componentDidMount() {
		this.unsubscribe = ModelStore.listen(this.onServiceComplete);

		this.state.validRules = [
          {id: 'pathDesc', desc:'目录说明', required: false, max: '64'},
	      {id: 'pathName', desc:'目录名称', required: true, max: '64'},
		];
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	initPage = (model) => 
	{
		this.state.hints = {};
		Utils.copyValue(model, this.state.model2);
	}

	onClickSave = () => {
		this.state.pathSet.operation = '';
		this.setState({loading: true});
		if(Validator.formValidator(this, this.state.model2)){
			this.state.model2.modelCode = this.state.model2.pathName
			this.props.onSaveCallback( this.state.model2 );
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
	        <Modal visible={this.state.modal} width='540px' title={this.state.model2.isModel=='1'?'修改模板':'修改目录'} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	          footer={[
	          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			        <ServiceMsg ref='mxgBox' svcList={['model-path/update']} />
	           		<Button key="btnOK" type="primary" size="large" loading={this.state.loading} onClick={this.onClickSave}>保存</Button>{' '}
	           		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	           </div>
	          ]}
	        >
	       		<Form layout={layout}>
                    <FormItem {...formItemLayout} label={this.state.model2.isModel == '1' ?'模板编号':'目录名称'} colon={true} className={layoutItem} help={hints.pathNameHint} validateStatus={hints.pathNameStatus}>
						<Input type="text" name='pathName'  id='pathName' value={this.state.model2.pathName} onChange={this.handleOnChange}/>
					</FormItem>
                    <FormItem {...formItemLayout} label={this.state.model2.isModel == '1' ?'模板名称':'目录说明'} colon={true} className={layoutItem} help={hints.pathDescHint} validateStatus={hints.pathDescStatus}>
						<Input type="text" name='pathDesc' id='pathDesc' value={this.state.model2.pathDesc} onChange={this.handleOnChange}/>
					</FormItem>
				</Form>
	        </Modal>
	    );
	}
}

export default UpdateModelPage;
