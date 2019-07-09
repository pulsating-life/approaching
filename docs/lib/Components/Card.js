'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
var Utils = require('../../public/script/utils');

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            container: null,
            clientY: 0,
            clientX: 0,
            isDraging: false
        }
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

        this.setState({ isDraging: false });
    }
    handleDrag = (e, cmpt) => {
        if (this.state.isDraging) {
            if (cmpt.x < 20 && cmpt.x > -20 && cmpt.y < 20 && cmpt.y > -20) {
                this.setState({ isDraging: false });
            }
        }
        else {
            if (cmpt.x > 20 || cmpt.x < -20 || cmpt.y > 20 || cmpt.y < -20) {
                this.setState({ isDraging: true });
            }
        }
    }
    onMouseDown = (e) => {
        this.state.clientY = e.clientY;
    }

    render() {
        const {
            key,
            node,
            onClick,
            style,
            hint,
            title,
            titleStyle,
            titleHeight,
            children,
            onStop,
            onStart,
            width,
            ...attributes
        } = this.props;

        var style2 = {};
        if (style) {
            Utils.copyValue(style, style2);
        }

        style2.width = '100%';

        var btn;
        var cardBody;
        if (children instanceof Array) {
            var btns = [];
            var cc = children.length;
            for (var i = 0; i < cc - 1; i++) {
                if (i > 0) {
                    btns.push(<span className='ant-divider' />);
                }

                btns.push(children[i]);
            }

            if (cc > 1) {
                btn = (
                    <div className='ant-card-extra'>
                        {btns}
                    </div>
                );
            }

            cardBody = children[cc - 1];
        }
        else {
            cardBody = children;
        }

        var style3;
        if (titleHeight) {
            style3 = { height: titleHeight, lineHeight: titleHeight};
        }

        // 卡片
        var card;
        if (title || btn) {
            card = (
                <div className='ant-card ant-card-bordered' key={key} style={style2} onClick={onClick} title={hint} {...attributes}>
                    <div className='ant-card-head' style={style3}><div className='ant-card-head-title' style={titleStyle}>{title}</div>
                        {btn}
                    </div>
                    {cardBody}
                </div>
            );
        }
        else {
            card = (
                <div className='ant-card ant-card-bordered' key={key} style={style2} onClick={onClick} title={hint} {...attributes}>
                    {cardBody}
                </div>
            );
        }

        if (!onStop) {
            return card;
        }

        // 带拖动功能的
        var dragStyle = { width: width };
        var divStyle = { width: width };
        var cc = this.state.container;
        if (cc) {
            var domCC = ReactDOM.findDOMNode(cc);
            if (domCC) {
                var cRect = domCC.getBoundingClientRect();
                dragStyle.height = cRect.height;
                divStyle.height = cRect.height;
            }
        }

        var className = 'card-div dragTreeNode';
        if (this.state.isDraging) {
            style2.zIndex = 10000;
            className = className + ' drag';

            var cTop = this.props.containerTop;
            if (cTop && cTop > 0) {
                dragStyle.top = this.state.clientY - cTop;
            }
        }
        else {
            className = className + ' drag2';
            if (this.refs.dragNode) {
                this.refs.dragNode.state.x = 0;
                this.refs.dragNode.state.y = 0;
            }
        }

        var attr = {};
        attr.onStop = this.onStop;
        attr.onStart = this.onStart;
        attr.onDrag = this.handleDrag;

        return (
            <div style={divStyle} className='card-div' onMouseDown={this.onMouseDown}>
                <Draggable ref='dragNode' key={'d' + key} {...attr}>
                    <div key={key} style={dragStyle} className={className} ref={(obj) => { this.state.container = obj; }}>
                        {card}
                    </div>
                </Draggable>
            </div>
        );
    }
}

export default Card;
