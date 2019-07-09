'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Modal, Icon, Button, Tree, Input, Form, Spin } from 'antd';
const TextArea = Input.TextArea;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');
import ModalForm from '../../lib/hoc/ModalForm';
var Validator = require('../../public/script/common');

var ModelStore = require('./data/ModelStore.js');
var ModelActions = require('./action/ModelActions');
var ModelInfoStore = require('./data/ModelInfoStore.js');
var ModelInfoActions = require('./action/ModelInfoActions');
import CreateModelPage from './Components/CreateModelPage';
import UpdateModelPage from './Components/UpdateModelPage';

var expandedKeys2 = [];
var selectedKeys2 = [];

@ModalForm('model')
class ModelPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            pathSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            modelSet: {
                recordSet: [],
                operation: '',
                errMsg: ''
            },
            validRules: [],
            model: {},
            isRefresh: false,
            rootNodes: [],
            isPath: '',
            isModel: '',
            isEditor: '',
            loading: false,
            loading2: false,
            hints: {}
        }
	}

	onServiceComplete = (data) => {
        if (data.operation === 'retrieve') {
            this.setState({
                loading: false,
                pathSet: data
            });
        } else {
            // 失败
            this.setState({
                loading: false,
                pathSet: data
            });
        }
	}

	onServiceComplete2 = (data) => {
        if (data.operation === 'create' && data.errMsg === '') {
            Common.succMsg('保存成功');
        } else if (data.operation === 'update' && data.errMsg === '') {
            Common.succMsg('修改成功');
        }
        if (data.operation === 'retrieve' || data.operation === 'update' || data.operation === 'create') {
            this.setState({
                loading2: false,
                modelSet: data,
            });
            this.setState({
                model: {
                    fmtBody: this.state.modelSet.recordSet[0].fmtBody
                }
            })
        }
	}
    // 刷新
	handleQueryClick = (event) => {
        this.setState({ loading: true });
        this.state.pathSet.operation = '';
        ModelActions.retrievePageModel();
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = ModelStore.listen(this.onServiceComplete);
		this.unsubscribe2 = ModelInfoStore.listen(this.onServiceComplete2);

        this.state.validRules = [
            { id: 'fmtBody', desc: '模板内容', required: false, max: '2147483647' }
        ];
        this.setState({ loading: true });
        ModelActions.retrievePageModel();
	}
	componentWillUnmount() {
		this.unsubscribe();
		this.unsubscribe2();
	}

	showError = (msg) => {
        var pathSet = this.state.pathSet;
        pathSet.errMsg = msg;
        pathSet.operation = 'retrieve';
        this.setState({
            pathSet: pathSet
        });
	}

	onSelect = (selectedKeys, e) => {
        selectedKeys2 = selectedKeys;

        var isPath = !e.node.props.children ? 1 : 0;
        if (isPath === 0) {
            if (!e.node.props.expanded) {
                var groupUuid = e.node.props.eventKey;
                expandedKeys2.push(groupUuid);
            }
        }

        this.setState({
            isRefresh: true,
            isPath: isPath
        });

        if (selectedKeys.length !== 0) {
            var selNode = this.getSelectedNode();
            this.state.isModel = selNode.isModel
            this.state.isEditor = selNode.isModel
            this.state.model.fmtBody = ''
            if (this.state.isModel == '1') {
                //模板数据请求
                this.setState({ loading2: true });
                ModelInfoActions.retrieveModelInfo(selNode.uuid, '#')

            } else {
                //目录	
                if (this.state.modelSet.recordSet.length) {
                    this.state.model.fmtBody = ''
                }

            }
        }
	}

	onExpand = (expandedKeys, info) => {
        expandedKeys2 = expandedKeys;
	}

	getSelectedNode = () => {
        if (selectedKeys2.length !== 1) {
            return null;
        }
        var recordSet = this.state.pathSet.recordSet;
        var len = recordSet.length;
        for (var i = 0; i < len; i++) {
            if (recordSet[i].uuid === selectedKeys2[0]) {
                return recordSet[i];
            }
        }

        return null;
	}

	handleOpenCreateWindow = (event) => {
        var selNode = this.getSelectedNode();
        var puuid = '';
        var groupUuid = '';
        if (selNode) {
            puuid = selNode.puuid
            groupUuid = selNode.uuid
        }
        this.refs.createWindow.clear(groupUuid, '#', this.state.isModel, puuid);
        this.refs.createWindow.toggle();
	}

	handleAddChild = (event) => {
        var selNode = this.getSelectedNode();
        if (selNode === null) {
            this.showError('请选择一个父目录');
            return;
        }
        this.refs.createWindow.clear('', '#', this.state.isModel, selectedKeys2[0]);
        this.refs.createWindow.toggle();
	}
    //保存  
	handleSavePath = () => {
        var model = this.state.model;
        var selNode = this.getSelectedNode();
        var modelSet = this.state.modelSet;
        if (selNode === null) {
            this.showError('请选择一个模板');
            return;
        }
        if (model.fmtBody === '') {
            Common.warnMsg('请在模板内输入数据后保存');
            return;
        }
        if (modelSet.recordSet.length !== 0 && model.fmtBody === modelSet.recordSet[0].fmtBody) {
            Common.warnMsg('请确认是否已对模板进行了修改');
            return;
        }
        if (typeof modelSet.recordSet[0] == 'undefined') {
            //新增
            this.setState({ loading2: true });
            model.groupUuid = selNode.uuid;
            model.corpUuid = '#';
            ModelInfoActions.createModelInfo(model);
        } else {
            //修改
            this.setState({ loading2: true });
            model.groupUuid = selNode.uuid;
            model.corpUuid = '#';
            model.uuid = modelSet.recordSet[0].uuid
            ModelInfoActions.updateModelInfo(model);
        }
	}

	onClickUpdate = (event) => {
        var selNode = this.getSelectedNode();
        if (selNode === null) {
            this.showError('请选择一个目录');
            return;
        }
        this.refs.updateWindow.initPage(selNode);
        this.refs.updateWindow.toggle();
	}

	onCreateCallback = (path) => {
        if (path.puuid !== null && path.puuid !== '') {
            expandedKeys2.push(path.puuid);
        }

        ModelActions.createPageModel(path);
	}

	onClickDelete = (event) => {
        var selNode = this.getSelectedNode();
        if (selNode === null) {
            this.showError('请选择一个目录');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的 【' + selNode.pathName + '】',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, selNode)
        });
	}

	onClickDelete2 = (path) => {
        this.setState({ loading: true });
        this.state.pathSet.operation = '';
        ModelActions.deletePageModel(path.uuid);
	}
	onSaveCallback = (path) => {
        ModelActions.updatePageModel(path);
	}

	preCrtNode = (data, recordSet) => {
        var node = {};
        node.key = data.uuid;
        node.pid = data.puuid;
        if (data.pathDesc === '' || data.pathDesc == data.pathName) {
            node.title = data.pathName;
        }
        else {
            node.title = data.pathName + '(' + data.pathDesc + ')';
        }
        return node;
	}
	onLoadModel = () => {
        var self = this;
        var url = Utils.paramUrl + 'model-info/flush';
        Utils.doCreate(url, { corpUuid: '#' }).then(function (result) {
            Common.succMsg('模板已经刷新');
        }, function (value) {
            Common.errMsg(value);
        });
	}

	render(){
        var isEditor = !Number(this.state.isEditor);
        var isDisabled2 = !this.state.isPath;
        var isModel = Number(this.state.isModel);

        if (this.state.isRefresh) {
            this.state.isRefresh = false;
        }
        else {
            this.state.rootNodes = Common.initTreeNodes(this.state.pathSet.recordSet, this.preCrtNode);
        }

        var tree = <Tree
            defaultExpandedKeys={expandedKeys2}
            defaultSelectedKeys={selectedKeys2}
            onSelect={this.onSelect}
            onExpand={this.onExpand}
        >
            {
                this.state.rootNodes.map((data, i) => {
                    return Common.prepareTreeNodes(data);
                })
            }
        </Tree>

        var treePage = [
            <ServiceMsg ref='mxgBox' svcList={['model-path/retrieve', 'model-path/remove']} />,
            <div style={{ margin: '8px 8px 0' }}>
                <Button icon="plus" title="增加目录/模板" type="primary" onClick={this.handleOpenCreateWindow} />
                <Button icon="folder-add" title="增加子目录/模板" onClick={this.handleAddChild} disabled={isModel} style={{ marginLeft: '4px' }} />
                <Button icon="edit" title="修改目录/模板" onClick={this.onClickUpdate} style={{ marginLeft: '4px' }} />
                <Button icon="delete" title="删除目录/模板" onClick={this.onClickDelete} disabled={isDisabled2} style={{ marginLeft: '4px' }} />
                <Button icon="sync" title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
            </div>,
            this.state.loading ? <Spin tip="正在努力加载数据..." style={{ minHeight: '200px' }}> {tree}</Spin> : tree
        ];

        var cs = Common.getCardMargin(this, 50);
        cs.padding = cs.padding.substr(0, 5) + ' 10px 10px 16px';
        return (
            <div className='grid-page'>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div className='left-tree' style={{ flex: '0 0 230px', width: '230px', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ height: '100%', overflowY: 'hidden' }}>
                                {treePage}
                            </div>
                            <div style={{ flex: '0 0 40px', height: '40px', paddingRight: '8px' }}>
                                <Button key="btnLoadModel" type="primary" size="large" onClick={this.onLoadModel} style={{width:'100%'}}>刷新缓存模板</Button>
                            </div>
                        </div>

                    </div>
                    <div style={{ overflow: 'hidden', width: '100%' }}>
                        <div className='grid-body' style={{ margin: '10px 0px 0px 0px', padding: cs.padding }}>
                            <div style={{ margin: cs.margin }}>
                                <ServiceMsg ref='mxgBox' svcList={['model-info/create', 'model-info/update']} />
                                <div style={{ marginBottom: '12px' }}>
                                    <Button icon="folder" title="保存" onClick={this.handleSavePath} disabled={isEditor} />
                                </div>
                            </div>
                            <div style={{ height: '100%' }}>
                                {this.state.loading2 ?
                                    <Spin>
                                        <TextArea style={{ width: '100%', height: '100%' }} name='fmtBody' id='fmtBody' className='code-edit' disabled={isEditor} value={this.state.model.fmtBody} onChange={this.handleOnChange} />
                                    </Spin>
                                    : <TextArea style={{ width: '100%', height: '100%' }} name='fmtBody' id='fmtBody' className='code-edit' disabled={isEditor} value={this.state.model.fmtBody} onChange={this.handleOnChange} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <CreateModelPage ref="createWindow" onCreateCallback={this.onCreateCallback} />
                <UpdateModelPage ref="updateWindow" onSaveCallback={this.onSaveCallback} />
            </div>
        );
    }
}

export default ModelPage;

