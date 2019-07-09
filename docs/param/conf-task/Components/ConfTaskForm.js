'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import FormUtil from '../../../lib/Components/FormUtil';
import DictSwitch from '../../../lib/Components/DictSwitch';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: '定时器配置信息', cols: ['taskName','groupName','cron','queue','routingKey','taskStatus'], func: 'getConfTaskColumns' }
	],
	
	initConfTaskForm(data){
		data.taskName = '';
		data.groupName = '';
		data.cron = '';
		data.clazzName = '';
		data.queue = '';
		data.exchange = '';
		data.routingKey = '';
		data.taskStatus = '1';
	},

	getConfTaskFormRule: function (form, attrList)
	{
		var attrMap = {};
		if (attrList) {
			var count = attrList.length;
			for (var x = 0; x < count; x++) {
				var {
					name,
					...attrs
				} = attrList[x];

				if (attrs) attrMap[name] = attrs;
			}
		}

		var rules = [
			{ id: 'taskName', desc: '任务名称', required: true, max: '64', ...attrMap.taskName },
			{ id: 'groupName', desc: '组名称', required: true, max: '64', ...attrMap.groupName },
			{ id: 'cron', desc: '定时时间', required: true, max: '128', ...attrMap.cron },
			{ id: 'clazzName', desc: '类名称', max: '128', ...attrMap.clazzName },
			{ id: 'queue', desc: '队列名称', required: true, max: '128', ...attrMap.queue },
			{ id: 'exchange', desc: 'exchange', required: true, max: '128', ...attrMap.exchange },
			{ id: 'routingKey', desc: '路由键', required: true, max: '128', ...attrMap.routingKey },
			{ id: 'taskStatus', desc: '状态', max: '32', ...attrMap.taskStatus }
		];

		return rules;
	},
	
	getConfTaskForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6, 4];
		}
		
		var labelList = [
			{ key: 'taskName', label: '任务名称', required: true },
			{ key: 'groupName', label: '组名称', required: true },
			{ key: 'cron', label: '定时时间', required: true },
			{ key: 'clazzName', label: '类名称' },
			{ key: 'queue', label: '队列名称', required: true },
			{ key: 'exchange', label: 'exchange', required: true },
			{ key: 'routingKey', label: '路由键', required: true },
			{ key: 'taskStatus', label: '状态' }
		];
		
		var attr = FormUtil.getParam(form, attrList, labelList);
		var attrMap = attr.attrMap;
		var labelMap = attr.labelMap;

		if (!layout) {
			layout = this.layout;
		}

		var layoutItem = 'form-item-' + layout;
		var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		
		var hints = form.state.hints;
		var items = [
			<FormItem {...itemLayouts[1] } {...labelMap.taskName} colon={true} help={hints.taskNameHint} validateStatus={hints.taskNameStatus}  className={layoutItem} >
				<Input type='text' name='taskName' id='taskName' value={data.taskName} onChange={form.handleOnChange}    {...attrMap.taskName}/>
			</FormItem >,
			<FormItem {...itemLayouts[1] } {...labelMap.groupName} colon={true} help={hints.groupNameHint} validateStatus={hints.groupNameStatus}  className={layoutItem} >
				<Input type='text' name='groupName' id='groupName' value={data.groupName} onChange={form.handleOnChange}    {...attrMap.groupName}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } {...labelMap.cron} colon={true} help={hints.cronHint} validateStatus={hints.cronStatus}  className={layoutItem} >
				<Input type='text' name='cron' id='cron' value={data.cron} onChange={form.handleOnChange}    {...attrMap.cron}/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } {...labelMap.clazzName} colon={true} help={hints.clazzNameHint} validateStatus={hints.clazzNameStatus}  className={layoutItem} >
				<Input type='text' name='clazzName' id='clazzName' value={data.clazzName} onChange={form.handleOnChange}    {...attrMap.clazzName}/>
			</FormItem >,
			<FormItem {...itemLayouts[1] } {...labelMap.queue} colon={true} help={hints.queueHint} validateStatus={hints.queueStatus}  className={layoutItem} >
				<Input type='text' name='queue' id='queue' value={data.queue} onChange={form.handleOnChange}    {...attrMap.queue}/>
			</FormItem >,
			<FormItem {...itemLayouts[1] } {...labelMap.exchange} colon={true} help={hints.exchangeHint} validateStatus={hints.exchangeStatus}  className={layoutItem} >
				<Input type='text' name='exchange' id='exchange' value={data.exchange} onChange={form.handleOnChange}    {...attrMap.exchange}/>
			</FormItem >,
			<FormItem {...itemLayouts[1] } {...labelMap.routingKey} colon={true} help={hints.routingKeyHint} validateStatus={hints.routingKeyStatus}  className={layoutItem} >
				<Input type='text' name='routingKey' id='routingKey' value={data.routingKey} onChange={form.handleOnChange}    {...attrMap.routingKey}/>
			</FormItem >,
			<FormItem {...itemLayouts[1]} {...labelMap.taskStatus} colon={true} help={hints.taskStatusHint} validateStatus={hints.taskStatusStatus}  className={layoutItem} >
				<DictSwitch name='taskStatus' id='taskStatus' value={data.taskStatus} checked={{value:'1', title:'启用'}} unChecked={{value:'0', title:'禁止'}} onChange={form.handleOnSelected}    {...attrMap.taskStatus}/>
			</FormItem>

		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

	getConfTaskColumns: function (form) {
		var columns = [
			{
				title: '任务名称',
				dataIndex: 'taskName',
				key: 'taskName',
				width: 120
			},
			{
				title: '组名称',
				dataIndex: 'groupName',
				key: 'groupName',
				width: 120
			},
			{
				title: '定时时间',
				dataIndex: 'cron',
				key: 'cron',
				width: 240
			},
			{
				title: '队列名称',
				dataIndex: 'queue',
				key: 'queue',
				width: 140
			},
			{
				title: '路由键',
				dataIndex: 'routingKey',
				key: 'routingKey',
				width: 140
			},
			{
				title: '状态',
				dataIndex: 'taskStatus',
				key: 'taskStatus',
				width: 90,
				render: (text, record) => (Utils.getOptionName('参数管理', '定时器状态', text, true, form))
			}
		];

		return columns;
	}
};

