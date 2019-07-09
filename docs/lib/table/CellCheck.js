'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');
import { Checkbox } from 'antd';

class CellCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentWillMount() {
    }
    handleChange = (e) => {
        const {
            record,
            name,
            checked,
            unChecked,
            onChange
        } = this.props;

        if (e.target.checked) {
            record[name] = checked.value;
        }
        else {
            record[name] = unChecked.value;
        }

        if (onChange) {
            onChange(record, name, record[name]);
        }

        this.setState({ loading: false });
    }

    render() {
        const {
            record,
            name,
            showLabel,
            showType,
            checked,
            unChecked,
            onChange,
            ...attributes
        } = this.props;

        var value = record[name];
        if (record.editable) {  // 编辑模式
            var isChecked = (value === checked.value);
            if (showLabel === true) {
                return <Checkbox onChange={this.handleChange} checked={isChecked} {...attributes}>checked.title</Checkbox>;
            }
            else {
                return <Checkbox onChange={this.handleChange} checked={isChecked} {...attributes}></Checkbox>;
            }
        }

        // 非编辑模式
        if (value === checked.value) {
            value = checked.title;
        }
        else if (value === unChecked.value) {
            value = unChecked.title;
        }

        return (
            <div>
                {value}
            </div>
        );
    }
}

export default CellCheck;
