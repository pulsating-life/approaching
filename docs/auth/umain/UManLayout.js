import React from 'react';
import TopBar from '../../lib/Components/TopBar';
var Common = require('../../public/script/common');
var umainMenu = require('./menus');

class UManLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	      navItems: umainMenu.menus().moduleMenus
	    }
	}

	render(){
        return <TopBar navItems={this.state.navItems} activeNode={Common.uManHome} home='@/index.html?from=uman' children={this.props.children}/>
	}
}

export default UManLayout;



