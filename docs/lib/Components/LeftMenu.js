'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');

const propTypes = {
    children: PropTypes.node,
    navItems: PropTypes.array,
    activeNode: PropTypes.string
};

@withRouter
class LeftMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            mode: 'inline',
        };
    }

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    }

    handleClick = (e) => {
        var len = this.props.navItems.length;
        for (var i = 0; i < len; i++) {
            var item = this.props.navItems[i];
            if (item.to === e.key) {
                if (item.onClick) {
                    item.onClick();
                    return;
                }
            }
        }

        var url = e.key;
        var param = '';
        var pos = url.indexOf('?');
        if (pos > 0) {
            param = url.substring(1 + pos);
            url = url.substring(0, pos);
        }

        var pr = { fromDashboard: true };
        if (param !== '') {
            var values = param.split('&');
            values.map((str, i) => {
                pos = str.indexOf('=');
                if (pos > 0) {
                    var name = str.substring(0, pos);
                    var value = str.substring(1 + pos);
                    pr[name] = value;
                }
            });
        }

        // console.log('pr', pr);
        this.props.history.push({
            pathname: url,
            query: pr
        });
    }
    getMenuItem = (item) => {
        // 检查权限
        var itemColor = 'rgba(0,0,0,.65)';
        var itemPriv = Utils.checkMenuPriv(item.to);
        if (itemPriv === 2) {
            // return null ;
            itemColor = 'red';
        } else if (itemPriv === 0) {
            return null;
        }

        var iconType = 'file';
        if (item.icon) {
            iconType = item.icon;
        }

        return <Menu.Item key={item.to}>
            <span className={itemColor === 'red' ? 'errorHint' : 'nav-text'}>
                <Icon type={iconType} />
                <span>{item.name}</span>
            </span>
        </Menu.Item>;
    }
    getSubMenu = (item) => {
        // 检查权限
        var itemColor = 'rgba(0,0,0,.65)';
        var itemPriv = Utils.checkMenuPriv(item.to);
        if (itemPriv === 2) {
            // return null ;
            itemColor = 'red';
        } else if (itemPriv === 0) {
            return null;
        }

        var iconType = 'setting';
        if (item.icon) {
            iconType = item.icon;
        }

        var childNodes = [];
        item.childItems.map((o, i) => {
            if (!o.childItems) {
                var menuItem = this.getMenuItem(o);
                if (menuItem) {
                    childNodes.push(menuItem);
                }
            }
            else {
                var subMenu = this.getSubMenu(o);
                if (subMenu) {
                    childNodes.push(subMenu);
                }
            }
        });

        if (childNodes.length === 0) {
            return null;
        }

        return <SubMenu key={item.to} title={<span style={{ color: itemColor }}><Icon type={iconType} /><span>{item.name}</span></span>}>
            {childNodes}
        </SubMenu>;
    }

    render() {
        var openKeys = [];
        var aNode = this.props.activeNode;
        if (aNode) {
            this.props.navItems.map((item, i) => {
                if (item.childItems) {
                    item.childItems.map((o, i) => {
                        if (aNode === o.to) {
                            openKeys.push(item.to);
                        }
                    });
                }
            });
        }

        if (!Common.isShowMenu) {
            return (<div style={{ height: '100%', width: '100%', overflowX: 'hidden' }}>
                {this.props.children}
            </div>);
        }

        return (
            <Layout style={{ backgroundColor: '#fefefe', height: '100%' }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                    className='left-side'
                >
                    <Menu theme='light' mode={this.state.mode} defaultOpenKeys={openKeys} defaultSelectedKeys={[aNode]} onClick={this.handleClick} className='left-side'>
                        {
                            this.props.navItems.map((item, i) => {
                                if (item.visible === false) {
                                    return null;
                                }

                                if (!item.childItems) {
                                    return this.getMenuItem(item);
                                }
                                else {
                                    return this.getSubMenu(item);
                                }
                            })
                        }
                    </Menu>
                </Sider>
                <div style={{ height: '100%', width: '100%', overflowX: 'hidden' }}>
                    {this.props.children}
                </div>
            </Layout>
        );
    }
}

LeftMenu.propTypes = propTypes;
export default LeftMenu;
