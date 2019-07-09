'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');

var Context = require('../../AuthContext');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Input, Spin, Modal } from 'antd';
const Search = Input.Search;
import Card from '../../../lib/Components/Card';
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var FntModActions = require('./action/FntModActions');
var FntModStore = require('./data/FntModStore');
import CreateFntModPage from './Components/CreateFntModPage';
import UpdateFntModPage from './Components/UpdateFntModPage';
import FntMenuPage from '../menu/FntMenuPage';

var filterValue = '';
class FntModPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            fntModSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            loading: false,
            selectedApp: null,
        }
	}

	onServiceComplete = (data) => {
        this.setState({
            loading: false,
            fntModSet: data
        });
	}

    // 刷新
	handleQueryClick = (event) => {
        var appUuid = Context.fntApp.uuid;
        this.setState({ loading: true });
        FntModActions.retrieveFntAppMod(appUuid);
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = FntModStore.listen(this.onServiceComplete);

        this.state.fntModSet.operation = '';
        this.setState({ loading: true });
        var appUuid = Context.fntApp.uuid;
        FntModActions.initFntAppMod(appUuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	handleOpenCreateWindow = (event) => {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
	}

	handleUpdateClick = (fntMod, event) => {
        if (fntMod != null) {
            this.refs.updateWindow.initPage(fntMod);
            this.refs.updateWindow.toggle();
        }
        event.stopPropagation();
	}

    // 移除模块
	handleRemoveClick = (fntMod, event) => {
        Modal.confirm({
            title: '移除确认',
            content: '是否移除选中的应用 【' + fntMod.modCode + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickRemove2.bind(this, fntMod)
        });
	}

    // 跳转菜单维护
	handleAppClick = (fntMod) => {
        this.props.selectsMod(fntMod);
	}

	onClickRemove2 = (fntMod) => {
        this.setState({ loading: true });
        FntModActions.deleteFntAppMod(fntMod.uuid);
	}

	onFilterRecord = (e) => {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
	}

	render(){
        var recordSet = Common.filter(this.state.fntModSet.recordSet, filterValue);
        var cardList =
            recordSet.map((fntMod, i) => {
                return <div key={fntMod.uuid} className='card-div' style={{ width: 300 }}>
                    <Card onClick={this.handleAppClick.bind(this, fntMod)} hint='点击进入菜单维护' title={fntMod.modCode}>
                        <a href="#" onClick={this.handleUpdateClick.bind(this, fntMod)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <a href="#" onClick={this.handleRemoveClick.bind(this, fntMod)} title='删除'><Icon type={Common.iconRemove} /></a>
                        <div className="ant-card-body" style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{fntMod.modName}</div>
                    </Card>
                </div>
            });

        var cs = Common.getCardMargin(this);
        var contactTable =
            <div className='card-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['fnt_app_mod/retrieve', 'fnt_app_mod/remove']} />
                    <div className='toolbar-card'>
                        <div style={{ float: 'left' }}>
                            <div style={{ paddingTop: '16px', paddingRight: '4px', display: 'inline' }}>{recordSet.length}个模块</div>
                            <Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加模块' className='toolbar-icon' style={{ color: '#108ee9' }} />
                            <Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{ paddingLeft: '8px' }} />
                        </div>
                        <div style={{ textAlign: 'right', width: '100%' }}>
                            <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                        </div>
                    </div>
                </div>

                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}>{cardList}</Spin>
                        :
                        <div className='card-body'>{cardList}</div>
                }

                <CreateFntModPage ref="createWindow" />
                <UpdateFntModPage ref="updateWindow" />
            </div>

        return (
            <div style={{ width: '100%', height: '100%' }}>
                {contactTable}
            </div>
        );
	}
}

export default FntModPage;
