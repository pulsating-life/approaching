'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');

import { AutoComplete, Spin } from 'antd';
const Option1 = AutoComplete.Option;

class DictSuffix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paramList: [],
            result: [],
            loading: false
        };
    }

    showOptions = (opts) => {
        var paramList = [];
        var values = opts.codeData;
        if (values) {
            for (var i = 0; i < values.length; i++) {
                paramList.push(values[i].codeDesc);
            }
        }

        this.setState({
            paramList: paramList,
            loading: false
        });
    }
    componentWillMount() {
        const {
            appName,
            optName,
            options,
        } = this.props;

        if (appName && optName) {
            this.state.loading = true;
            Utils.loadOptions(appName, optName, this.showOptions);
        }
    }
    handleSearch = (value) => {
        let result;
        var splitChar = this.props.splitChar;
        if (!splitChar) {
            result = this.state.paramList.map(domain => `${value}${domain}`);
        }
        else if (!value || value.indexOf(splitChar) >= 0) {
            result = [];
        } else {
            result = this.state.paramList.map(domain => `${value}${splitChar}${domain}`);
        }

        this.setState({ result });
    }

    render() {
        const {
            appName,
            optName,
            options,
            splitChar,
            ...attributes
        } = this.props;

        var paramList = this.state.paramList;
        if (!paramList || paramList.length === 0) {
            if (options) {
                if (options instanceof Array) {
                    paramList = options;
                }
                else {
                    paramList = options.split(',');
                }
            }
        }

        let result = this.state.result;
        const children = result.map((opt) => {
            return <Option1 key={opt}>{opt}</Option1>;
        });

        var obj = <AutoComplete onSearch={this.handleSearch} {...attributes} >
            {children}
        </AutoComplete>;

        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
}

export default DictSuffix;
