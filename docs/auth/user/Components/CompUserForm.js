'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');
import FormUtil from '@/lib/Components/FormUtil';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: '系统用户', cols: ['userName','perName','userCode','userTitle','userGroup','userType'], func: 'getSysCompUserColumns' },
		{ name: '用户信息', cols: ['userName','perName','userCode','userTitle','userGroup','userType'], func: 'getCompUserColumns' }
	],
	

	getSysCompUserColumns: function (form) {
		var columns = [
			{
				title: '用户名',
				dataIndex: 'userName',
				key: 'userName',
				sorter: (a, b) => Common.strSort(a.userName, b.userName),
				width: 100
			},
			{
				title: '用户姓名',
				dataIndex: 'perName',
				key: 'perName',
				sorter: (a, b) => Common.strSort(a.perName, b.perName),
				width: 100
			},
			{
				title: '员工编号',
				dataIndex: 'userCode',
				key: 'userCode',
				sorter: (a, b) => Common.strSort(a.userCode, b.userCode),
				width: 100
			},
			{
				title: '职务',
				dataIndex: 'userTitle',
				key: 'userTitle',
				sorter: (a, b) => Common.strSort(a.userTitle, b.userTitle),
				width: 100
			},
			{
				title: '用户组',
				dataIndex: 'userGroup',
				key: 'userGroup',
				sorter: (a, b) => Common.strSort(a.userGroup, b.userGroup),
				width: 200
			},
			{
				title: '用户类型',
				dataIndex: 'userType',
				key: 'userType',
				sorter: (a, b) => Common.strSort(a.userType, b.userType),
				width: 90,
				render: (text, record) => (Utils.getOptionName('用户管理', '用户类型', text, 'auto', form))
			}
		];

		return columns;
	},

	getCompUserColumns: function (form) {
		var columns = [
			{
				title: '用户名',
				dataIndex: 'userName',
				key: 'userName',
				sorter: (a, b) => Common.strSort(a.userName, b.userName),
				width: 100
			},
			{
				title: '用户姓名',
				dataIndex: 'perName',
				key: 'perName',
				sorter: (a, b) => Common.strSort(a.perName, b.perName),
				width: 100
			},
			{
				title: '员工编号',
				dataIndex: 'userCode',
				key: 'userCode',
				sorter: (a, b) => Common.strSort(a.userCode, b.userCode),
				width: 100
			},
			{
				title: '职务',
				dataIndex: 'userTitle',
				key: 'userTitle',
				sorter: (a, b) => Common.strSort(a.userTitle, b.userTitle),
				width: 100
			},
			{
				title: '用户组',
				dataIndex: 'userGroup',
				key: 'userGroup',
				sorter: (a, b) => Common.strSort(a.userGroup, b.userGroup),
				width: 200
			},
			{
				title: '用户类型',
				dataIndex: 'userType',
				key: 'userType',
				sorter: (a, b) => Common.strSort(a.userType, b.userType),
				width: 90,
				render: (text, record) => (Utils.getOptionName('用户管理', '用户类型', text, 'auto', form))
			}
		];

		return columns;
	},

    // 用户信息
    userFields: [
        { id: 'A', name: 'idType', title: '证件类型', opts: '#用户管理.身份类型' },
        { id: 'B', name: 'idCode', title: '证件编号' },
        { id: 'C', name: 'userName', title: '用户名' },
        { id: 'D', name: 'perName', title: '姓名' },
        { id: 'E', name: 'userCode', title: '员工编号' },
        { id: 'F', name: 'jobTitle', title: '职位' },
        { id: 'G', name: 'userType', title: '用户类型', opts: '#用户管理.用户类型' },
        { id: 'H', name: 'phoneno', title: '电话' },
        { id: 'I', name: 'email', title: '电子邮箱' },
        { id: 'J', name: 'passwd', title: '密码' }
    ]
};

