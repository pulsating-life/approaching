'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');

import { Select, Spin } from 'antd';
const Option = Select.Option;

class CellSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opts: [],
            loading: false
        };
    }

    showOptions = (opts) => {
        var values = opts.codeData;
        if (!values) {
            values = [];
        }

        this.setState({
            opts: values,
            loading: false
        });
    }
    componentWillMount = () => {
        const {
            appName,
            optName,
        } = this.props;

        if (appName && optName) {
            this.state.loading = true;
            Utils.loadOptions(appName, optName, this.showOptions);
        }
    }
    selectMultiValue = (value) => {
        const {
            record,
            name,
        } = this.props;

        var inputValue = record[name];
        var arr = inputValue ? inputValue.split(',') : [];
        arr.push(value);

        record[name] = arr.join(',');
        this.setState({ loading: false });
    }
    deselectMultiValue = (value) => {
        const {
            record,
            name,
        } = this.props;

        var inputValue = record[name];
        var arr = inputValue ? inputValue.split(',') : [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                arr.splice(i, 1);
                break;
            }
        }

        record[name] = arr.join(',');
        this.setState({ loading: false });
    }
    onSelect = (value) => {
        const {
            record,
            name,
            onChange,
        } = this.props;

        record[name] = value;

        if (onChange) {
            onChange(record, name, value);
        }

        this.setState({ loading: false });
    }

    render() {
        const {
            appName,
            optName,
            options,
            required,
            mode,
            record,
            name,
            onChange,
            ...attributes
        } = this.props;

        var opts = this.state.opts;
        if (!opts || opts.length === 0) {
            if (options) {
                var paramList = (options instanceof Array) ? options : options.split(',');
                for (var i = 0; i < paramList.length; i++) {
                    if (typeof paramList[i] === 'object') {
                        opts.push(paramList[i]);
                    }
                    else {
                        var opt = paramList[i].trim();
                        var pos = opt.indexOf('=');
                        if (pos > 0) {
                            var codeValue = opt.substr(0, pos).trim();
                            var codeDesc = opt.substr(1 + pos).trim();
                            opts.push({ codeValue: codeValue, codeDesc: codeDesc });
                        }
                        else {
                            opts.push({ codeValue: opt, codeDesc: opt });
                        }
                    }
                }
            }
        }

        var value = record[name];
        if (record.editable === true || record.editable === 'true') {  // 编辑模式
            // 是否显示代码
            var showCode = true;
            var re = /^\d+$/;
            for (var i = 0; i < opts.length; i++) {
                if (!re.test(opts[i].codeValue)) {
                    showCode = false;
                    break;
                }
            }

            var optList;
            if (showCode) {
                optList = this.state.opts.map((item, i) => {
                    return <Option key={item.codeValue} value={item.codeValue}>{item.codeValue}-{item.codeDesc}</Option>;
                });
            }
            else {
                optList = this.state.opts.map((item, i) => {
                    return <Option key={item.codeValue} value={item.codeValue}>{item.codeDesc}</Option>;
                });
            }

            var obj;
            if (mode === 'multiple') {
                var list = value ? value.split(',') : [];
                obj =
                    <Select mode="multiple" value={list} onSelect={this.selectMultiValue} onDeselect={this.deselectMultiValue} style={{ width: '100%' }} {...attributes}>
                        {optList}
                    </Select>;
            }
            else {
                if (required) {
                    obj = <Select value={value} onSelect={this.onSelect} style={{ width: '100%' }} {...attributes}>
                        {optList}
                    </Select>;
                }
                else {
                    obj = <Select value={value} onSelect={this.onSelect} style={{ width: '100%' }} {...attributes}>
                        <Option value=''>--</Option>
                        {optList}
                    </Select>;
                }
            }

            return this.state.loading ? <Spin>{obj}</Spin> : obj;
        }

        // 非编辑模式
        var cc = opts ? opts.length : 0;
        for (var i = 0; i < cc; i++) {
            var node = opts[i];
            if (node.codeValue === value) {
                if (value !== node.codeDesc) {
                    var re = /^\d+$/;
                    value = (re.test(value)) ? value + '-' + node.codeDesc : node.codeDesc;
                }

                break;
            }
        }

        return (
            <div>
                {value}
            </div>
        );
    }
}

export default CellSelect;
