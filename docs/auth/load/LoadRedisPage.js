'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');

import { Button } from 'antd';
var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');


class LoadRedisPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

    // 第一次加载
	componentDidMount() {

	}
	componentWillUnmount() {
	}

	onLoadRedis = () => {
        var url = Utils.authUrl + 'sys/init';

        var self = this;
        Utils.doCreateService(url, {}).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                Common.infoMsg('权限已启用');
            }
            else {
                Common.errMsg("处理错误[" + result.errCode + "][" + result.errDesc + "]");
            }
        }, function (value) {
            Common.errMsg("调用服务错误");
        });
	}
	render(){
        return (
            <div className='grid-page' style={{ padding: '100px 0 0 100px' }}>
                <Button key="btnLoadRedis" type="primary" size="large" onClick={this.onLoadRedis}>更新权限数据</Button>
            </div>
        );
	}
}

export default LoadRedisPage;
