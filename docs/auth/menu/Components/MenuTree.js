'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Tree, Spin} from 'antd';
const TreeNode = Tree.TreeNode;

var Context = require('../../AuthContext');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var MenuStore = require('../data/MenuStore.js');
var MenuActions = require('../action/MenuActions');

var expandedKeys2= [];
var selectedKeys2= [];
class MenuTree extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            menuSet: {
                recordSet: [],
                operation : ''
            },
            loading: false,
            rootNodes: [],
            menuMap: {},
        }
	}
	onServiceComplete = (data) => {
        var rootNodes = [];
        var menuMap = {};
        if( data.errMsg === ''){
            rootNodes = Common.initTreeNodes(data.recordSet, this.preCrtNode);
            data.recordSet.map((data,i) => {
                menuMap[data.uuid] = data;
            })
        }

        this.setState({
            loading: false,
            menuSet: data,
            rootNodes: rootNodes,
            menuMap: menuMap
        });
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = MenuStore.listen(this.onServiceComplete);

        expandedKeys2= [];
        selectedKeys2= [];

        this.setState({loading: true});
        this.state.menuSet.operation = '';
        MenuActions.initAuthAppMenu(Context.authApp.uuid);
	}
	componentWillUnmount() {
		this.unsubscribe();
	}

	onSelect = (selectedKeys, e) => 
    {
        selectedKeys2 = selectedKeys;

        if( e.node != null ){
            var po = e.node.props;
            if( !po.expanded && typeof(po.children) !== 'undefined' ){
                expandedKeys2.push( po.eventKey );
            }

            var selUuid = e.node.props.eventKey;
            var selNode = this.state.menuMap[selUuid];
            if( typeof(selNode) != 'undefined' ){
                this.props.onSelect(selNode);
            }
        }
	}

	onExpand = (expandedKeys, info) => {
        expandedKeys2 = expandedKeys;
	}

	preCrtNode = (data, recordSet) => {
        var node = {};
        node.key = data.uuid;
        node.pid = data.puuid;
        if( data.deptCode === '' || data.menuCode === data.menuTitle ){
            node.title = data.menuTitle;
        }
        else{
            node.title = data.menuTitle+'('+data.menuCode+')';
        }

        return node;
	}

	render(){
        if( this.state.rootNodes.length === 0 ){
            if( this.state.loading ){
                return (<Spin tip="正在努力加载数据..." style={{minHeight:'200px'}}>加载数据</Spin>);
            }
            else{
                return (<div>暂时没有数据</div>);
            }
        }

        var tree =
            <Tree
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
            </Tree>;

        return (
            (this.state.loading) ?
                <Spin tip="正在努力加载数据..." style={{minHeight:'200px'}}>{tree}</Spin> :
                tree
            );
	}

}

export default MenuTree;
