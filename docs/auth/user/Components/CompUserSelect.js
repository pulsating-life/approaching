import React from 'react';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var UserGroupStore = require('../../userGroup/data/UserGroupStore');
var UserGroupActions = require('../../userGroup/action/UserGroupActions');

class CompUserSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            compUserSet: {
                recordSet: [],
                errMsg: '',
                operation: ''
            },
            loading: false
        }
	}

	onServiceComplete = (data) => {
        if (data.operation === 'retrieve') {
            this.state.compUserSet = data;
            this.setState({ loading: false });
        }
	}

    // 第一次加载
	componentDidMount() {
		this.unsubscribe = UserGroupStore.listen(this.onServiceComplete);

        this.state.compUserSet = {
            recordSet: [],
            errMsg: '',
            operation: ''
        };

        this.setState({ loading: true });
        var corpUuid = this.props.corpUuid;
        if (corpUuid) { 
            UserGroupActions.initUserGroup(corpUuid);
        }
	}
	componentWillUnmount() {
		this.unsubscribe();
	}


	render(){
        const {
            required,
            ...attributes
        } = this.props;

        var recordSet = this.state.compUserSet.recordSet;

        var children =
            recordSet.map((comp, i) => {
                return <Option key={comp.uuid} value={comp.groupName}>{comp.groupName}</Option>
            });

        children.push(<Option key='*' value='*'>所有用户</Option>);
        var box =
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                {...this.props}
            >
                {children}
            </Select>

        return this.state.loading ? <Spin>{box}</Spin> : box;
	}
}

export default CompUserSelect;