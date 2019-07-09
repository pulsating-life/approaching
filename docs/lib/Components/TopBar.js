'use strict';
/**
 *   Update by LiuMengYuan on 2018/8/15
 *   right-modal 用法
 *   1. 引入指针：let TopBarContext = require('@/lib/MainContext');
 *   2. 打开窗口：TopBarContext.topBar.showModal(title:str, modalContent:obj);
 *   3. 点击右上方X可关闭窗口，若需手动关闭：TopBarContext.topBar.handleCloseModal();
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon, Dropdown, Button } from 'antd';
const { Header, Content, Footer } = Layout;
import { PrismCode } from 'react-prism';
import LoginUtil from '../../login2/LoginUtil';

var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
var MainContext = require('../MainContext');

const propTypes = {
    children: PropTypes.node,
    navItems: PropTypes.array,
    activeNode: PropTypes.string,
    offsetLeft: PropTypes.string,
    home: PropTypes.string,
};

@withRouter
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeNode: null,
            menuFile: null,
            modalTitle: '',
            modalContent: null,
            modalToggle: false,
        };
    }

    componentDidMount() {
        MainContext.topBar = this;
    }

    componentWillUnmount() {
        MainContext.topBar = null;
    }

    showModal = (title, modalContent) => {
        this.state.modalTitle = typeof (title) === 'undefined' ? '' : title;
        this.state.modalContent = typeof (modalContent) === 'undefined' ? null : modalContent;
        this.setState({ modalToggle: true });
    }

    handleCloseModal = (e) => {
        this.setState({ modalToggle: false });
        if (typeof (e) !== 'undefined') {
            e.stopPropagation();
        }
    }

    goHome = (e) => {
        if (MainContext.onGoBack) {
            MainContext.onGoBack();
        }

        var url = MainContext.homePage;
        if (!url) {
            url = this.props.home;
            if (!url) {
                url = Utils.indexPage;
            }
        }

        // 不检查主页面的菜单
        Utils.setActiveMenuName('');

        // alert('goback', url);
        if (url.charAt(0) === '@') {
            url = url.substr(1);
            Utils.showPage(url);
        }
        else if (url.indexOf('.html') > 0) {
            Utils.showPage(url);
        }
        else {
            this.props.history.push({
                pathname: url
            });
        }
    }
    onClickHome = () => {
        this.goHome();
    }
    handleMenuClick = (e) => {
        Common.activePage = null;

        if (e.key === '1') {
            // 改密
            this.props.history.push({
                pathname: '/main/passwd/'
            });
        }
        else if (e.key === '2') {
            // 签退
            window.sessionStorage.removeItem('loginData');
            Utils.showPage('/index.html');
        }
        else if (e.key === '103') {
            // 菜单文件
            var str = JSON.stringify(this.props.navItems, null, 4);
            this.setState({ menuFile: str });
        }
        else {
            console.log('handleMenuClick', e);
        }
    }
    handleClick = (e) => {
        this.setState({ menuFile: null, activeNode: e.key });

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

    // 查找菜单节点
    findMenuNode = (menus, href) => {
        var len = menus.length;
        for (var i = 0; i < len; i++) {
            var node = menus[i];
            var path = node.to;
            if (path && path.startsWith(href)) {
                return node;
            }

            // 子节点
            var childNodes = node.nextMenus;
            if (!childNodes) {
                childNodes = node.childItems;
            }

            if (childNodes && childNodes.length > 0) {
                node = this.findMenuNode(childNodes, href);
                if (node) {
                    return node;
                }
            }
        }
    }

    render() {
        if (window.loginData === null || typeof (window.loginData) === 'undefined') {
            if (!LoginUtil.loadContext()) {
                this.props.history.push({
                    pathname: '/index.html'
                });

                return null;
            }
        }

        if (!Common.isShowMenu) {
            var href = window.location.href;
            var pos = href.indexOf('?');
            if (pos > 0) {
                href = href.substr(0, pos);
            }

            pos = href.indexOf('/', 10);
            if (pos > 0) {
                href = href.substr(pos);
            }

            // 会自动添加 /safe
            if (href.startsWith('/safe')) {
                href = href.substr(5);
            }

            var node = this.findMenuNode(this.props.navItems, href);
            // console.log('this.props.navItems', this.props.navItems, window.location.href, node)
            if (node) {
                return <div style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <Helmet
                        titleTemplate="隆正信息 - %s"
                        title="管理软件"
                        defaultTitle="管理软件"
                        meta={[{ 'name': '隆正信息' }]}
                    />
                    <Header style={{ margin: '-36px 0 0', height: '36px', lineHeight: '36px', paddingLeft: '36px' }}>
                        <div style={{ float: 'left', color: '#EFEFEF' }}>{node.name}</div>
                    </Header>
                    <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
                        {this.props.children}
                    </Content>
                </div>;
            }

            return <div style={{ width: '100%', height: '100%', padding: '0 0' }}>
                <Helmet
                    titleTemplate="隆正信息 - %s"
                    title="管理软件"
                    defaultTitle="管理软件"
                    meta={[{ 'name': '隆正信息' }]}
                />
                <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
                    {this.props.children}
                </Content>
            </div>;
        }

        var menuStyle = { height: '36px', width: '120px', fontSize: '14px' };
        const menu = (
            Common.resMode ?
                <Menu onClick={this.handleMenuClick}>
                    <Menu.Item key="1" style={menuStyle}><Icon type="unlock" style={{ marginLeft: '8px' }} /><span>修改密码</span></Menu.Item>
                    <Menu.Item key="2" style={menuStyle}><Icon type="home" /><span style={{ marginLeft: '8px' }}>用户签退</span></Menu.Item>
                </Menu> :
                <Menu onClick={this.handleMenuClick}>
                    <Menu.Item key="1" style={menuStyle}><Icon type="unlock" /><span style={{ marginLeft: '8px' }}>修改密码</span></Menu.Item>
                    <Menu.Item key="2" style={menuStyle}><Icon type="home" /><span style={{ marginLeft: '8px' }}>用户签退</span></Menu.Item>
                    <Menu.Item key="103" style={menuStyle}><Icon type="bars" /><span style={{ marginLeft: '8px' }}>菜单文件</span></Menu.Item>
                </Menu>
        );

        var offsetLeft = this.props.offsetLeft;
        if (offsetLeft === null || typeof (offsetLeft) === 'undefined') {
            offsetLeft = '160px';
        }

        var body = null;
        if (this.state.menuFile) {
            var menuFile = this.state.menuFile;
            var blob = new Blob([menuFile]);

            body = <div style={{ width: '70%', height: '100%', margin: '0 auto', padding: '40px 0', overflow: 'hidden' }}>
                <div style={{ fontSize: '12pt', padding: '0 0 12px 0' }}>菜单文件，生成的文件保存到[build/auth]目录下，用于菜单项的授权</div>
                <div style={{ height: '80%', overflowY: 'auto' }}>
                    <pre style={{ backgroundColor: '#3f3f3f' }}>
                        <PrismCode className="language-jsx">
                            {this.state.menuFile}
                        </PrismCode>
                    </pre>
                </div>
                <div style={{ padding: '20px 0 0 0' }}><a className='load-field' download={Utils.selModName + '.json'} href={window.URL.createObjectURL(blob)}>下载菜单文件</a></div>
            </div>;
        }
        else {
            body = this.props.children;
        }

        var ext = false;
        var selNode = this.state.activeNode;
        if (selNode) {
            var items = this.props.navItems;
            for (var i = items.length - 1; i >= 0; i--) {
                if (items[i].to === selNode) {
                    ext = true;
                    break;
                }
            }
        }

        if (!ext) {
            this.state.activeNode = this.props.activeNode;
        }

        var logoFile = Common.logoIcon;
        if (window.rootPath) {
            logoFile = window.rootPath + logoFile;
        }

        var aNode = [this.state.activeNode];
        return <div style={{ width: '100%', height: '100%', padding: '40px 0 0' }}>
            <Helmet
                titleTemplate="隆正信息 - %s"
                title="管理软件"
                defaultTitle="管理软件"
                meta={[{ 'name': '隆正信息' }]}
                />
            <Header style={{ margin: '-40px 0 0', height: '40px', lineHeight: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
                <div style={{ float: 'left', color: '#EFEFEF', cursor: 'pointer', fontSize: '11pt' }} onClick={this.onClickHome}><img src={logoFile} style={{ width: '64px', paddingRight: '8px' }} />{Common.logoName}</div>
                <Menu theme="dark" mode="horizontal" selectedKeys={aNode} onClick={this.handleClick}
                    style={{ lineHeight: '40px', float: 'left', paddingLeft: offsetLeft }}
                    >
                    {
                        this.props.navItems.map((item, i) => {
                            if (item.visible === false) {
                                return null;
                            }

                            // 检查权限
                            var itemColor = 'hsla(0, 0%, 100%, .67)';
                            var itemPriv = Utils.checkMenuPriv(item.to);
                            if (itemPriv === 2) {
                                // return null ;
                                itemColor = 'red';
                            } else if (itemPriv === 0) {
                                return null;
                            }

                            var iconType = 'file';
                            if (typeof (item.icon) != 'undefined') {
                                iconType = item.icon;
                            }

                            return <Menu.Item key={item.to}>
                                <span>
                                    <Icon type={iconType} />
                                    <span className={itemColor === 'red' ? 'errorHint' : 'nav-text'}>{item.name}</span>
                                </span>
                            </Menu.Item>;
                        })
                    }
                </Menu>
                <div style={{ float: 'right', color: '#EFEFEF' }}>
                    <Icon type="home" onClick={this.goHome} title='返回主页' style={{ padding: '0 8px 0 0', cursor: 'pointer', fontSize: '16px' }} />
                    <Dropdown overlay={menu}>
                        <Icon type="setting" style={{ cursor: 'pointer', fontSize: '16px' }} />
                    </Dropdown>
                </div>
            </Header>
            <Content style={{ width: '100%', height: '100%', padding: '0 0px' }}>
                {body}
            </Content>
            <div className={this.state.modalToggle ? 'right-modal-bg' : 'right-modal-bg right-modal-bg-close'}></div>
            <div className={this.state.modalToggle ? 'trans right-modal-body' : 'trans right-modal-body right-modal-body-close'}>
                <div className='right-modal-header'>
                    <div className='title'>{this.state.modalTitle}</div>
                    <div className='close-btn' onClick={this.handleCloseModal}><Icon type="close" /></div>
                </div>
                {this.state.modalContent}
            </div>
        </div>;
    }
}

TopBar.propTypes = propTypes;
export default TopBar;
