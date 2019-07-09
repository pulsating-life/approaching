import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ModalForm from '../../../lib/hoc/ModalForm';

import { Form, Modal, Button, Input, Select, Radio, Row, Col } from 'antd';
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var AuthAppStore = require('../data/AppStore.js');
var AuthAppActions = require('../action/AppActions');

@ModalForm('authApp')
class UpdateAuthAppPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authAppSet: {},
            loading: false,
			modal: false,
			authApp: {},
			hints: {},
			validRules: []
		}
	}

	onServiceComplete = (data) => {
        if (this.state.modal && data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    authAppSet: data
                });
            }
        }
	}

	// 第一次加载
	componentDidMount() {
		this.unsubscribe = AuthAppStore.listen(this.onServiceComplete);

		this.state.validRules = [
            {id: 'appCode', desc:'服务编号', required: true, max: 64},
            { id: 'appName', desc: '服务名称', max: 64 },
            { id: 'iconFile', desc: '权限扫描地址', max: 64 },
            { id: 'appDesc', desc: '服务说明', max: 1024 }, 
            { id: 'privRoles', desc: '缩写', required: true, max: 10 },
		];
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	initPage = (authApp) => 
	{
		this.state.hints = {};
		Utils.copyValue(authApp, this.state.authApp);
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
        	this.refs.mxgBox.clear();
        }
	}

	onClickSave = () => {
        if (Validator.formValidator(this, this.state.authApp)) {
            this.setState({ loading: true });
			AuthAppActions.updateAuthAppInfo( this.state.authApp );
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
	        <Modal visible={this.state.modal} width='540px' title="修改服务信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
	          footer={[
	          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
			        <ServiceMsg ref='mxgBox' svcList={['auth-app-info/update']}/>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
	           		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
	           </div>
	          ]}
	        >
                <Form layout={layout}>
                    <Row>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="服务编号" required={true} colon={true} className={layoutItem} help={hints.appCodeHint} validateStatus={hints.appCodeStatus}>
                                <Input type="text" name="appCode" id="appCode" value={this.state.authApp.appCode} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} label="缩写" required={true} colon={true} className={layoutItem} help={hints.privRolesHint} validateStatus={hints.privRolesStatus}>
                                <Input type="text" name="privRoles" id="privRoles" value={this.state.authApp.privRoles} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem {...formItemLayout} label="服务名称" colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                    	<Input type="text" name="appName" id="appName" value={this.state.authApp.appName} onChange={this.handleOnChange}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="收费类型" colon={true} className={layoutItem} help={hints.appChargeHint} validateStatus={hints.appChargeStatus}>
						<RadioGroup name="appCharge" id="appCharge" onChange={this.onRadioChange} value={this.state.authApp.appCharge}>
			              <Radio id="appCharge" value='0'>免费</Radio>
			              <Radio id="appCharge" value='1'>收费</Radio>
			            </RadioGroup>
                    </FormItem>
                    <FormItem {...formItemLayout} label="权限扫描" colon={true} className={layoutItem} help={hints.iconFileHint} validateStatus={hints.iconFileStatus}>
                        <Input type="text" name="iconFile" id="iconFile" value={this.state.authApp.iconFile} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="服务说明" colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
                        <TextArea name="appDesc" id="appDesc" value={this.state.authApp.appDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
	        	</Form>
	        </Modal>
	    );
	}
}

export default UpdateAuthAppPage;

