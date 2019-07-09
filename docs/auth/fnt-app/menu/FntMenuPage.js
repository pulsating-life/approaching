'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');

import { Button, Table, Icon, Input, Modal } from 'antd';
const Search = Input.Search;
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

import ModListPage from '../mod/Components/ModListPage';
import FntMenuTablePage from './Components/FntMenuTablePage';
import FntMenuTablePage2 from './Components/FntMenuTablePage2';

var menuIndex = 1;
class FntMenuPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            loading: false,

            modUuid: '',
            modCode: '',
            menuMap: {},

            fntMod: {
                modUuid: '',
                modCode: '',
                menuList: [],     // 实际的菜单表
                menuMap: {},      // 菜单对照表
            },
        }
	}

	componentDidMount() {

        this.refs.modList.setActiveNode(this.props.modUuid)
        this.state.modUuid = this.props.modUuid;
        this.state.modCode = this.props.modCode;
        this.loadMenu();
	}
	componentWillUnmount() {
	}

	componentWillReceiveProps(nextProps){
        this.refs.modList.setActiveNode(nextProps.modUuid)
        this.state.modUuid = nextProps.modUuid;
        this.state.modCode = nextProps.modCode;
        this.loadMenu();
	}

	onSelectFntMod = (fntMod) => {
        this.state.modUuid = fntMod.uuid;
        this.state.modCode = fntMod.modCode;
        this.loadMenu();
	}

	loadMenu = () => {
        if (this.state.modUuid === this.state.fntMod.modUuid) {
            return;
        }

        this.state.fntMod.menuList = [];
        this.state.fntMod.menuMap = {};
        this.state.fntMod.modUuid = this.state.modUuid;
        this.state.fntMod.modCode = this.state.modCode;

        if (!this.state.modCode) {
            this.setState({ loading: false });
            return;
        }

        // 文件已经下载
        var menus = this.state.menuMap[this.state.modCode];
        if (menus) {
            this.state.fntMod.menuList = menus.menus;
            this.state.fntMod.menuMap = menus.menuMap;
            this.setState({ loading: false });
            return;
        }

        var self = this;
        this.setState({ loading: true });
        Utils.loadAuthMenu(this.state.modCode).then(function (result) {
            self.onLoadMenu(result);
        }, function (value) {
            self.setState({ loading: false });
            alert('下载[' + file + ']错误')
        });
	}
	onLoadMenu = (menuList) => {
        menuIndex = 1;
        var menus = [];
        var menuMap = {};

        this.loadAppMenu(menus, menuMap, menuList, null);
        this.state.fntMod.menuList = menus;
        this.state.fntMod.menuMap = menuMap;
        this.setState({ loading: false });
	}
	loadAppMenu = (menus, menuMap, menuNode, parentID) => {
        var len = menuNode.length;
        for (var i = 0; i < len; i++) {
            var node = menuNode[i];
            var path = node.path;
            if (!path) {
                path = node.to;
                if (!path) {
                    continue;
                }
            }

            // 生成节点
            var aNode = {};
            aNode.name = node.name;
            aNode.path = path;
            aNode.pid = parentID;
            aNode.id = menuIndex++;
            menus.push(aNode);
            menuMap[path] = aNode;

            // 子节点
            var childNodes = node.nextMenus;
            if (!childNodes) {
                childNodes = node.childItems;
            }

            if (childNodes && childNodes.length > 0) {
                aNode.children = [];
                this.loadAppMenu(aNode.children, menuMap, childNodes, aNode.id)
            }
        }
	}

	render(){
        var cs = Common.getGridMargin(this, 0);
        return (
            <div className='grid-page' style={{ padding: cs.padding }}>
                <div style={{ margin: cs.margin }}>
                    <ServiceMsg ref='mxgBox' svcList={['fnt-app-menu/retrieve', 'fnt-app-menu/remove', 'fnt_app_mod/retrieve']} />
                </div>
                <div style={{ height: '100%', paddingLeft: '4px' }}>
                    <ModListPage ref='modList' caption='请选择模块' width='200px' onSelectFntMod={this.onSelectFntMod}   >
                        {this.state.fntMod.menuList.length !== 0 ?
                            <FntMenuTablePage ref='menuPage' fntMod={this.state.fntMod}/> :
                            <FntMenuTablePage2 ref='menuPage' fntMod={this.state.fntMod}/>
                        }
                    </ModListPage>
                </div>
            </div>
        );
    }
}

export default FntMenuPage;
