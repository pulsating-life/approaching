'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Spin } from 'antd';

const propTypes = {
    children: PropTypes.node,
    caption: PropTypes.string,
    toolbar: PropTypes.object,
    dataSource: PropTypes.array,
    rowKey: PropTypes.string,
    title: PropTypes.string,
    rowStyle: PropTypes.object,
    loading: PropTypes.bool,
    activeNode: PropTypes.string,
    render: PropTypes.func,
    onClick: PropTypes.func
};

class LeftList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: this.props.activeNode,
            onClick: this.props.onClick,
        };
    }
    componentWillReceiveProps(nextProps) {
        this.state.current = nextProps.activeNode;
    }

    handleClick = (mod, key, e) => {
        if (this.state.onClick !== null && typeof (this.state.onClick) !== 'undefined') {
            this.setState({ current: key });
            this.state.onClick(mod, e);
        }
    }

    crtNode = (data, rowKey, rowText, rowStyle, paddingLeft) => {
        var key = (rowKey === null || typeof (rowKey) === 'undefined') ? data['uuid'] : data[rowKey];
        var cName = (key === this.state.current) ? 'ant-menu-item-selected ant-menu-item' : 'ant-menu-item-active ant-menu-item';

        var nodeText = (typeof rowText === 'function') ? rowText(data) : data[rowText];
        return <li className={cName} id={key} key={key} onClick={this.handleClick.bind(this, data, key)} style={{ paddingLeft: paddingLeft, height: '30px', lineHeight: '30px' }}><Icon type="play-circle-o" />{nodeText}</li>;
    }

    render() {
        const {
	        children,
            caption,
            toolbar,
            width,
            dataSource,
            rowKey,
            rowText,
            rowStyle,
            activeNode,
            render,
            onClick,
            loading,
            ...attributes
	    } = this.props;

        if (dataSource === null || typeof (dataSource) === 'undefined') {
            var listBody =
                <div className='left-list' style={{ flex: '0 0 ' + width, width: width }}>
                    {toolbar}
                    <div>暂时无数据</div>
                </div>;
            return (
                <div style={{ display: 'flex', height: '100%' }} {...attributes}>
                    {loading ? <Spin style={{ minHeight: '200px' }}>{listBody}</Spin> : listBody}
                    <div style={{ width: '100%' }}>
                        {this.props.children}
                    </div>
                </div>
            );
        }

        var listBody =
            <ul className="ant-menu ant-menu-inline ant-menu-light ant-menu-root">
                {
                    dataSource.map((data, i) => {
                        return this.crtNode(data, rowKey, rowText, rowStyle, '20px');
                    })
                }
            </ul>;
        return (
            <div style={{ display: 'flex', height: '100%' }} {...attributes}>
                <div className='left-list' style={{ flex: '0 0 ' + width, width: width, paddingBottom: '8px', overflowY: 'auto' }}>
                    {toolbar}
                    {
                        (caption === null || typeof (caption) === 'undefined') ? null : <div className="ant-menu-item-group-title">{caption}</div>
                    }
                    {loading ? <Spin style={{ minHeight: '200px' }}>{listBody}</Spin> : listBody}
                </div>
                <div style={{ width: '100%', height: '100%', overflowX: 'hidden' }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

LeftList.propTypes = propTypes;
export default LeftList;
