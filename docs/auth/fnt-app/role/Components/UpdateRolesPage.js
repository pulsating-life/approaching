import React from 'react';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/hoc/ModalForm';
var Validator = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import DictRadio from '../../../../lib/Components/DictRadio';

var FntRoleStore = require('../data/FntRoleStore');
var FntRoleActions = require('../action/FntRoleActions');

@ModalForm('role')
class UpdateRolesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            roleSet: {
                errMsg: ''
            },
            loading: false,
            modal: false,
            role: {},
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
                    roleSet: data
                });
            }
        }
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = FntRoleStore.listen(this.onServiceComplete);

        this.state.validRules = [
            { id: 'roleName', desc: '角色名称', required: true, max: '32' },
            { id: 'roleDesc', desc: '角色描述', required: true, max: '256' },
            { id: 'roleStatus', desc: '启用标志', required: true, max: '1' },
        ];
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	initPage = (role) => {
        this.state.hints = {};
        Utils.copyValue(role, this.state.role);

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
	}

	onClickSave = () => {
        if (Validator.formValidator(this, this.state.role)) {
            this.setState({ loading: true });
            FntRoleActions.updateFntAppRole(this.state.role);
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
            <Modal visible={this.state.modal} width='540px' title="修改角色信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['fnt_app_role/update']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="角色名称" required={true} colon={true} className={layoutItem} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}>
                        <Input type="text" name="roleName" id="roleName" value={this.state.role.roleName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="角色描述" required={false} colon={true} className={layoutItem} help={hints.roleDescHint} validateStatus={hints.roleDescStatus}>
                        <Input type="text" name="roleDesc" id="roleDesc" value={this.state.role.roleDesc} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="启用标志" required={false} colon={true} className={layoutItem} help={hints.roleStatusHint} validateStatus={hints.roleStatusStatus}>
                        <DictRadio name="roleStatus" id="roleStatus" value={this.state.role.roleStatus} appName='common' optName='启用状态' onChange={this.onRadioChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
	}
}

export default UpdateRolesPage;
