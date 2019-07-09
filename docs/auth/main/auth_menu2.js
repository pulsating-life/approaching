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
            navItems: AuthMenu.menus().appPrivMenu
        }
	}

	render(){
        return (
            <LeftMenu navItems={this.state.navItems} activeNode="/auth2/ModulePage/" children={this.props.children} />
        );
	}
}

AuthPageIndex.propTypes = propTypes;
module.exports = AuthPageIndex;
