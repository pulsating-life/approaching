'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
var RouteUtil = require('../../public/script/route');
var Common = require('../../public/script/common');

import UManLayout from './UManLayout';
import Home from '../../login2/LoginInnPage';
import NotFound from '../../lib/NotFound/index2.js';

// 页面
import PasswdPage from '../../main/passwd/PasswdPage';
import LogoutPage from '../../main/logout/LogoutPage';

import CertPage from '../cert/CertPage';
import DeptPage from '../dept/DeptPage';
import UserPage from '../user/UserPage';
import SuperUserPage from '../superUser/SuperUserPage';
import CorpAppPage from '../corp-app/CorpAppPage';
import UserGroupPage from '../userGroup/UserGroupPage';

import 'antd-less';

Common.getHomePage = function () {
    return {
        appGroup: 'HR',
        appName: '用户管理',
        home: Common.uManHome
    };
}

const AppRoute = ({ component: Component, menu: Menu, ...rest }) => (
    Menu ?
        <Route {...rest} render={props => (
            <UManLayout {...props}>
                <Menu {...props}>
                    <Component {...props} />
                </Menu>
            </UManLayout>
        )} />
        :
        <Route {...rest} render={props => (
            <UManLayout {...props}>
                <Component {...props} />
            </UManLayout>
        )} />
)

var routes = [
    { path: "/main/passwd/", component: PasswdPage },
    { path: "/main/logout/", component: LogoutPage },

    { path: "/uman/CertPage/", component: CertPage, menu: require('./uman_menu') },
    { path: "/uman/DeptPage/", component: DeptPage, menu: require('./uman_menu') },
    { path: "/uman/UserPage/", component: UserPage, menu: require('./uman_menu') },
    { path: "/uman/SuperUserPage/", component: SuperUserPage, menu: require('./uman_menu') },
    { path: "/uman/CorpAppPage/", component: CorpAppPage, menu: require('./uman_menu') },
    { path: "/uman/UserGroupPage/", component: UserGroupPage, menu: require('./uman_menu') }
];

RouteUtil.formatRoutes(routes);
var pages = routes.map((node, i) => {
    return <AppRoute exact {...node}/>;
});

const outlet = document.getElementById('app');
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/uman.html" component={Home} exact />

            {pages}
            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>,
    outlet
);



