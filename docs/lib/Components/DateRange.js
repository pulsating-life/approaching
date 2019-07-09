'use strict';

import React from 'react';
var Reflux = require('reflux');
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';

var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');


class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onChange = (date, dateString) => {
        var onChange = this.props.onChange;
        if (!onChange) {
            return;
        }

        var format = this.props.format;
        if (!format) {
            format = Common.dateFormat;
        }

        var id = this.props.id;
        onChange(id, format, date[0], dateString[0]);

        var id2 = this.props.id2;
        onChange(id2, format, date[1], dateString[1]);
    }

    render() {
        const {
            id2,
            value2,
            value,
            format,
            style,
            onChange,
            ...attributes,
        } = this.props;

        var format2 = format ? format : Common.dateFormat;

        // 样式
        var style2 = {};
        if (style) {
            Utils.copyValue(style, style2);
        }

        style2.width = '100%';

        // 值
        var v1, v2;
        if (value && value.length === 8) {
            v1 = moment(value, 'YYYYMMDD')
        }

        if (value2 && value2.length === 8) {
            v2 = moment(value2, 'YYYYMMDD')
        }
        
        var dt = [v1, v2];

        return (
            <RangePicker value={dt} format={format2} onChange={this.onChange} style={style2} {...attributes} />
        );
    }
}

export default DateRange;
