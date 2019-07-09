import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/hoc/ModalForm';
var Validator = require('../../../public/script/common');
import { Form, Modal, Button, Input } from 'antd';
const TextArea = Input.TextArea;

const FormItem = Form.Item;

var FntAppStore = require('../data/FntAppStore.js');
var FntAppActions = require('../action/FntAppActions');

@ModalForm('fntApp')
class CreateFntAppPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fntAppSet: {
                operation: '',
                errMsg: ''
            },
            modal: false,
            fntApp: {},
            hints: {},
            validRules: []
        }
    }

    onServiceComplete = (data) => {
        if (this.state.modal && data.operation === 'create') {
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
                    fntAppSet: data
                });
            }
        }
    }

    // 第一次加载
    componentDidMount() {
        this.unsubscribe = FntAppStore.listen(this.onServiceComplete);

        this.state.validRules = [
            { id: 'hostName', desc: '服务器名称', required: true, max: '64' },
            { id: 'ipAddr', desc: 'IP地址', required: true, max: '64' },
            { id: 'osName', desc: 'OS编号', required: false, max: '16' },
            { id: 'memInfo', desc: '内存', required: false, max: '64' },
            { id: 'cpuInfo', desc: 'CPU', required: false, max: '64' },
            { id: 'diskInfo', desc: '内置硬盘', required: false, max: '64' },
            { id: 'raidInfo', desc: '磁盘阵列', required: false, max: '64' },
            { id: 'manager', desc: '管理员', required: false, max: '64' },
            { id: 'mPhone', desc: '联系电话', required: false, max: '64' },
            { id: 'deployLoc', desc: '存放地址', required: false, max: '256' },
            { id: 'memo2', desc: '备注', required: false, max: '512' },

        ];
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    clear = () => {
        this.state.hints = {};
        this.state.fntApp.hostName = '';
        this.state.fntApp.ipAddr = '';
        this.state.fntApp.osName = '';
        this.state.fntApp.memInfo = '';
        this.state.fntApp.cpuInfo = '';
        this.state.fntApp.diskInfo = '';
        this.state.fntApp.raidInfo = '';
        this.state.fntApp.manager = '';
        this.state.fntApp.mPhone = '';
        this.state.fntApp.deployLoc = '';
        this.state.fntApp.memo2 = '';

        this.state.fntAppSet.operation = '';
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    }

    onClickSave = () => {
        if (Validator.formValidator(this, this.state.fntApp)) {
            this.state.fntAppSet.operation = '';
            this.setState({ loading: true });
            FntAppActions.createFntApp(this.state.fntApp);
        }
    }

    render() {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;

        return (
            <Modal visible={this.state.modal} width='540px' title="增加应用" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['env_info/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >

                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="应用编号" required={true} colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                        <Input type="text" name="appName" id="appName" value={this.state.fntApp.appName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="应用名称" required={true} colon={true} className={layoutItem} help={hints.appCodeHint} validateStatus={hints.appCodeStatus}>
                        <Input type="text" name="appCode" id="appCode" value={this.state.fntApp.appCode} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="应用说明" required={false} colon={true} className={layoutItem} help={hints.memo2Hint} validateStatus={hints.memo2Status}>
                        <TextArea name="memo2" id="memo2" value={this.state.fntApp.memo2} onChange={this.handleOnChange} />
                    </FormItem>

                </Form>
            </Modal>
        );
    }
}

export default CreateFntAppPage;
