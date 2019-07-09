﻿import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');
var Validator = require('../../../public/script/common');

import { Form, Modal, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

var DeptStore = require('../data/DeptStore.js');
var DeptActions = require('../action/DeptActions');

class UpdateDeptPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            deptSet: {
                operation: '',
                errMsg: ''
            },

            loading: false,
            modal: false,
            dept: {},
            hints: {},
            validRules: []
        }
	}
	onServiceComplete = (data) => {
        this.setState({ deptSet: data, loading: false });
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = DeptStore.listen(this.onServiceComplete);

        this.state.validRules = [
            { id: 'deptCode', desc: '部门编号', required: true, max: 64 },
            { id: 'deptName', desc: '部门名称', max: 128 },
            { id: 'deptDesc', desc: '部门描述', max: 512 }
        ];
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
	}

	initPage = (dept) => {
        this.state.hints = {};
        Utils.copyValue(dept, this.state.dept);

        this.state.loading = false;
        this.state.deptSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
	}

	handleOnChange = (e) => {
        var dept = this.state.dept;
        dept[e.target.id] = e.target.value;
        Validator.validator(this, dept, e.target.id);
        this.setState({
            dept: dept
        });
	}

	onClickSave = () => {
        if (Validator.formValidator(this, this.state.dept)) {
            this.state.deptSet.operation = '';
            this.setState({ loading: true });
            DeptActions.updateAuthDept(this.state.dept);
        }
	}

	render(){
        if (this.state.modal && this.state.deptSet.operation === 'update') {
            if (this.state.deptSet.errMsg === '') {
                this.state.modal = false;
                return null;
            }
        }

        if (this.state.loading) {
            if (this.state.deptSet.operation === 'update') {
                this.state.loading = false;
            }
        }

        var layout = 'vertical';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="修改部门信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['auth-dept/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="部门代码" required={true} colon={true} className={layoutItem} help={hints.deptCodeHint} validateStatus={hints.deptCodeStatus}>
                        <Input type="text" name="deptCode" id="deptCode" value={this.state.dept.deptCode} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="部门名称" colon={true} className={layoutItem} help={hints.deptNameHint} validateStatus={hints.deptNameStatus}>
                        <Input type="text" name="deptName" id="deptName" value={this.state.dept.deptName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="部门描述" colon={true} className={layoutItem} help={hints.deptDescHint} validateStatus={hints.deptDescStatus}>
                        <TextArea name="deptDesc" id="deptDesc" value={this.state.dept.deptDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
                    </FormItem>
                </Form>
            </Modal>
        );
	}
}

export default UpdateDeptPage;
