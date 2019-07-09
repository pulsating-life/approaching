'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { withRouter } from 'react-router-dom';
import { Button, Table, Icon, Modal, Input, Spin } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import Card from '@/lib/Components/Card';

var AppStore = require('./data/AppStore');
var AppActions = require('./action/AppActions');
var Context = require('../ParamContext');
import CreateAppPage from './Components/CreateAppPage';
import UpdateAppPage from './Components/UpdateAppPage';

var filterValue = '';
@withRouter
class AppPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appSet: {
                recordSet: [],
                startPage: 0,
                pageRow: 0,
                totalRow: 0,
                errMsg: ''
            },
            loading: false,
        }
    }

    onServiceComplete = (data) => {
        this.setState({
            loading: false,
            appSet: data,
        });
    }

    componentDidMount() {
        this.unsubscribe = AppStore.listen(this.onServiceComplete);
        this.setState({ loading: true });
        AppActions.initAppInfo();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    handleQueryClick = (event) => {
        this.setState({ loading: true });
        AppActions.retrieveAppInfo();
    }
    handleOpenCreateWindow = (event) => {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    }

    handleUpdateClick = (app, event) => {
        if (app != null) {
            this.refs.updateWindow.initPage(app);
            this.refs.updateWindow.toggle();
        }
        event.stopPropagation();
    }

    handleRemoveClick = (app, event) => {
        Modal.confirm({
            title: Common.removeTitle,
            content: '是否删除选中的APP 【' + app.appName + '】',
            okText: Common.removeOkText,
            cancelText: Common.removeCancelText,
            onOk: this.handleRemoveClick2.bind(this, app)
        });
        event.stopPropagation();
    }

    handleRemoveClick2 = (app) => {
        this.setState({ loading: true });
        AppActions.deleteAppInfo(app.uuid);
    }

    handleAppClick = (app, e) => {
        if (app != null) {
            Context.paramApp = app;
            this.props.history.push({
                pathname: '/param2/ModPage/',
                state: { fromDashboard: true }
            });
        }
    }
    onFilterRecord = (e) => {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    }

    render () {
        var recordSet = Common.filter(this.state.appSet.recordSet, filterValue);
        var cardList =
            recordSet.map((app, i) => {
                return <div key={app.uuid} className='card-div' style={{ width: 300 }}>
                    <Card onClick={this.handleAppClick.bind(this, app)} hint='点击进入参数管理页面' title={app.appName}>
                        <a href="#" onClick={this.handleUpdateClick.bind(this, app)} title='修改'><Icon type={Common.iconUpdate} /></a>
                        <a href="#" onClick={this.handleRemoveClick.bind(this, app)} title='删除'><Icon type={Common.iconRemove} /></a>
                        <div className="ant-card-body" style={{ cursor: 'pointer' }}>{app.appDesc}</div>
                    </Card>
                </div>
            });

        return (
            <div className='card-page' style={{ height: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['app-info/retrieve', 'app-info/remove']} />

                <div style={{ margin: '8px 16px 14px 16px' }}>
                    <div style={{ float: 'left' }}>
                        <div style={{ width: 200 }}>应用参数和字典维护
                            <Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加应用' className='toolbar-icon' style={{ color: '#108ee9' }} />
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', width: '100%', paddingTop: '6px' }}>
                        <Search placeholder="查找记录" style={{ width: Common.searchWidth }} value={filterValue} onChange={this.onFilterRecord} />
                    </div>
                </div>

                {
                    this.state.loading ?
                        <Spin tip="正在努力加载数据...">{cardList}</Spin>
                        :
                        <div>{cardList}</div>
                }
                <CreateAppPage ref="createWindow" />
                <UpdateAppPage ref="updateWindow" />
            </div>
        );
    }
}

export default AppPage;
