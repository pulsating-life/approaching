'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Utils = require('../../public/script/utils');

class XlsDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: '',
            data: '',
            isLoading: false,
            timer: null,
        };
    }
    downFile = (fields, data) => {
        this.setState({ isLoading: true, fields: fields, data: data });
    }
    downClick = () => {
        this.refs.fileForm.submit();
    }
    render() {
        const {
            action,
            ...attributes
        } = this.props;

        var url = action ? action : Utils.paramUrl + 'xlsx-file/create-excel';
        if (this.state.isLoading) {
            this.state.isLoading = false;

            this.state.timer = setTimeout(
                () => {
                    this.downClick();
                    clearInterval(this.state.timer);
                },
                100
            );
        }

        return (
            <form ref='fileForm' action={url} method="post" style={{ display: 'none' }} target="downloadFrame">
                <iframe name="downloadFrame" style={{ display: 'none' }} frameborder="0"></iframe>
                <input type="hidden" name="fields" id="fields" value={this.state.fields} />
                <input type="hidden" name="data" id="data" value={this.state.data} />
            </form>
        );
    }
}

export default XlsDown;
