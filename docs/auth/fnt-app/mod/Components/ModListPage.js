"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Spin } from 'antd';
var Context = require('../../../AuthContext');
var Utils = require('../../../../public/script/utils');
import LeftList from '../../../../lib/Components/LeftList';
var FntModStore = require('../data/FntModStore');
var FntModActions = require('../action/FntModActions');

class ModListPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modSet: {
				recordSet: [],
				errMsg : ''
			},
			selectedRowUuid:'',
			loading:false,
		}
	}
	onServiceComplete = (data) => {
        this.setState({
            loading: false,
            modSet: data
        });
	}

	componentDidMount() {
		this.unsubscribe = FntModStore.listen(this.onServiceComplete);

		this.setState({loading: true});
		var appUuid = Context.fntApp.uuid;
		FntModActions.initFntAppMod(appUuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}
	handleModuleClick = (fntMod) => {
        if (fntMod != null) {
            this.setState({ selectedRowUuid: fntMod.uuid})
			this.props.onSelectFntMod( fntMod );
		}
	}
	setActiveNode = (modUuid) => {
		this.setState({
            loading: false,
            selectedRowUuid: modUuid
        });
	}
	
	render(){
        const {
        	onSelectFntMod,
            ...attributes
        } = this.props;

		var recordSet = this.state.modSet.recordSet;
		return (	
			(this.state.loading) ? <Spin tip="正在努力加载数据..."></Spin>: <LeftList dataSource={recordSet} rowText='modName'   activeNode={this.state.selectedRowUuid}  onClick={this.handleModuleClick} {...attributes}/>	
		);
	}
}

export default ModListPage;
