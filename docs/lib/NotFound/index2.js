'use strict';

import React from 'react';

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <h1>404 - Not Found !</h1>
                <div>{this.props.location.pathname}</div>
            </div>
        );
    }
}

export default IndexPage;
