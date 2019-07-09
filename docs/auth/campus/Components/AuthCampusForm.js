'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const TextArea = Input.TextArea;
const FormItem = Form.Item;

var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');
import FormUtil from '@/lib/Components/FormUtil';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [

	],
	
	initAuthCampusForm(data){
		data.campusName = '';
		data.campusCode = '';
		data.campusLoc = '';
		data.campusDesc = '';
	},
	getAuthCampusFormRule: function (form, attrList)
	{
		var attrMap = FormUtil.getRuleAttrMap(attrList);
		var rules = [
			{ id: 'campusName', desc: '园区名称', required: true, max: '128', ...attrMap.campusName },
			{ id: 'campusCode', desc: '园区编号', max: '32', ...attrMap.campusCode },
			{ id: 'campusLoc', desc: '园区地址', max: '256', ...attrMap.campusLoc },
			{ id: 'campusDesc', desc: '园区描述', max: '512', ...attrMap.campusDesc }
		];

		return rules;
	},
	
	getAuthCampusForm: function (form, data, attrList, labelWidths, layout) {
		var labelList = [
			{ key: 'campusName', label: '园区名称', required: true },
			{ key: 'campusCode', label: '园区编号' },
			{ key: 'campusLoc', label: '园区地址' },
			{ key: 'campusDesc', label: '园区描述' }
		];
		
		var attr = FormUtil.getParam(form, attrList, labelList);
		var {attrMap, labelMap, hintMap} = attr;
		
		if (!layout) layout = this.layout;
		var layoutItem = 'form-item-' + layout;
		if (!labelWidths) labelWidths = [16, 8, 6, 4];
		var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		
		var hints = form.state.hints;
		var items = [
			<FormItem {...itemLayouts[3] } {...labelMap.campusName} colon={true} help={hints.campusNameHint} validateStatus={hints.campusNameStatus}  className={layoutItem} >
				<Input type='text' id='campusName' value={data.campusName} onChange={form.handleOnChange}    spellCheck={false} {...attrMap.campusName}/>
				{(hints.campusNameHint || !hintMap.campusName) ? null : <div>hintMap.campusName</div>}
			</FormItem >,
			<FormItem {...itemLayouts[3] } {...labelMap.campusCode} colon={true} help={hints.campusCodeHint} validateStatus={hints.campusCodeStatus}  className={layoutItem} >
				<Input type='text' id='campusCode' value={data.campusCode} onChange={form.handleOnChange}    spellCheck={false} {...attrMap.campusCode}/>
				{(hints.campusCodeHint || !hintMap.campusCode) ? null : <div>hintMap.campusCode</div>}
			</FormItem >,
			<FormItem {...itemLayouts[3] } {...labelMap.campusLoc} colon={true} help={hints.campusLocHint} validateStatus={hints.campusLocStatus}  className={layoutItem} >
				<Input type='text' id='campusLoc' value={data.campusLoc} onChange={form.handleOnChange}    spellCheck={false} {...attrMap.campusLoc}/>
				{(hints.campusLocHint || !hintMap.campusLoc) ? null : <div>hintMap.campusLoc</div>}
			</FormItem >,
			<FormItem {...itemLayouts[3]} {...labelMap.campusDesc} colon={true} help={hints.campusDescHint} validateStatus={hints.campusDescStatus}  className={layoutItem} >
				<TextArea id='campusDesc' value={data.campusDesc} onChange={form.handleOnChange} style={{ height: '100px' }}    spellCheck={false} {...attrMap.campusDesc}/>
				{(hints.campusDescHint || !hintMap.campusDesc) ? null : <div>hintMap.campusDesc</div>}
			</FormItem>
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},


};

