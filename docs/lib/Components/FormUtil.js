﻿'use strict';

import React from 'react';
import { Row, Col } from 'antd';

export default class FormUtil {
    static getItemLayout = (layout, labelWidths) => {
        return [
            {
                itemWidth: 1,
                labelCol: ((layout == 'vertical') ? null : { span: labelWidths[0] }),
                wrapperCol: ((layout == 'vertical') ? null : { span: 24 - labelWidths[0] }),
            },
            {
                itemWidth: 2,
                labelCol: ((layout == 'vertical') ? null : { span: labelWidths[1] }),
                wrapperCol: ((layout == 'vertical') ? null : { span: 24 - labelWidths[1] }),
            },
            {
                itemWidth: 3,
                labelCol: ((layout == 'vertical') ? null : { span: labelWidths[2] }),
                wrapperCol: ((layout == 'vertical') ? null : { span: 24 - labelWidths[2] }),
            },
            {
                itemWidth: 4,
                labelCol: ((layout == 'vertical') ? null : { span: labelWidths[3] }),
                wrapperCol: ((layout == 'vertical') ? null : { span: 24 - labelWidths[3] }),
            },
            {
                itemWidth: 1,
                labelCol: null,
                wrapperCol: null,
            },
            {
                itemWidth: 2,
                labelCol: null,
                wrapperCol: null,
            },
            {
                itemWidth: 3,
                labelCol: null,
                wrapperCol: null,
            },
            {
                itemWidth: 4,
                labelCol: null,
                wrapperCol: null,
            }
        ];
    }
    static getRuleAttrMap = (attrList) => {
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

        return attrMap;
    }
    static getParam = (form, attrList, labelList) => {
        var attrMap = {};
        var showMap = {};
        var childMap = {};
        var objMap = {};
        var labelMap = {};
        var hintMap = {};
        form.state.checkMap = {};

        if (labelList) {
            var count = labelList.length;
            for (var x = 0; x < count; x++) {
                var { appName, optName, ...node } = labelList[x];
                labelMap[node.key] = node;
            }
        }

        if (attrList) {
            var count = attrList.length;
            for (var x = 0; x < count; x++) {
                var {
					name,
                    visible,
                    label,
                    required,
                    check,
                    hint,
                    children,
                    object,
                    ...attrs
				} = attrList[x];

                if (visible) showMap[name] = visible;
                if (check) form.state.checkMap[name] = check;
                if (children) childMap[name] = children;
                if (object) objMap[name] = object;
                if (attrs) attrMap[name] = attrs;
                if (hint) hintMap[name] = hint;

                if (label || required) {
                    var node = labelMap[name];
                    if (node) {
                        if (label) node.label = label;
                        if (required) node.required = required;
                    }
                }
            }
        }

        // 字典
        if (labelList) {
            var count = labelList.length;
            for (var x = 0; x < count; x++) {
                var node = labelList[x];
                var attrs = attrMap[node.key];
                if (!attrs) {
                    attrs = {};
                    attrMap[node.key] = attrs;
                }

                attrs.name = node.key;

                // 字典
                if (node.optName && !attrs.optName) {
                    attrs.optName = node.optName;
                    attrs.appName = node.appName;
                }

                if (node.required) {
                    attrs.required = node.required;
                }
            }
        }

        if (!form.state.hints) {
            form.state.hints = {};
        }

        return { attrMap: attrMap, showMap: showMap, childMap: childMap, objMap: objMap, labelMap: labelMap, hintMap: hintMap };
    }
    static appendObjects = (showList, line, colWidth) => {
        if (line.length === 0) {
            return;
        }

        var list = [];

        var key = null;
        var len = line.length;
        for (var i = 0; i < len; i++) {
            var field = line[i];
            var w = field.props.itemWidth;
            w = colWidth[w - 1];
            list.push(<Col span={w}>{field}</Col>);

            if (!key) {
                key = field.key;
            }
        }

        if (key) {
            showList.push(<Row key={key}>{list}</Row>);
        }
        else {
            showList.push(<Row>{list}</Row>);
        }
    }
    static adjuestForm = (items, showMap, colWidth) => {
        // 隐藏对象，调整格式
        var lineWidth = 0;
        var line = [];
        var showList = [];

        var cols = colWidth.length;
        var len = items.length;
        for (var i = 0; i < len; i++) {
            var field = items[i];
            if (field.key) {
                var id = field.key;
                var attr = showMap[id];
                if (attr === 'hidden' || attr === false) {
                    continue;
                }
            }

            var itemWidth = field.props.itemWidth;
            var newLine = field.props.newLine;

            // 计算行
            if (itemWidth >= cols || newLine) {
                FormUtil.appendObjects(showList, line, colWidth);
                line = [];
                lineWidth = 0;

                if (itemWidth >= cols) {
                    showList.push(field);
                }
                else {
                    lineWidth = itemWidth;
                    line.push(field);
                }
            }
            else {
                if (lineWidth + itemWidth > cols) {
                    FormUtil.appendObjects(showList, line, colWidth);
                    line = [];
                    lineWidth = itemWidth;
                    line.push(field);
                }
                else if (lineWidth + itemWidth == cols) {
                    line.push(field);
                    FormUtil.appendObjects(showList, line, colWidth);
                    line = [];
                    lineWidth = 0;
                }
                else {
                    line.push(field);
                    lineWidth += itemWidth;
                }
            }
        }

        // 最后一行
        FormUtil.appendObjects(showList, line, colWidth);
        return showList;
    }
    static getTableConf = (tableName) => {
        var conf = {};
        var str = window.localStorage[tableName + 'Conf'];
        if (str) {
            conf = JSON.parse(str);
        }

        /*if (!conf.size) {
            conf.size = 'middle';
        }*/

        if (conf.page !== false) {
            conf.page = true;
        }

        if (conf.wrap !== true) {
            conf.wrap = false;
        }

        if (conf.showLine !== true) {
            conf.showLine = false;
        }

        if (!conf.pageRow) {
            conf.pageRow = '10';
        }

        return conf;
    }
    static saveTableConf = (tableName, conf) => {
        window.localStorage[tableName + 'Conf'] = JSON.stringify(conf);
    }
}



