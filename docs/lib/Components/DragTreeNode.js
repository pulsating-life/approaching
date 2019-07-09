'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { Icon } from 'antd';

class DragTreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientY: 0,
            loading: false,
            container: null,
            isDraging: false,
            hoverNode: false,
        }
    }

    // 第一次加载
    componentDidMount() {
    }
    onStart = (e, cmpt) => {
        if (this.props.onStart) {
            var dObj = this.state.container;
            var dRect = dObj.getBoundingClientRect();
            this.props.onStart(this.props.node, dRect, e, cmpt);
        }
    }
    onStop = (e, cmpt) => {
        if (this.props.onStop) {
            var dObj = this.state.container;
            var dRect = dObj.getBoundingClientRect();
            this.props.onStop(this.props.node, dRect, e, cmpt);
        }

        // 恢复节点
        this.state.timer = setTimeout(
            () => {
                this.setState({ hoverNode: false, isDraging: false });
                clearInterval(this.state.timer);
            },
            100
        );
    }
    handleDrag = (e, cmpt) => {
        if (this.props.innerDrag !== true) {
            if (this.state.isDraging) {
                if (cmpt.x < 50 && cmpt.x > -50) {
                    this.setState({ isDraging: false });
                }
            }
            else {
                if (cmpt.x > 50 || cmpt.x < -50) {
                    this.setState({ isDraging: true });
                }
            }
        }
    }
    onMouseEnter = (node) => {
        this.setState({ hoverNode: true });
    }
    onMouseLeave = (node) => {
        if (!this.state.clientY) {
            this.setState({ hoverNode: false });
        }
    }
    onClick = (e) => {
        this.state.clientY = e.clientY;
    }
    onMouseUp = (e) => {
        this.state.clientY = 0;
    }
    render() {
        const {
            node,
            activeNode,
            draggingNode,
            onStart,
            onStop,
            disabled,
            styleName,
            ...attrs
        } = this.props;

        var domCC;
        var cc = this.state.container;
        if (cc) {
            domCC = ReactDOM.findDOMNode(cc);
        }

        var style = {};
        // style.cursor = 'pointer';
        var className = styleName ? styleName : 'dragTreeNode';
        if (draggingNode && draggingNode.key == node.key) {
            // console.log(draggingNode, node, this.state.isDraging);
            if (this.state.isDraging) {
                className = className + ' drag dragBox';
                style.top = this.state.clientY - 12;
            }
            else {
                className = className + ' drag2';
            }
        }
        else if (activeNode && activeNode.key === node.key) {
            className = className + ' selected';
        }
        else if (disabled) {
            style.backgroundColor = '#F9F9F9';
        }

        // console.log('className', className);
        var attr = {};
        attr.onStop = this.onStop;
        attr.onStart = this.onStart;
        attr.onDrag = this.handleDrag;
        if (domCC) {
            attr.offsetParent = domCC;
            attr.position = { x: 0, y: 0 };
        }

        var dragNode;
        var title = node.icon ? <span><Icon type={node.icon} />{node.title}</span> : node.title;
        if (this.state.hoverNode) {
            dragNode = (
                <Draggable key={node.key} {...attr} >
                    <div style={style} className={className}>{title}</div>
                </Draggable>
            );
        }
        else {
            dragNode = <div style={style} className={className}>{title}</div>;
        }

        return (
            <div {...attrs} ref={(obj) => { this.state.container = obj; }} onMouseDown={this.onClick} onMouseUp={this.onMouseUp} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                {dragNode}
            </div>
        );
    }
}

export default DragTreeNode;
