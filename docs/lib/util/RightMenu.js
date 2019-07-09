'use strict';

/**
 *   Create by Malson on 2018/3/5
 */
import React from 'react';
import { Button, Input, Icon, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import RightCard from './RightCard';


class RightMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
            menuType: 'attr',
        }
    }
    componentDidMount() {
    }
    pull = (e) => {
        e.stopPropagation();
        this.setState({ showMenu: !this.state.showMenu });
    }
    cancelCol = () => {
        this.rightCard && this.rightCard.cancelCol();
    }
    // 改变了  当前图形的属性
    changeAttr = (option) => {
        this.props.changeAttr(option);
    }
    onClickTab = (activeKey)=>{
        this.setState({ menuType: activeKey });
    }
    onClickHidden = () => {
        this.setState({ showMenu: !this.state.showMenu });
    }
    render() {
        const {
            attrOption,
            changeAttr,
            grid,
            switchGrid,
            ...attrs
        } = this.props;

        let wrapClassName = this.state.showMenu ? 'right-menu' : 'right-menu hidden',
            pullIconClass = this.state.showMenu ? 'double-right' : 'double-left';

        const rightCardProps = {
            attrOption: this.props.attrOption,
            changeAttr: this.changeAttr,
            grid: this.props.grid,
            switchGrid: this.props.switchGrid,
        };

        var pullBtn = this.state.showMenu ? null : <div className='pull-btn' onClick={this.pull}><Icon type={pullIconClass} /></div>;
        var btn = <Icon type={pullIconClass} onClick={this.onClickHidden} size="large" style={{ padding: '0 6px', backgroundColor: '#2d63a7', height: '32px', lineHeight: '32px', color: '#FEFEFE' }} />;
        return (
            <div className={wrapClassName} {...attrs}>
                <div className='right-position' onClick={this.cancelCol}>
                    {pullBtn}
                    <Tabs activeKey={this.state.menuType} onChange={this.onClickTab} tabBarStyle={{ margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }} tabBarExtraContent={btn}>
                        <TabPane tab="属性" key='attr' style={{ width: '100%', height: '100%' }}>
                            <RightCard ref={ref => this.rightCard = ref} {...rightCardProps} />
                        </TabPane>
                        <TabPane tab="其他" key='other' style={{ width: '100%', height: '100%' }}>
                            <div>其他</div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default RightMenu;
