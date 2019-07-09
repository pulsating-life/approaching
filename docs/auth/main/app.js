'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
var RouteUtil = require('../../public/script/route');
var Common = require('../../public/script/common');

import ConfLayout from '../ConfLayout';
import Home from '../../login2/LoginInnPage';
import NotFound from '../../lib/NotFound/index2.js';

// 页面
import PasswdPage from '../../main/passwd/PasswdPage';
import LogoutPage from '../../main/logout/LogoutPage';

import CampusPage from '../campus/CampusPage';
import CorpPage from '../corp/CorpPage';
import SysUserPage from '../user/SysUserPage';

import AppPage from '../app/AppPage';
import AppGroupPage from '../appGroup/AppGroupPage';
import GroupPage from '../group/GroupPage';
import FntAppPage from '../fnt-app/app/FntAppPage';
import LoadRedisPage from '../load/LoadRedisPage';

import MatchPage from '../app/MatchPage';
import ModulePage from '../module/ModulePage';
import ResPage from '../res/ResPage';
import TxnPage from '../txn/TxnPage';
import FuncPage from '../func/FuncPage';
import RolePage from '../role/RolePage';
import RolesPage from '../roles/RolesPage';
import MenuPage from '../menu/MenuPage';

import ModelPage from '../../param/model/ModelPage';
import UiParamPage from '../../param/ui-param/UiParamPage';
import ConfTaskTablePage from '../../param/conf-task/ConfTaskTablePage';

import 'antd-less';

Common.getHomePage = function () {
    return {
        appGroup: 'MA',
        appName: '配置管理',
        home: Common.authHome
    };
}

const AppRoute = ({ component: Component, menu: Menu, ...rest }) => (
    Menu ?
        <Route {...rest} render={props => (
            <ConfLayout {...props}>
                <Menu {...props}>
                    <Component {...props} />
                </Menu>
            </ConfLayout>
        )} />
        :
        <Route {...rest} render={props => (
            <ConfLayout {...props}>
                <Component {...props} />
            </ConfLayout>
        )} />
)

var routes = [
    { path: "/main/passwd/", component: PasswdPage },
    { path: "/main/logout/", component: LogoutPage },

    { path: "/auth/CampusPage/", component: CampusPage },
    { path: "/auth/CorpPage/", component: CorpPage },
    { path: "/auth/SysUserPage/", component: SysUserPage },

    { path: "/auth/AppPage/", component: AppPage, menu: require('./app_menu') },
    { path: "/auth/AppGroupPage/", component: AppGroupPage, menu: require('./app_menu') },
    { path: "/auth/GroupPage/", component: GroupPage, menu: require('./app_menu') },
    { path: "/auth/FntAppPage/", component: FntAppPage, menu: require('./app_menu') },
    { path: "/auth/LoadRedisPage/", component: LoadRedisPage, menu: require('./app_menu') },

    { path: "/auth2/MatchPage/", component: MatchPage, menu: require('./auth_menu2') },
    { path: "/auth2/ModulePage/", component: ModulePage, menu: require('./auth_menu2') },
    { path: "/auth2/ResPage/", component: ResPage, menu: require('./auth_menu2') },
    { path: "/auth2/TxnPage/", component: TxnPage, menu: require('./auth_menu2') },
    { path: "/auth2/FuncPage/", component: FuncPage, menu: require('./auth_menu2') },
    { path: "/auth2/RolePage/", component: RolePage, menu: require('./auth_menu2') },
    { path: "/auth2/RolesPage/", component: RolesPage, menu: require('./auth_menu2') },
    { path: "/auth2/MenuPage/", component: MenuPage, menu: require('./auth_menu2') },

    { path: "/param/ModelPage/", component: ModelPage, menu: require('./param_menu') },
    { path: "/param/UiParamPage/", component: UiParamPage, menu: require('./param_menu') },
    { path: "/param/ConfTaskTablePage/", component: ConfTaskTablePage, menu: require('./param_menu') }
];

RouteUtil.formatRoutes(routes);
var pages = routes.map((node, i) => {
    return <AppRoute exact {...node} />;
});


const outlet = document.getElementById('app');
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/auth.html" component={Home} exact />

            {pages}
            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>,
    outlet
);


