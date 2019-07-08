'use strict';

import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');
var ReactDemoMenu = require('./main/menus')


class ReactDemoLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
	      navItems: ReactDemoMenu.menus().moduleMenus
	    }
	}

	render() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.reactDemoHome} home='@/index.html?from=reactDemo' children={this.props.children}/>
	}
}

export default ReactDemoLayout;
