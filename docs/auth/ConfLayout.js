'use strict';

import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');
var AuthMenu = require('./main/menus')


class ConfLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navItems: AuthMenu.menus().moduleMenus
        }
    }

    render () {
        return <TopBar navItems={this.state.navItems} activeNode={Common.authHome} home='@/index.html?from=conf' children={this.props.children} />
    }
}

export default ConfLayout;



