'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import LeftMenu from '../../lib/Components/LeftMenu';
var ReactDemoMenu = require('../main/menus');

const propTypes = {
    children: PropTypes.node
};

class DemoMenuIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navItems: ReactDemoMenu.menus().demoMenus
        }
    }

    render() {
        var pathname = this.props.location.pathname;
        if (!pathname) {
            pathname = "/reactDemo/demo/HelloPage/";
        }

        return (
            <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
        );
    }
}

DemoMenuIndex.propTypes = propTypes;
module.exports = DemoMenuIndex;
