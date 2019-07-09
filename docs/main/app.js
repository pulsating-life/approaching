'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
var RouteUtil = require('../public/script/route');

import Home from '../login2/LoginPage2';
import NotFound from '../lib/NotFound/index2';
import MainLayout from './MainLayout';

// 菜单页面
import DeskPage from './desk/DeskPage';
import AppsPage from './apps/AppsPage';
import PasswdPage from './passwd/PasswdPage';
import LogoutPage from './logout/LogoutPage';

import 'antd-less';

const AppRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        <MainLayout {...props}>
            <Component {...props} />
        </MainLayout>
    )} />
)

var routes = [
    { path: "/main/DeskPage/", component : DeskPage },
    { path: "/main/AppsPage/", component : AppsPage },
    { path: "/main/passwd/", component : PasswdPage },
    { path: "/main/logout/", component : LogoutPage }
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
            <Route path="/index.html" component={Home} exact />
            <Route path="/electron.html" component={Home} exact />
            <Route path="/test.html" component={Home} exact />

            {pages}
            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>,
    outlet
);

