'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import LeftMenu from '../../lib/Components/LeftMenu';
var AuthMenu = require('../main/menus');

const propTypes = {
    children: PropTypes.node
};

class AuthPageIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            navItems: AuthMenu.menus().appMenus
        }
	}

	render(){
        var pathname = this.props.location.pathname;
        if (!pathname) {
            pathname = "/auth/AppPage/";
        }

        return (
            <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
        );
	}
}

AuthPageIndex.propTypes = propTypes;
module.exports = AuthPageIndex;
