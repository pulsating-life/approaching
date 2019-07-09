'use strict';

import React from 'react';
import TopBar from '../lib/Components/TopBar';

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navItems: [
                {
                    name: '工作台',
                    to: '/main/DeskPage/',
                    icon: 'home'
                },
                {
                    name: '应用',
                    to: '/main/AppsPage/',
                    icon: 'appstore-o'
                },
            ]
        }
    }

    render() {
        var pathname = this.props.location.pathname;
        if (!pathname) {
            pathname = Utils.indexPage;
        }

        return <TopBar navItems={this.state.navItems} activeNode={pathname} offsetLeft='300px' children={this.props.children} />
    }
}

export default MainLayout;


