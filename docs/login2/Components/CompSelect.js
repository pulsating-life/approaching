'use strict';

import React from 'react';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var CompStore = require('./CompStore.js');
var CompActions = require('./CompActions');

class CompSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            loading: false
        }
    }
    // 第一次加载
    componentDidMount() {
        this.unsubscribe = CompStore.listen(this.onServiceComplete);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    onServiceComplete = (data) => {
        if (data.operation === 'retrieve' && data.errMsg === '') {
            var recordSet = data.recordSet;
            if (recordSet.length > 0 && this.props.onLoaded) {
                //如果本地有  则按照有的  没有则按照第一个
                var corpUuid = window.localStorage.devCorpUuid;
                if (!corpUuid) {
                    corpUuid = window.localStorage.corpUuid;
                }

                var fieldValue;
                if (!corpUuid) {
                    fieldValue = recordSet[0].corpUuid;
                } else {
                    fieldValue = corpUuid;
                }

                this.props.onLoaded(fieldValue);
            }
        }

        this.setState({ compSet:data, loading: false });
    }
    loadCorps = () => {
        var userName = localStorage.devUserName;
        if (!userName) {
            userName = localStorage.userName;
        }

        var corpUuid = localStorage.devCorpUuid;
        if (!corpUuid) {
            corpUuid = localStorage.corpUuid;
        }

        if (corpUuid && userName &&
            this.state.compSet.operation !== 'retrieve') {
            //加载option
            this.setState({ loading: true });
            CompActions.initCompUser(userName);
        }
    }

    // 第一次加载
    loadData = (userName) => {
        this.setState({
            compSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            loading: true
        });

        CompActions.initCompUser(userName);
    }

    render() {
        const {
	      value,
            ...attributes
	    } = this.props;

        var fieldValue = value;
        var recordSet = this.state.compSet.recordSet;
        var opts = recordSet.map((item, i) => {
            return <Option key={item.corpUuid} value={item.corpUuid}>{item.compName}</Option>
        });
        opts.push(<Option key='#' value='#'>个人用户</Option>);

        var sk = (fieldValue === null || fieldValue === '') ?
            <Select {...attributes} placeholder="选择用户登入的身份">{opts}</Select>
            :
            <Select {...attributes} value={fieldValue}>{opts}</Select>

        return this.state.loading ? <Spin>{sk}</Spin> : sk;
    }
}

export default CompSelect;
