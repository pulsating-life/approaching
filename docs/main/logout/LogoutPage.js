'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Button, Table, Icon, Modal, Spin } from 'antd';
var Utils = require('../../public/script/utils');

class LogoutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    // 第一次加载
    componentDidMount() {
    }

    render() {
        return (
            <div className='grid-page'>
                用户签退
	      </div>
        );
    }
}

export default LogoutPage;
