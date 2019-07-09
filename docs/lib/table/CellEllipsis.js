'use strict';

import React from 'react';
import { Input, Icon } from 'antd';
var Common = require('../../public/script/common');

class CellEllipsis extends React.Component {
    state = {
        hoverNode: false
    }
    onMouseEnter = (node) => {
        this.setState({ hoverNode: true });
    }
    onMouseLeave = (node) => {
        this.setState({ hoverNode: false });
    }

    componentWillReceiveProps(nextProps) {
        this.setState();
    }
    handleChange=(value)=> {
        const {
            record,
            name,
            onChange,
            setCellText
        } = this.props;

        if (setCellText) {
            setCellText(record, name, value);
        }
        else {
            var pos = name.indexOf('#');
            if (pos > 0) {
                var colName = name.substr(0, pos);
                var idx = parseInt(name.substr(pos + 1));

                var values = record[colName];
                if (idx < values.length) {
                    values[idx] = value;
                }
            }
            else {
                record[name] = value;
            }
        }

        if (onChange) {
            onChange(record, name, value);
        }

        this.setState();
    }
    onClickEdit=()=> {
        const {
            record,
            name,
            onEdit,
            getCellText
        } = this.props;

        if (onEdit) {
            var value;
            if (getCellText) {
                value = getCellText(record, name);
                if (value && (typeof value === 'object')) {
                    if (value.isHint === true) {
                        value = '';
                    } else {
                        value = value.text;
                    }
                }
            }
            else {
                var pos = name.indexOf('#');
                if (pos > 0) {
                    var colName = name.substr(0, pos);
                    var idx = parseInt(name.substr(pos + 1));

                    var values = record[colName];
                    if (idx < values.length) {
                        value = values[idx];
                    }
                }
                else {
                    value = record[name];
                }
            }
            
            onEdit(record, name, value, this.handleChange);
        }
    }
    render() {
        const {
            record,
            name,
            showType,
            icon,
            iconHint,
            onChange,
            onEdit,
            getCellText,
            setCellText,
            ...attributes
        } = this.props;
        
        var txt;
        var isHint = false;
        if (getCellText) {
            txt = getCellText(record, name);
            if (txt && (typeof txt === 'object')) {
                isHint = txt.isHint;
                txt = txt.text;
            }
        }
        else {
            var pos = name.indexOf('#');
            if (pos > 0) {
                var colName = name.substr(0, pos);
                var idx = parseInt(name.substr(pos + 1));

                var values = record[colName];
                if (idx < values.length) {
                    txt = values[idx];
                }
            }
            else {
                txt = record[name];
            }
        }

        if (showType && txt) {
            txt = Common.formatShowText(showType, txt);
        }

        if (!txt) {
            txt = '　';
        }

        if (this.state.hoverNode === true && icon) {
            var cellStyle = { width: '100%', float: 'left', paddingRight: '18px' };
            if (isHint === true) {
                cellStyle.color = '#D0D0D0';
            }

            var aHint = iconHint;
            if (!aHint) {
                aHint = '编辑';
            }
            else if (typeof aHint === 'function') {
                aHint = aHint(record, name);
            }

            return (
                <div style={{ width: '100%' }} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} {...attributes}>
                    <div style={cellStyle}>{txt}</div>
                    <a href='#' onClick={this.onClickEdit} title={aHint} style={{ float: 'left', marginLeft: '-16px' }}><Icon type={icon} /></a>
                </div>
            );
        }

        var cellStyle = { width: '100%', float: 'left' };
        if (isHint === true) {
            cellStyle.color = '#D0D0D0';
        }

        return (
            <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} {...attributes}>
                <div style={cellStyle}>{txt}</div>
            </div>
        );
    }
}

export default CellEllipsis;
