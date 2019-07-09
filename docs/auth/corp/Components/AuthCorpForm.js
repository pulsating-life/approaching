'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const TextArea = Input.TextArea;
const FormItem = Form.Item;

var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');
import FormUtil from '@/lib/Components/FormUtil';
import DictSelect from '@/lib/Components/DictSelect';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: '公司信息', cols: ['corpCode','corpName','corpType','corpLoc'], func: 'getAuthCorpColumns' }
	],
	
	initAuthCorpForm(data){
		data.corpCode = '';
		data.corpName = '';
		data.corpType = '';
		data.corpLoc = '';
		data.corpDesc = '';
	},
	getAuthCorpFormRule: function (form, attrList)
	{
		var attrMap = FormUtil.getRuleAttrMap(attrList);
		var rules = [
			{ id: 'corpCode', desc: '公司简称', required: true, max: '64', ...attrMap.corpCode },
			{ id: 'corpName', desc: '公司名称', max: '128', ...attrMap.corpName },
			{ id: 'corpType', desc: '公司类型', max: '1', ...attrMap.corpType },
			{ id: 'corpLoc', desc: '办公地址', max: '256', ...attrMap.corpLoc },
			{ id: 'corpDesc', desc: '公司描述', max: '512', ...attrMap.corpDesc }
		];

		return rules;
	},
	
	getAuthCorpForm: function (form, data, attrList, labelWidths, layout) {
		var labelList = [
			{ key: 'corpCode', label: '公司简称', required: true },
			{ key: 'corpName', label: '公司名称' },
			{ key: 'corpType', label: '公司类型', appName: '用户管理', optName: '公司类型' },
			{ key: 'corpLoc', label: '办公地址' },
			{ key: 'corpDesc', label: '公司描述' }
		];
		
		var attr = FormUtil.getParam(form, attrList, labelList);
		var {attrMap, labelMap, hintMap} = attr;
		
		if (!layout) layout = this.layout;
		var layoutItem = 'form-item-' + layout;
		if (!labelWidths) labelWidths = [16, 8, 6, 4];
		var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		
		var hints = form.state.hints;
		var items = [
			<FormItem {...itemLayouts[3] } {...labelMap.corpCode} colon={true} help={hints.corpCodeHint} validateStatus={hints.corpCodeStatus}  className={layoutItem} >
				<Input type='text' id='corpCode' value={data.corpCode} onChange={form.handleOnChange}    spellCheck={false} {...attrMap.corpCode}/>
				{(hints.corpCodeHint || !hintMap.corpCode) ? null : <div>hintMap.corpCode</div>}
			</FormItem >,
			<FormItem {...itemLayouts[3] } {...labelMap.corpName} colon={true} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}  className={layoutItem} >
				<Input type='text' id='corpName' value={data.corpName} onChange={form.handleOnChange}    spellCheck={false} {...attrMap.corpName}/>
				{(hints.corpNameHint || !hintMap.corpName) ? null : <div>hintMap.corpName</div>}
			</FormItem >,
			<FormItem {...itemLayouts[3]} {...labelMap.corpType} colon={true} help={hints.corpTypeHint} validateStatus={hints.corpTypeStatus}  className={layoutItem} >
				<DictSelect id='corpType'  value={data.corpType}  onSelect={form.handleOnSelected.bind(form, 'corpType')}    {...attrMap.corpType}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } {...labelMap.corpLoc} colon={true} help={hints.corpLocHint} validateStatus={hints.corpLocStatus}  className={layoutItem} >
				<Input type='text' id='corpLoc' value={data.corpLoc} onChange={form.handleOnChange}    spellCheck={false} {...attrMap.corpLoc}/>
				{(hints.corpLocHint || !hintMap.corpLoc) ? null : <div>hintMap.corpLoc</div>}
			</FormItem >,
			<FormItem {...itemLayouts[3]} {...labelMap.corpDesc} colon={true} help={hints.corpDescHint} validateStatus={hints.corpDescStatus}  className={layoutItem} >
				<TextArea id='corpDesc' value={data.corpDesc} onChange={form.handleOnChange} style={{ height: '100px' }}    spellCheck={false} {...attrMap.corpDesc}/>
				{(hints.corpDescHint || !hintMap.corpDesc) ? null : <div>hintMap.corpDesc</div>}
			</FormItem>
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

	getAuthCorpColumns: function (form) {
		var columns = [
			{
				title: '公司简称',
				dataIndex: 'corpCode',
				key: 'corpCode',
				sorter: (a, b) => Common.strSort(a.corpCode, b.corpCode),
				width: 120
			},
			{
				title: '公司名称',
				dataIndex: 'corpName',
				key: 'corpName',
				sorter: (a, b) => Common.strSort(a.corpName, b.corpName),
				width: 180
			},
			{
				title: '公司类型',
				dataIndex: 'corpType',
				key: 'corpType',
				sorter: (a, b) => Common.strSort(a.corpType, b.corpType),
				width: 120,
				render: (text, record) => (Utils.getOptionName('用户管理', '公司类型', text, 'auto', form))
			},
			{
				title: '办公地址',
				dataIndex: 'corpLoc',
				key: 'corpLoc',
				sorter: (a, b) => Common.strSort(a.corpLoc, b.corpLoc),
				width: 280
			}
		];

		return columns;
	}
};

