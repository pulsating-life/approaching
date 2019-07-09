'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');

import { Select, Spin } from 'antd';
const Option = Select.Option;

class DictSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opts: [],
            loading: false
        };
    }

    showOptions = (opts) => {
        var values = opts.codeData;
        if (values === null || typeof (values) === 'undefined') {
            values = [];
        }

        this.setState({
            opts: values,
            loading: false
        });
    }
    componentWillMount() {
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
        if (this.props.onSelect) {
            var inputValue = this.props.value;
            var arr = inputValue ? inputValue.split(',') : [];
            arr.push(value);
            inputValue = arr.join(',');

            this.props.onSelect(inputValue);
        }
    }

    deselectMultiValue = (value) => {
        if (this.props.onSelect) {
            var inputValue = this.props.value;
            var arr = inputValue ? inputValue.split(',') : [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === value) {
                    arr.splice(i, 1);
                    break;
                }
            }

            inputValue = arr.join(',');
            this.props.onSelect(inputValue);
        }
    }

    render() {
        const {
            appName,
            optName,
            options,
            showCode,
            required,
            mode,
            onSelect,
            value,
            readOnly,
            disabled,
            ...attributes
        } = this.props;

        //if (!opts || opts.length === 0) {
        if (options) {
            this.state.opts = [];
            var opts = this.state.opts;
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
        //}

        var opts;
        if (showCode) {
            opts = this.state.opts.map((item, i) => {
                return <Option key={item.codeValue} value={item.codeValue}>{item.codeValue}-{item.codeDesc}</Option>;
            });
        }
        else {
            opts = this.state.opts.map((item, i) => {
                return <Option key={item.codeValue} value={item.codeValue}>{item.codeDesc}</Option>;
            });
        }

        var flag = false;
        if (readOnly === true || disabled === true) {
            flag = true;
        }

        var obj;
        if (mode === 'multiple' || mode === 'tags') {
            var list = value ? value.split(',') : [];
            obj =
                <Select mode={mode} value={list} onSelect={this.selectMultiValue} onDeselect={this.deselectMultiValue} disabled={flag} {...attributes}>
                    {opts}
                </Select>;
        }
        else {
            if (required) {
                obj = <Select value={value} onSelect={onSelect} disabled={flag} {...attributes}>
                    {opts}
                </Select>;
            }
            else {
                obj = <Select value={value} onSelect={onSelect} disabled={flag} {...attributes}>
                    <Option value=''>--</Option>
                    {opts}
                </Select>;
            }
        }

        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
}

export default DictSelect;
