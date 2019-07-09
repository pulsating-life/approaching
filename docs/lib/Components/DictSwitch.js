'use strict';

import React from 'react';
import { Switch } from 'antd';
var Utils = require('../../public/script/utils');

class DictSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    onSwitchChange = (data) => {
        const {
            checked,
            unChecked,
            onChange,
        } = this.props;

        if (onChange) {
            var value = data ? checked.value : unChecked.value;
            onChange(this.props.id, value);
        }
    }
    render() {
        const {
            checked,
            unChecked,
            id,
            value,
            onChange,
            ...attributes
        } = this.props;

        // console.log(checked, unChecked, value)
        var data = (checked.value === value) ? true : false;
        // console.log(data, checked.value, value)
        return <Switch id={id} name={id} checked={data} checkedChildren={checked.title} unCheckedChildren={unChecked.title} onChange={this.onSwitchChange} {...attributes} />;
    }
}

export default DictSwitch;
