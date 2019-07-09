"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Spin } from 'antd';
var Context = require('../../AuthContext');
var Utils = require('../../../public/script/utils');
import LeftList from '../../../lib/Components/LeftList';
var ModuleStore = require('../data/ModuleStore');
var ModuleActions = require('../action/ModuleActions');

class ModuleListPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            moduleSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                operation: '',
                errMsg: ''
            },
            selectedRowUuid: '',
            loading: false,
        }
	}
	onServiceComplete = (data) => {
        this.setState({ moduleSet: data, loading: false });
	}

	setLoading = () => {
        this.state.moduleSet.operation = '';
        this.setState({ loading: true });
	}

	componentDidMount() {
		this.unsubscribe = ModuleStore.listen(this.onServiceComplete);

        this.setLoading();
        var appUuid = Context.authApp.uuid;
        ModuleActions.initModuleInfo(appUuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}
	handleModuleClick = (module) => {
        if (module != null) {
            this.props.onSelectModule(module);
        }
	}

	render(){
        if (this.state.loading) {
            if (this.state.moduleSet.operation === 'retrieve') {
                this.state.loading = false;
            }
        }

        const {
        	appUuid,
            onSelectModule,
            ...attributes
        } = this.props;

        var recordSet = this.state.moduleSet.recordSet;
        return (
            (this.state.loading) ? <Spin tip="正在努力加载数据..."></Spin> : <LeftList dataSource={recordSet} rowText='modName' onClick={this.handleModuleClick} {...attributes} />
        );
	}
}

export default ModuleListPage;
