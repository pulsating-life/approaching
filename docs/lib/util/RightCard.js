'use strict';

/**
 *   Create by Malson on 2018/3/15
 */
import React from 'react';
import { Input, Select, Switch, Icon, Button } from 'antd';
import { BlockPicker, GithubPicker } from 'react-color';
const Option = Select.Option;

import CanvasCommon from '../../public/script/canvas-common';


class RightCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attr: {
                fillCol: '',    // 卡片  填充  颜色
                fontSize: '',   // 字体大小
                fontCol: '',    // 字体颜色
                lineCol: '',    // 线颜色
                lineWidth: '',  // 线粗细
                lineType: ''    // 线类型
            },
            curType: '',
            colTop: '',
            id: '',
            type: '',//当前选择的图形的id 和  type属性
            lineColF: false,
        }
    }
    //文字大小
    handleFontSize = (fontSize) => {
        let attr = Object.assign({}, this.state.attr, { fontSize });
        this.setState({ attr });
        this.changeAttr(attr);
    }
    //线段大小
    handleLineWidth = (lineWidth) => {
        let attr = Object.assign({}, this.state.attr, { lineWidth });
        this.setState({ attr });
        this.changeAttr(attr);
    }
    //线段类型
    handleLineType = (lineType) => {
        let attr = Object.assign({}, this.state.attr, { lineType });
        this.setState({ attr });
        this.changeAttr(attr);
    }
    colorChange = (val) => {
        this.state.attr[this.state.curType] = val.hex;
        this.forceUpdate();
        this.changeAttr(this.state.attr);
    }
    colorInputLine = (e) => {
        let colTop = e.target.parentNode.parentNode.offsetTop;
        this.setState({ curType: e.target.id, colTop, lineColF: true });
    }
    changeAttr = (attr) => {
        let { id, type } = this.state;
        let o = Object.assign({}, { id, type }, { attr });
        if (!id) { console.warn('没有选中东西'); return; }
        this.props.changeAttr(o)
    }
    colorInput = (e) => {
        let colTop = e.target.parentNode.parentNode.offsetTop + 20;
        this.setState({ curType: e.target.id, colTop, lineColF: false });
    }
    cancelCol = () => {
        if (this.state.curType) {
            this.setState({ curType: '', lineColF: false });
        }
    }
    switchGrid = (flag) => {
        this.props.switchGrid(flag)
    }
    componentWillReceiveProps(nextProps) {
        let attrOpt = nextProps.attrOption
            || { attr: CanvasCommon.getDefaultCardAttr('default') },
            { id, type } = attrOpt;
        if (this.state.id === attrOpt.id) { return; }   //防止拖动的时候重复调用
        attrOpt && this.setState({ attr: Object.assign({}, CanvasCommon.getDefaultCardAttr('default'), attrOpt.attr), id, type, curType: '' });
    }
    componentDidMount() {
    }
    render() {
        const { fillCol, fontSize, fontCol, lineCol, lineWidth, lineType } = this.state.attr;
        const defaultCol = this.state.attr[this.state.curType];
        const { grid } = this.props;
        return (
            <div className='card-menu'>
                <ul>
                    <section>文本</section>
                    <ul className='card-ul'>
                        <li>
                            <Button
                                icon="edit"
                                className='card-btn'
                                disabled={!fontCol}
                                title='字体颜色'
                                id='fontCol'
                                style={{ color: fontCol }}
                                onClick={this.colorInput}
                            />
                        </li>
                        <Select value={fontSize}
                            onChange={this.handleFontSize}
                            className='text-select'
                            size="large"
                            disabled={!fontSize}
                        >
                            <Option value="12">12</Option>
                            <Option value="14">14</Option>
                            <Option value="18">18</Option>
                            <Option value="20">20</Option>
                            <Option value="24">24</Option>
                            <Option value="28">28</Option>
                        </Select>
                    </ul>
                    <section>线条</section>
                    <ul className='card-ul'>
                        <li>
                            <Button
                                icon="edit"
                                className='card-btn'
                                disabled={!lineCol}
                                title='线条颜色'
                                id='lineCol'
                                style={{ color: lineCol }}
                                onClick={this.colorInputLine}
                            />
                        </li>
                        <Select value={lineWidth}
                            onChange={this.handleLineWidth}
                            className='text-select'
                            size="large"
                            disabled={!lineWidth}
                        >
                            <Option value="1">1</Option>
                            <Option value="1.5">1.5</Option>
                            <Option value="2">2</Option>
                            <Option value="2.5">2.5</Option>
                            <Option value="3">3</Option>
                            <Option value="3.5">3.5</Option>
                            <Option value="4">4</Option>
                        </Select>
                        <Select value={lineType}
                            onChange={this.handleLineType}
                            className='text-select'
                            size="large"
                            style={{ width: 80 }}
                            disabled={!lineType}
                        >
                            <Option value="line_solid">直线</Option>
                            <Option value="line_polyline">折线</Option>
                        </Select>
                    </ul>
                    <section>填充和背景</section>
                    <ul className='card-ul'>
                        <li>
                            <Button
                                className='card-btn'
                                disabled={!fillCol}
                                title='线条颜色'
                                id='fillCol'
                                style={{ backgroundColor: fillCol, color: '#fff' }}
                                onClick={this.colorInput}
                            />
                        </li>
                    </ul>
                    <div style={{paddingTop: '8px'}}>
                        <span style={{ verticalAlign: 'text-top' }}>背景</span>
                        <Switch
                            checked={grid}
                            checkedChildren="开"
                            unCheckedChildren="关"
                            style={{ marginLeft: 10 }}
                            onChange={this.switchGrid}
                        /></div>
                </ul>
                {
                    defaultCol
                        ? <div style={{ position: 'absolute', 'top': this.state.colTop + 36, 'left': '20px' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {
                                this.state.lineColF
                                    ? <GithubPicker onChange={this.colorChange}
                                        triangle='hide'
                                        colors={CanvasCommon.getColors()}
                                    />
                                    : <BlockPicker onChange={this.colorChange} color={defaultCol} />
                            }
                        </div>
                        : ''
                }
            </div>
        )
    }
}

export default RightCard;