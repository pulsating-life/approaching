﻿'use strict';

import React from 'react';
var Reflux = require('reflux');
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

import { Form, Modal, Button, Input, Table, Select } from 'antd';
const TextArea = Input.TextArea;
const Option = Select.Option;

var lastOrder = {};
class QuickFill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            data: {},
            validRules: [],
            content: '',
            opts: [],
        };
    }

    // 第一次加载
    componentDidMount() {
    }

    initPage = (validRules) => {
        this.setState({
            validRules: validRules,
        });

        this.clear();
    }

    clear = () => {
        this.state.data = {};
        this.state.content = '';
        this.state.opts = [];
        this.setState({
            content: '',
        });
    }

    quickIn= ()=> {
        var opts = this.state.opts;
        var data = this.state.data;
        if (opts.length === 0) {
            return;
        }
        // console.log('lastOrder', lastOrder);
        for (let name in lastOrder) {
            data[name] = opts[lastOrder[name]];
        }
        this.setState({
            modal: this.state.modal
        });
    }

    onDataChange = (e) => {
        var opts = e.target.value.split(/\t+/);
        this.setState({
            content: e.target.value,
            opts: opts
        });
    }

    onSelectValue = (record, value) => {
        this.state.data[record.id] = value;
        this.setState({
            modal: this.state.modal
        });
    }

    onClickSave = () => {
        var obj = this.props.self.state[this.props.object];
        if (obj === undefined || obj === null) {
            return;
        }

        lastOrder = {};
        var batchInput = this.props.self.batchInput;

        let data = this.state.data;
        let opts = this.state.opts;
        for (var name in data) {
            var value = data[name];
            if (value !== undefined && value !== null && value !== '') {
                lastOrder[name] = opts.indexOf(value);
                if (batchInput) {
                    batchInput(name, value);
                }
                else {
                    obj[name] = value;
                }
            }
        }

        this.props.self.setState({ loading: false });
        this.toggle();
    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        var recordSet = this.state.validRules;
        const columns = [
            {
                title: '名称',
                dataIndex: 'desc',
                key: 'desc',
                width: 60,
            },
            {
                title: '值',
                dataIndex: 'value',
                key: 'value',
                width: 140,
                render: (text, record) => {
                    if (this.state.opts.length === 0) {
                        return (<Select style={{ width: '100%' }} value=''></Select>);
                    } else {
                        return (<Select style={{ width: '100%' }} value={this.state.data[record.id]} allowClear={true} onChange={this.onSelectValue.bind(this, record)}>
                            {
                                this.state.opts.map((value, i) => {
                                    return <Option key={i} value={value}>{value}</Option>;
                                })
                            }
                        </Select>);
                    }
                },
            },
        ];

        var cs = Common.getGridMargin(this);
        return (
            <Modal visible={this.state.modal} width='540px' title="导入数据" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} >确定</Button>{' '}
                        <Button key="btnQuickIn" size="large" onClick={this.quickIn}>快速填写</Button>
                        <Button key="btnClear" size="large" onClick={this.clear}>清空</Button>
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
                <div className='grid-body'>
                    <TextArea style={{ marginBottom: '20px' }} name="content" id="content" value={this.state.content} onChange={this.onDataChange} />
                    <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} pagination={false} size="middle" bordered={Common.tableBorder} scroll={{ y: 240 }} />
                </div>
            </Modal>
        );
    }
}

export default QuickFill;

