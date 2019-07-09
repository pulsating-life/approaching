import React from 'react';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Tabs, Table } from 'antd';
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
import ModalForm from '../../../lib/hoc/ModalForm';
var AppStore = require('../data/AppStore');
var AppActions = require('../action/AppActions');

@ModalForm('app')
class CreateDictPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            appSet: {
                recordSet: []
            },

            loading: false,
            modal: false,
            app: {},
            hints: {},
            validRules: [],
            activeTab: '1',
            filterValue: '',
            selNode: null,
            selectedRowUuid: ''
        }
	}

	onServiceComplete = (data) => {
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                var len = data.recordSet.length;
                var app = data.recordSet[len - 1];
                this.props.onSelectRecord(app);
                this.toggle();
            }
            else {
                this.setState({ loading: false });
            }
        }
        else {
            this.setState({
                loading: false,
                appSet: data,
            });
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

        if (!this.state.modal && this.refs.mxgBox) {
            this.refs.mxgBox.clear();
        }

        this.state.selectedRowKeys = [];
        this.setState({ loading: true, activeTab: '1' });
        AppActions.initAppInfo();
	}

	onClickSave = () => {
        if (this.state.activeTab === '2') {
            if (Common.formValidator(this, this.state.app)) {
                this.setState({ loading: true });
                AppActions.createAppInfo(this.state.app);
            }
        }
        else {
            this.props.onSelectRecord(this.state.selNode);
            this.toggle();
        }
	}
	onTabChange = (activeKey) => {
        this.setState({ activeTab: activeKey });
	}
	onChangeFilter = (e) => {
        this.setState({ filterValue: e.target.value });
	}
	onSelect = (record, index) => {
        this.setState({ selNode: record, selectedRowUuid: record.uuid });
	}
	onRowDoubleClick = (record, index) => {
        this.props.onSelectRecord(record);
        this.toggle();
	}
	getRowClassName = (record, index) => {
        var uuid = record.uuid;
        if (this.state.selectedRowUuid == uuid) {
            return 'selected';
        }
        else {
            return '';
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
        var dictPage = [
            <FormItem {...formItemLayout} label="应用名称" required={true} colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                <Input type="text" name="appName" id="appName" value={this.state.app.appName} onChange={this.handleOnChange} />
            </FormItem>,
            <FormItem {...formItemLayout} label="管理员" colon={true} className={layoutItem} help={hints.adminNameHint} validateStatus={hints.adminNameStatus}>
                <Input type="text" name="adminName" id="adminName" value={this.state.app.adminName} onChange={this.handleOnChange} />
            </FormItem>,
            <FormItem {...formItemLayout} label="应用描述" colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
                <TextArea name="appDesc" id="appDesc" value={this.state.app.appDesc} onChange={this.handleOnChange} style={{ height: '80px' }} />
            </FormItem>
        ];

        // 选择字典表
        var recordSet = Common.filter(this.state.appSet.recordSet, this.state.filterValue);
        const columns = [
            {
                title: '模块名称',
                dataIndex: 'appName',
                key: 'appName',
                width: 160,
            },
            {
                title: '模块说明',
                dataIndex: 'appDesc',
                key: 'appDesc',
                width: 300,
            }
        ];

        var tablePage =
            <div className='grid-body' style={{ paddingTop: '12px', height: '360px' }}>
                <div style={{padding: '0 0 6px 0' }}>
                    <Input placeholder="查询字典表" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} />
                </div>
                <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} onRowClick={this.onSelect} onRowDoubleClick={this.onRowDoubleClick} rowClassName={this.getRowClassName} pagination={false} size="middle" bordered={Common.tableBorder} />
            </div>;

        return (
            <Modal visible={this.state.modal} width='660px' title="" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['app-info/create', 'app-info/retrieve']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <Tabs activeKey={this.state.activeTab} onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0', marginTop:'-12px' }}>
                    <TabPane tab="选择字典表" key="1" style={{ width: '100%', height: '100%' }}>
                        {tablePage}
                    </TabPane>
                    <TabPane tab="新建字典表" key="2" style={{ width: '100%', height: '100%' }}>
                        <Form layout={layout} style={{ paddingTop: '16px' }}>
                            {dictPage}
                        </Form>
                    </TabPane>
                </Tabs>
            </Modal>
        );
	}
}

export default CreateDictPage;

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
