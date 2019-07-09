'use strict';

import React from 'react';
var Reflux = require('reflux');
import { Form, Modal, Button } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/hoc/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var FormDef = require('./ConfTaskForm');
var ConfTaskStore = require('../data/ConfTaskStore');
var ConfTaskActions = require('../action/ConfTaskActions');

@ModalForm('confTask')
class UpdateConfTaskPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            loading: false,
            modal: false,
            confTask: {},
            hints: {},
            validRules: []
        }
	}

	onServiceComplete = (data) => {
        if (this.state.modal && data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({ modal: false });
            }
            else {
                // 失败
                this.setState({ loading: false });
            }
        }
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = ConfTaskStore.listen(this.onServiceComplete);

        this.state.validRules = FormDef.getConfTaskFormRule(this);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	initPage = (confTask) => {
        this.state.hints = {};
        this.state.confTask = {};
        Utils.copyValue(confTask, this.state.confTask);

        this.setState({ loading: false });
        if (this.refs.mxgBox) {
            this.refs.mxgBox.clear();
        }
	}

	onClickSave = () => {
        if (Common.formValidator(this, this.state.confTask)) {
            this.setState({ loading: true });
            ConfTaskActions.updateConfTask(this.state.confTask);
        }
	}

	render(){
        var layoutItem = 'form-item-' + FormDef.layout;
        var attrList = [
            { name: 'cron', className: 'code-edit' },
            { name: 'clazzName', className: 'code-edit' }
        ];
        var items = FormDef.getConfTaskForm(this, this.state.confTask, attrList);

        return (
            <Modal visible={this.state.modal} width='640px' title="修改定时器配置信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['conf_task/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={FormDef.layout}>
                    {items}
                </Form>
            </Modal>
        );
	}
}

export default UpdateConfTaskPage;
