'use strict';

import React from 'react';
import { Input } from 'antd';
var Common = require('../../public/script/common');

class CellInput extends React.Component {
    state = {
        loading: false,
    }
    componentWillReceiveProps(nextProps) {
    }
    handleChange(e) {
        const {
            record,
            name,
            onChange
        } = this.props;

        record[name] = e.target.value;

        if (onChange) {
            onChange(record, name, record[name]);
        }

        this.setState({ loading: false });
    }
    render() {
        const {
            record,
            name,
            showType,
            onChange,
            ...attributes
        } = this.props;

        if (record.editable) {
            return (
                <Input
                    id={name}
                    style={{ margin: '-5px 0' }}
                    value={record[name]}
                    onChange={e => this.handleChange(e)}
                    {...attributes}
                />
            );
        }

        var txt = record[name];
        if (showType) {
            txt = Common.formatShowText(showType, txt);
        }

        return (
            <span>
                {txt}
            </span>
        );
    }
}

export default CellInput;
