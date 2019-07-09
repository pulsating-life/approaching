'use strict';

import React from 'react';
var Reflux = require('reflux');
var Utils = require('../../public/script/utils');
var UiParamStore = require('../../../docs/param/ui-param/data/UiParamStore');
var UiParamActions = require('../../../docs/param/ui-param/action/UiParamActions');

import { AutoComplete, Spin } from 'antd';
const Option1 = AutoComplete.Option;

class EmailInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paramList: [],
            result: [],
            loading: false
        }
    }
    onServiceComplete = (data) => {
        this.state.paramList = [];
        if (data.errMsg === '') {
            var list = data.recordSet
            var paramName = '邮件后缀';
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.paramName === paramName) {
                    this.state.paramList = item.paramValue.split('\n');
                    break;
                }
            }
        }

        this.setState({
            loading: false
        });
    }
    componentDidMount = () => {
        this.unsubscribe = UiParamStore.listen(this.onServiceComplete);

        this.setState({ loading: true });
        // FIXME 查询条件
        var corpUuid = window.loginData.compUser.corpUuid;
        UiParamActions.retrieveUiParam(corpUuid);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    handleSearch = (value) => {
        let result;
        if (!value || value.indexOf('@') >= 0) {
            result = [];
        } else {
            result = this.state.paramList.map(domain => `${value}@${domain}`);
        }

        this.setState({ result });
    }
    onEmailChange = (value) => {
        if (this.props.onChange) {
            this.props.onChange(value, this.props.id);
        }
    }
    render() {
        const {
            onChange,
            ...attributes
        } = this.props;

        let result = this.state.result;
        const children = result.map((email) => {
            return <Option1 key={email}>{email}</Option1>;
        });

        return (
            <AutoComplete onChange={this.onEmailChange} onSearch={this.handleSearch} placeholder="请输入电子邮箱" {...attributes} >
                {children}
            </AutoComplete>
        );
    }
}

export default EmailInput;
