'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');

class InputView extends React.Component {
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
            value,
            className,
            disabled,
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

        var showText = value;
        if (value && opts) {
            for (var i = 0; i < opts.length; i++) {
                var item = opts[i];
                if (item.codeValue === value) {
                    if (showCode && item.codeDesc !== value) {
                        showText = value + '-' + item.codeDesc;
                    }
                    else {
                        showText = item.codeDesc;
                    }
                }
            }
        }

        var inputClazz;
        if (!className) {
            inputClazz = 'field-input field-border';
        }
        else {
            inputClazz = 'field-input ' + className;
        }

        var style = {};
        if (disabled) {
            style = { backgroundColor: '#F9F9F9' };
        }

        var obj = (
            <div className='field field-input-view' {...attributes}>
                <div className={inputClazz} style={style}>{showText}</div>
            </div>
        );

        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
}

export default InputView;
