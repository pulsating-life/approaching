'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');

import { Checkbox, Spin } from 'antd';
const CheckboxGroup = Checkbox.Group;

const verticalStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

class DictCheck extends React.Component {
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
    render() {
        const {
            appName,
            optName,
            options,
            showCode,
            layout,
            checkStyle,
            id,
            value,
            ...attributes
        } = this.props;

        var rStyle = checkStyle;
        if (layout === 'vertical') {
            if (rStyle === null || typeof (rStyle) === 'undefined') {
                rStyle = verticalStyle;
            }
        }

        var optList = this.state.opts;
        if (!optList || optList.length === 0) {
            if (options) {
                var paramList = (options instanceof Array) ? options : options.split(',');
                for (var i = 0; i < paramList.length; i++) {
                    if (typeof paramList[i] === 'object') {
                        optList.push(paramList[i]);
                    }
                    else {
                        var opt = paramList[i].trim();
                        var pos = opt.indexOf('=');
                        if (pos > 0) {
                            var codeValue = opt.substr(0, pos).trim();
                            var codeDesc = opt.substr(1 + pos).trim();
                            optList.push({ codeValue: codeValue, codeDesc: codeDesc });
                        }
                        else {
                            optList.push({ codeValue: opt, codeDesc: opt });
                        }
                    }
                }
            }
        }

        var opts;
        if (showCode) {
            opts = this.state.opts.map((item, i) => {
                var label = (item.codeDesc !== item.codeValue) ? item.codeValue = '-' + item.codeDesc : item.codeDesc;
                return { value: item.codeValue, label: label };
            });
        }
        else {
            opts = this.state.opts.map((item, i) => {
                return { value: item.codeValue, label: item.codeDesc };
            });
        }

        var values = [];
        if (value && value !== '') {
            values = value.split(',');
        }

        // console.log(values, opts)
        var obj = <CheckboxGroup id={id} options={opts} value={values} {...attributes} />;
        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
}

export default DictCheck;
