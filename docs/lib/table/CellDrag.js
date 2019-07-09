'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Utils = require('@/public/script/utils');
import Draggable from 'react-draggable';

class CellDrag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientY: 0,
            clientX: 0,
            loading: false,
            container: null,
            isDraging: false
        };
    }

    componentWillMount() {
        this.setState();
    }
    onStart = (e, cmpt) => {
        if (this.props.onStart) {
            var dObj = this.state.container;
            var dRect = dObj.getBoundingClientRect();
            this.props.onStart(this.props.record, this.props.name, dRect, e, cmpt);
        }
    }
    onStop = (e, cmpt) => {
        if (this.props.onStop && cmpt && cmpt.node) {
            var dObj = this.state.container;
            var dragRect = dObj.getBoundingClientRect();
            var dropRect = cmpt.node.getBoundingClientRect();
            this.props.onStop(this.props.record, this.props.name, dropRect, dragRect, e, cmpt);
        }

        this.setState({ isDraging: false });
    }
    handleDrag = (e, cmpt) => {
        if (this.state.isDraging) {
            if ((cmpt.x < 20 && cmpt.x > -20) && (cmpt.y < 20 && cmpt.y > -20)) {
                this.setState({ isDraging: false });
            }
        }
        else {
            if ((cmpt.x > 20 || cmpt.x < -20) || (cmpt.y > 20 || cmpt.y < -20)) {
                this.setState({ isDraging: true });
            }
        }
    }
    onClick = (e) => {
        this.state.clientY = e.clientY;
        this.state.clientX = e.clientX;
    }

    render() {
        const {
            record,
            name,
            value,
            disabled,
            ...attrs
        } = this.props;

        var domCC;
        var cc = this.state.container;
        if (cc) {
            domCC = ReactDOM.findDOMNode(cc);
        }

        // 填充总个单元格
        var style2 = {};
        var className = 'dragTreeNode';
        var cellStyle = { height: '16px', lineHeight: '16px' };
        if (domCC) {
            var cRect = domCC.parentNode.getBoundingClientRect();
            style2.height = cRect.height-1;
            style2.margin = '-10px -8px';

            cellStyle.height = style2.height;
            cellStyle.padding = '9px 8px';

            if (this.state.isDraging) {
                className = className + ' drag dragBox';
            }
        }
        else {
            style2.padding = '10px 8px';
            style2.margin = '-10px -8px';
        }

        var node;
        if (disabled) {
            node = <div style={cellStyle} className={className}>{value}</div>;
        }
        else {
            var attr = {};
            attr.onStop = this.onStop;
            attr.onStart = this.onStart;
            attr.onDrag = this.handleDrag;
            if (domCC) {
                attr.offsetParent = domCC;
                attr.position = { x: 0, y: 0 };
            }

            node = (
                <Draggable {...attr} >
                    <div style={cellStyle} className={className}>{value}</div>
                </Draggable>
            );
        }

        return (
            <div style={style2} ref={(obj) => { this.state.container = obj; }} onMouseDown={this.onClick} {...attrs}>
                {node}
            </div>
        );
    }
}

export default CellDrag;
