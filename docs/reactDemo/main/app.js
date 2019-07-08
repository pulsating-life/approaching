'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
var RouteUtil = require('../../public/script/route');
var Common = require('../../public/script/common');

import ReactDemoLayout from '../ReactDemoLayout';
import Home from '../../login2/LoginInnPage';
import NotFound from '../../lib/NotFound/index2.js';

// 页面
import PasswdPage from '../../main/passwd/PasswdPage';
import LogoutPage from '../../main/logout/LogoutPage';

import HelloPage from '../demo/HelloPage';


import 'antd-less';

Common.getHomePage = function () {
    return {
        appGroup: '应用组名称，权限检查使用，在app.json里替换',
        appName: '工程名称,在app.json里替换',
        home: Common.reactDemoHome
    };
}

const AppRoute = ({ component: Component, menu: Menu, ...rest }) => (
    Menu ?
        <Route {...rest} render={props => (
            <ReactDemoLayout {...props}>
                <Menu {...props}>
                    <Component {...props} />
                </Menu>
            </ReactDemoLayout>
        )} />
        :
        <Route {...rest} render={props => (
            <ReactDemoLayout {...props}>
                <Component {...props} />
            </ReactDemoLayout>
        )} />
)

var routes = [
    { path: "/main/passwd/", component: PasswdPage },
    { path: "/main/logout/", component: LogoutPage },

    { path: "/reactDemo/demo/HelloPage/", component: HelloPage, menu: require('./demo_menu') }
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
            <Route path="/reactDemo.html" component={Home} exact />

            {pages}
            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>,
    outlet
);


