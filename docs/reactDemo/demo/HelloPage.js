'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import {Button, Table, Icon, Input} from 'antd';

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');

class HelloPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    // 第一次加载
    componentDidMount (){
    }

    render () {
        return (
			<div style={{padding:'100px 100px'}}>
				这是第一个页面
			</div>
        );
    }
}

export default HelloPage;
