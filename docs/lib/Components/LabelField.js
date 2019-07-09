'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class LabelField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labelObj: null,
            fieldObj: null,
            container: null,
        };
    }
    // 第一次加载
    componentDidMount() {
        this.timer = setTimeout(
            () => {
                this.setState({ loading: false});
                clearInterval(this.timer);
            },
            100
        );
    }

    render() {
        const {
            label,
            children,
            ...attributes
        } = this.props;

        // 计算宽度
        var style;
        if (this.state.container) {
            const labelCC = ReactDOM.findDOMNode(this.state.labelObj);
            var lRect = labelCC.getBoundingClientRect();

            const pCC = ReactDOM.findDOMNode(this.state.container);
            var pRect = pCC.getBoundingClientRect();

            style = {};
            style.width = pRect.width - lRect.width - 20;
        }

        return (
            <div style={{ width: '100%' }} ref={(obj) => { this.state.container = obj; }}>
                <div style={{float:'left'}} ref={(obj) => { this.state.labelObj = obj; }}>
                    {label}：
                </div>
                <label style={style} ref={(obj) => { this.state.fieldObj = obj; }}>
                    {children}
                </label>
            </div>
        );
    }
}

export default LabelField;
