import React from 'react';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/hoc/ModalForm';
import FntRoleSelect from './FntRoleSelect';
var Context = require('../../../AuthContext');
var Validator = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Radio, Checkbox, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

var FntRoleStore = require('../../role/data/FntRoleStore');
var FntRoleActions = require('../../role/action/FntRoleActions');

var FntMenuStore = require('../data/FntMenuStore');
var FntMenuActions = require('../action/FntMenuActions');

@ModalForm('menu')
class ChangeAuthPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuSet: {
                operation: '',
                errMsg: ''
            },
            roleSet: {
                recordSet: [],
                errMsg: '',
                operation: ''
            },
            defaultCheckedList: [],
            loading: false,
            modal: false,
            isAppRoles: false,
            appUuid: '',
            modUuid: '',
            menu: {},
            hints: {},
            validRules: []
        }
    }

    onServiceComplete = (data) => {
        if (this.state.modal && (data.operation === 'update' || data.operation === 'create')) {
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
                    menuSet: data
                });
            }
        }
    }
    onServiceComplete1 = (data) => {
        if (data.operation === 'retrieve') {
            this.state.roleSet = data;
            this.setState({ loading: false });
        }
    }

    // 第一次加载
    componentDidMount() {
        this.unsubscribe = FntMenuStore.listen(this.onServiceComplete);
        this.unsubscribe2 = FntRoleStore.listen(this.onServiceComplete1);


    }
    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe2();
    }

    initPage = (menu, appUuid, modUuid) => {
        console.log(menu);
        this.state.menu = menu
        if (menu.node) {
            this.state.defaultCheckedList = menu.appRoles.split(',');
            this.state.isAppRoles = true;

        } else {
            this.state.defaultCheckedList = [];
            this.state.isAppRoles = false;
        }
        this.state.hints = {};

        if (appUuid) {
            FntRoleActions.initFntAppRole(appUuid);
        }
        this.setState({
            loading: false,
            appUuid: appUuid,
            modUuid: modUuid

        });
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    }


    //checkbox变化
    onChange = (e) => {
        this.state.defaultCheckedList = e
        this.setState({
            loading: false
        });
    }

    onClickSave = () => {
        if (this.state.isAppRoles) {
            var filter = this.state.menu.node;
            filter.appRoles = this.state.defaultCheckedList.join(',');
            this.setState({ loading: true });
            FntMenuActions.updateFntAppMenu(filter);
        }
        else {
            var filter = {};
            filter.appRoles = this.state.defaultCheckedList.join(',');
            filter.menuPath = this.state.menu.path;
            filter.menuTitle = this.state.menu.name;
            filter.puuid = this.state.menu.pid;
            filter.appUuid = this.state.appUuid;
            filter.modUuid = this.state.modUuid;
            this.setState({ loading: true });
            FntMenuActions.createFntAppMenu(filter);
        }
    }

    render() {
        var visible = (this.state.menu.leafNode === '1') ? '' : 'none';

        //权限选择list
        var options = this.state.roleSet.recordSet;
        const checkbox = options.map((data, i) => {
            return <div style={{ width: '150px' }}>
                <Checkbox style={{ 'lineHeight': '30px', marginLeft: '10px' }} value={data.roleName} >
                    {data.roleName}
                </Checkbox>
            </div>
        });

        checkbox.push(<Checkbox style={{ 'lineHeight': '30px', marginLeft: '10px' }} value={'*'} >所有用户</Checkbox>);

        const obj = <div>
            <Checkbox.Group onChange={this.onChange} value={this.state.defaultCheckedList} disabled={this.state.initState}>
                {checkbox}
            </Checkbox.Group>
        </div>;

        return (
            <Modal visible={this.state.modal} width='540px' title="请选择权限" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['fnt-app-menu/update', 'fnt-app-menu/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <div>{obj}</div>
            </Modal>
        );
    }
}

export default ChangeAuthPage;