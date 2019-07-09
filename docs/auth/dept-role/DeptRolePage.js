'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');

import ServiceMsg from '../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Spin} from 'antd';
var Utils = require('../../public/script/utils');
 
class DeptRolePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            loading: false,
        }
	}

    // 第一次加载
	componentDidMount() {

	}
	componentWillUnmount() {
	}

	render(){
        return (
	      <div className='grid-page'>
	        open soon ... ...
	      </div>
        );
	}
}

export default DeptRolePage;