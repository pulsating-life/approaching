'use strict';

import React from 'react';
var Utils = require('../../public/script/utils');
import { Switch } from 'antd';

class CellSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    onSwitchChange = (data) => {
        const {
            record,
            name,
            checked,
            unChecked,
            onChange,
        } = this.props;

        record[name] = data ? checked.value : unChecked.value;

        if (onChange) {
            onChange(record, name, record[name]);
        }

        this.setState({ loading: false });
    }
    render() {
        const {
            record,
            name,
            checked,
            unChecked,
            onChange,
            ...attributes
        } = this.props;

        var value = record[name];
        if (record.editable) {  // 编辑模式
            var data = (checked.value === value) ? true : false;
            return <Switch id={name} checked={data} checkedChildren={checked.title} unCheckedChildren={unChecked.title} onChange={this.onSwitchChange} {...attributes} />;
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

export default CellSwitch;
