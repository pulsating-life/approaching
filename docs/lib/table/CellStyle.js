'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Utils = require('@/public/script/utils');
import { Icon } from 'antd';

class CellStyle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            container: null,
        };
    }

    componentWillMount() {
        this.setState();
    }

    render() {
        const {
            record,
            index,
            value,
            style,
            ...attributes
        } = this.props;

        var style2 = {};
        Utils.copyValue(style, style2);

        // 填充总个单元格
        var cellStyle = { height: '16px', lineHeight: '16px' };
        if (this.state.container) {
            var domCC = ReactDOM.findDOMNode(this.state.container);
            var cRect = domCC.parentNode.getBoundingClientRect();
            style2.height = cRect.height-2;
            // style2.lineHeight = cRect.height-2;
            style2.margin = '-10px -8px';

            cellStyle.height = style2.height;
            // cellStyle.lineHeight = style2.height;
            cellStyle.padding = '9px 8px';
        }
        else {
            style2.padding = '10px 8px';
            style2.margin = '-10px -8px';
        }

        return (
            <div style={style2} ref={(obj) => { this.state.container = obj; }}><div style={cellStyle}>{value}</div></div>
        );
    }
}

export default CellStyle;
