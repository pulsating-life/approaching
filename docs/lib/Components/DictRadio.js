'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');

import { Radio, Spin } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const verticalStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

class DictRadio extends React.Component {
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
            radioStyle,
            type,
            id,
            ...attributes
        } = this.props;

        var rStyle = radioStyle;
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
                return (type === 'button') ?
                    <RadioButton id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>label</RadioButton>
                    : <Radio id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>label</Radio>;
            });
        }
        else {
            opts = this.state.opts.map((item, i) => {
                return (type === 'button') ?
                    <RadioButton id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>{item.codeDesc}</RadioButton>
                    : <Radio id={id} key={item.codeValue} style={rStyle} value={item.codeValue}>{item.codeDesc}</Radio>;
            });
        }

        var obj = <RadioGroup id={id} {...attributes}>
            {opts}
        </RadioGroup>;

        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
}

export default DictRadio;
