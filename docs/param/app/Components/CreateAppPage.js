import React from 'react';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select } from 'antd';
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
import ModalForm from '../../../lib/hoc/ModalForm';
var AppStore = require('../data/AppStore');
var AppActions = require('../action/AppActions');

@ModalForm('app')
class CreateAppPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            loading: false,
            modal: false,
            app: {},
            hints: {},
            validRules: []
        }
	}

	onServiceComplete = (data) => {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                this.setState({ modal: false });
            }
            else {
                this.setState({ loading: false });
            }
        }
	}

	componentDidMount() {
		this.unsubscribe = AppStore.listen(this.onServiceComplete);

        this.state.validRules = [
            { id: 'appName', desc: '应用名称', required: true, max: 64 },
            { id: 'appDesc', desc: '应用描述', max: 1024 },
            { id: 'adminName', desc: '管理员', max: 32 },
            { id: 'adminEmail', desc: '电子邮件', dataType: 'email', max: 64 },
            { id: 'adminPhone', desc: '电话', max: 32 },
            { id: 'iconFile', desc: '图标文件', max: 128 }
        ];
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	clear = () => {
        this.state.hints = {};
        this.state.app.appName = '';
        this.state.app.iconFile = '';
        this.state.app.adminName = '';
        this.state.app.adminEmail = '';
        this.state.app.adminPhone = '';
        this.state.app.appDesc = '';

        this.state.loading = false;
        if (!this.state.modal && this.refs.mxgBox) {
            this.refs.mxgBox.clear();
        }
	}

	onClickSave = () => {
        if (Validator.formValidator(this, this.state.app)) {
            this.setState({ loading: true });
            AppActions.createAppInfo(this.state.app);
        }
	}

	render(){
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加APP" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['app-info/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="应用名称" required={true} colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                        <Input type="text" name="appName" id="appName" value={this.state.app.appName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="管理员" colon={true} className={layoutItem} help={hints.adminNameHint} validateStatus={hints.adminNameStatus}>
                        <Input type="text" name="adminName" id="adminName" value={this.state.app.adminName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="应用描述" colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
                        <TextArea name="appDesc" id="appDesc" value={this.state.app.appDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
                </Form>
            </Modal>
        );
	}
}

export default CreateAppPage;

/*
<FormItem {...formItemLayout} label="图标文件" colon={true} className={layoutItem} help={hints.iconFileHint} validateStatus={hints.iconFileStatus}>
    <Input type="text" name="iconFile" id="iconFile" value={this.state.app.iconFile} onChange={this.handleOnChange} />
</FormItem>
<FormItem {...formItemLayout} label="电子邮件" colon={true} className={layoutItem} help={hints.adminEmailHint} validateStatus={hints.adminEmailStatus}>
    <Input type="text" name="adminEmail" id="adminEmail" value={this.state.app.adminEmail} onChange={this.handleOnChange} />
</FormItem>
<FormItem {...formItemLayout} label="联系电话" colon={true} className={layoutItem} help={hints.adminPhoneHint} validateStatus={hints.adminPhoneStatus}>
    <Input type="text" name="adminPhone" id="adminPhone" value={this.state.app.adminPhone} onChange={this.handleOnChange} />
</FormItem>
*/
