'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { Tooltip } from 'antd';

class DragIconNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            container: null,
            isDraging: false,
            beginDraging: false,
        }
    }

    // 第一次加载
    componentDidMount() {
    }
    onStart = (e, cmpt) => {
        this.setState({ beginDraging: true });

        var dObj = this.state.container;
        var dRect = dObj.getBoundingClientRect();


        if (this.props.onStart) {
            this.props.onStart(this.props.node, dRect, e, cmpt);
        }
    }
    onStop = (e, cmpt) => {
        if (this.props.onStop && cmpt && cmpt.node) {
            var dRect = cmpt.node.getBoundingClientRect();
            this.props.onStop(this.props.id, dRect, e, cmpt);
        }

        this.setState({ isDraging: false, beginDraging: false });
    }
    handleDrag = (e, cmpt) => {
        if (this.state.isDraging) {
            if (cmpt.x < 50) {
                this.setState({ isDraging: false });
            }
        }
        else {
            if (cmpt.x > 50) {
                this.setState({ isDraging: true });
            }
        }
    }
    render() {
        const {
            id,
            name,
            className,
            icon,
            disabled,
            styleName,
            getDragNode,
            ...attrs
        } = this.props;

        var nodeBody;
        var style = {};
        var dragClass = null;
        if (this.state.beginDraging) {
            if (this.state.isDraging) {
                dragClass = 'common-content drag';
                if (getDragNode) {
                    nodeBody = getDragNode(id);
                }
            }
            else {
                dragClass = 'common-content drag2';
            }
        }
        else if (disabled) {
            style.backgroundColor = '#F9F9F9';
        }

        if (!nodeBody) {
            nodeBody = (
                <Tooltip placement="top" title={name} key={id}>
                    <li value={id} name={name} className={`iconfont ${icon}`} />
                </Tooltip>
            );
        }

        var attr = {};
        attr.onStop = this.onStop;
        attr.onStart = this.onStart;
        attr.onDrag = this.handleDrag;
        var cc = this.state.container;
        if (cc) {
            const domCC = ReactDOM.findDOMNode(cc);
            attr.offsetParent = domCC;
            attr.position = { x: 0, y: 0 };
        }

        return (
            <div {...attrs} style={{ float: 'left', width: '48px' }} ref={(obj) => { this.state.container = obj; }}>
                <div style={{fontSize:'1pt', height:'1px', overflow:'hidden'}}>.</div>
                <Draggable key={id} {...attr}>
                    <div className={dragClass} style={style}>
                        {nodeBody}
                    </div>
                </Draggable>
            </div>
        );
    }
}

export default DragIconNode;
