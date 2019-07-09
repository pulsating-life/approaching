'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    toggle: PropTypes.func,
    message: PropTypes.string
};

class ErrorMsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onClose = (collapsed) => {
        this.props.toggle();
    }

    render() {
        if (this.props.message === '') {
            return null;
        }

        return (
            <div data-show="true" className="ant-alert ant-alert-error" style={{ textAlign: 'left' }}>
                <i className="anticon anticon-cross-circle ant-alert-icon"></i>
                <span className="ant-alert-message">{this.props.message}</span>
                <span className="ant-alert-description"></span>
                {(typeof (this.props.toggle) != 'undefined') ? <a className="ant-alert-close-icon" onClick={this.onClose}><i className="anticon anticon-cross"></i></a> : ''}
            </div>
        );
    }
}

ErrorMsg.propTypes = propTypes;
export default ErrorMsg;


