'use strict';

import React from 'react';
import { AutoComplete, Spin, Input } from 'antd';
var Utils = require('../../public/script/utils');


class DictInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appName: '',
            optName: '',
            paramList: [],
            loading: false
        };
    }

    showOptions = (opts) => {
        var paramList = [];
        var values = opts.codeData;
        if (values) {
            if (this.props.show === 'code') {
                for (var i = 0; i < values.length; i++) {
                    paramList.push(values[i].codeValue);
                }
            }
            else {
                for (var i = 0; i < values.length; i++) {
                    paramList.push(values[i].codeDesc);
                }
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
            show,
        } = this.props;

        if (appName && optName) {
            this.setState({
                loading: true, appName: appName, optName: optName
            });

            Utils.loadOptions(appName, optName, this.showOptions);
        }
    }
    componentWillReceiveProps (newProps) {
        const {
            appName,
            optName
        } = newProps;

        if (appName && optName && (appName !== this.state.appName || optName != this.state.optName)) {
            this.setState({
                loading: true, appName: appName, optName: optName
            });

            Utils.loadOptions(appName, optName, this.showOptions);
        }
    }

    render() {
        const {
            appName,
            optName,
            options,
            show,
            suffix,
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

        var obj = <AutoComplete dataSource={paramList} filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1} {...attributes} />;
        if (suffix) {
            obj = (
                <AutoComplete dataSource={paramList} filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1} {...attributes}>
                    <Input suffix={suffix} />
                </AutoComplete>
            );
        }
        else {
            obj = <AutoComplete dataSource={paramList} filterOption={(inputValue, option) => option.props.children.indexOf(inputValue) !== -1} {...attributes} />;
        }

        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
}

export default DictInput;
