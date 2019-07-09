import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Radio, Icon, Affix } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

var Utils = require('../../public/script/utils');
var Common = require('../../public/script/common');
import XlsDown from './XlsDown';
import XlsTempFile from '../hoc/XlsTempFile';
import FormUtil from './FormUtil';
import EditTable from './EditTable';
import EditTable2 from './EditTable2';

/*
self: 页面,
tableName: 表格名称,
primaryKey: 主键缺省[uuid],
## fixedTool: 固定按钮行
container: 固定按钮行的容器
buttons: 左上按钮,
btnPosition: 按钮位置：top,bottom,
rightButtons: 右上按钮,
bottomButtons: 下方按钮,
operCol: 表格行的操作按钮,
editCol: 允许选择列,
editTable: 允许修改表格属性,
tableForm: 表格配置信息,
defView: 缺省显示的视图，在tableForm里配置,
views: 缺省定义的多表格视图,
colAttrs: 列的属性
totalPage: 总页数,
currentPage: 当前页,
onRefresh: 修改当前页或每页记录数量时触发,func(current, pageRow)
enableExport: 允许导出,true/false
mustPage: 必须分页,true/false
renderCard: 显示卡片
onChangeEditView: 批量删除视图
size: large,middle,small
padding: '0 12px 8px 20px'
toolPadding: 工具条的padding
toolStyle
height: 高度
*/

@XlsTempFile
class DictTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableName: '',

            viewType: '',
            cardViewType: '表格',
            editViewType: '查询',
            tables: [],
            tableConf: {},  // activeName,size,page,wrap,showLine,pageRow
            selectedRowKeys: [],    // table 多选
        };
    }

    // 第一次加载
    componentDidMount() {
        this.state.tableName = this.props.attrs.tableName;

        var attrs = this.props.attrs;
        if (attrs.viewType) {
            this.state.cardViewType = attrs.viewType;
        }

        this.state.tableConf = FormUtil.getTableConf(this.state.tableName);
        this.onTableChange();
    }

    onClickEditColumn = () => {
        var tableName = this.state.tableName;
        var attrs = this.props.attrs;
        this.refs.editTable.initPage(tableName, this.getColumns());
        this.refs.editTable.toggle();
    }
    onTableChange = () => {
        var viewType = '';
        var tables = [];

        var attrs = this.props.attrs;
        var views = attrs.views;
        if (views && views.length > 0) {
            for (var x = 0; x < views.length; x++) {
                var viewInfo = this.getTableView(views[x]);
                if (viewInfo) {
                    var table = { name: views[x], columns: viewInfo.cols };
                    tables.push(table);
                }
            }
        }
        else {
            var tableName = this.state.tableName;
            var str = window.localStorage[tableName];
            if (str) {
                var colConf = JSON.parse(str);
                tables = colConf.tables;
            }
        }

        var aName = this.state.tableConf.activeName;
        if (tables && aName) {
            var len = tables.length;
            for (var i = 0; i < len; i++) {
                if (tables[i].name === aName) {
                    viewType = aName;
                    break;
                }
            }
        }

        if (!viewType || viewType === '') {
            if (tables && tables.length > 0) {
                viewType = tables[0].name;
            }
        }

        this.setState({ viewType: viewType, tables: tables })
    }
    onClickEditTable = () => {
        var attrs = this.props.attrs;
        var tableName = this.state.tableName;
        this.refs.editTable2.initPage(tableName, attrs.mustPage, attrs.enableExport, attrs.size);
        this.refs.editTable2.toggle();
    }
    onTableConfChange = () => {
        var tableName = this.state.tableName;
        var conf = FormUtil.getTableConf(tableName);
        var isChange = (this.state.tableConf.page !== conf.page);
        this.setState({ tableConf: conf });

        if (isChange) {
            var attrs = this.props.attrs;
            if (attrs.onRefresh) {
                if (conf.page === true) {
                    attrs.onRefresh(attrs.currentPage, conf.pageRow);
                }
                else {
                    attrs.onRefresh(0, 0);
                }
            }
        }
    }
    onChangeView = (e) => {
        this.state.tableConf.activeName = e.target.value;
        var tableName = this.state.tableName;
        FormUtil.saveTableConf(tableName, this.state.tableConf);

        this.setState({ viewType: e.target.value });
    }
    onChangeCardView = (e) => {
        this.setState({ cardViewType: e.target.value });
    }
    onChangeEditView = (e) => {
        this.setState({ editViewType: e.target.value });

        var attrs = this.props.attrs;
        attrs.onChangeEditView(e.target.value);

    }
    onChangePage = (pageNumber) => {
        // console.log(pageNumber)
        var attrs = this.props.attrs;
        var conf = this.state.tableConf;
        if (attrs.onRefresh) {
            if (conf.page === true) {
                attrs.onRefresh(pageNumber, conf.pageRow);
            }
            else {
                attrs.onRefresh(0, 0);
            }
        }
    }
    onShowSizeChange = (current, pageSize) => {
        var attrs = this.props.attrs;
        var conf = this.state.tableConf;
        conf.pageRow = pageSize;
        FormUtil.saveTableConf(attrs.tableName, conf);

        if (attrs.onRefresh) {
            if (conf.page === true) {
                attrs.onRefresh(attrs.currentPage, conf.pageRow);
            }
            else {
                attrs.onRefresh(0, 0);
            }
        }
    }
    getTableView = (viewType) => {
        var attrs = this.props.attrs;
        if (typeof attrs.tableForm === 'function') {
            return null;
        }

        var viewList = attrs.tableForm.tableViews;
        if (!viewList) {
            return null;
        }

        var len = viewList.length;
        for (var i = 0; i < len; i++) {
            if (viewList[i].name === viewType) {
                return viewList[i];
            }
        }

        return null;
    }
    getTableColumns = (viewType, operCol) => {
        var table = null;
        var tables = this.state.tables;
        for (var i = 0; i < tables.length; i++) {
            if (tables[i].name === viewType) {
                table = tables[i];
                break;
            }
        }

        if (!table) {
            table = tables[0];
            this.state.viewType = table.name;
        }

        return this.getColumns(table.columns, operCol);
    }
    getColumns = (viewType, operCol) => {
        var emptyCols = [];
        if (viewType && operCol) {
            emptyCols.push(operCol);
        }

        var attrs = this.props.attrs;
        if (typeof attrs.tableForm === 'function') {
            var cols = attrs.tableForm(attrs.self);
            if (!cols) {
                return emptyCols;
            }
            if (!operCol) {
                return cols;
            }

            var list = Utils.cloneArray(cols);
            list.push(operCol);
            return list;
        }

        var tableView = this.getTableView(attrs.defView);
        if (!tableView) {
            alert('没有找到[' + attrs.defView + ']');
            return emptyCols;
        }

        var func = attrs.tableForm[tableView.func];
        var columnList = func(attrs.self, attrs.tableForm);
        if (!viewType) {
            // 取所有列
            return columnList;
        }

        if (typeof viewType === 'string') {
            tableView = this.getTableView(viewType);
            if (!tableView) {
                return emptyCols;
            }

            viewType = tableView.cols;
        }

        var columnMap = {};
        for (var i = columnList.length - 1; i >= 0; i--) {
            var c = columnList[i];
            columnMap[c.key] = c;
        }

        var columns = [];
        var cols = viewType;
        var len = cols.length;
        for (var i = 0; i < len; i++) {
            var col = cols[i];
            if (typeof col === 'string') {
                var c = columnMap[col];
                if (c) {
                    columns.push(c);
                }
            }
            else {
                var c = columnMap[col.name];
                if (c) {
                    if (col.width) c.width = col.width;
                    columns.push(c);
                }
            }
        }

        if (operCol) {
            columns.push(operCol);
        }

        return columns;
    }
    onExportFile = () => {
        var recordSet = this.getRecordSet();
        if (!recordSet) {
            return;
        }

        // 标题
        var cols = this.refs.table.columns;
        var count = cols.length;
        var attrs = this.props.attrs;
        if (attrs.operCol) {
            count--;
        }

        var fields = [];
        for (var i = 0; i < count; i++) {
            var col = cols[i];
            var zm = String.fromCharCode(i + 65);
            var r = { id: zm, name: col.key, title: col.title };
            fields.push(r);
        }

        this.refs.editTable2.closePage();
        this.downXlsTempFile2(fields, recordSet, this.refs.xls);
    }
    getRecordSet = () => {
        const table = ReactDOM.findDOMNode(this.refs.table);
        if (!table) return;

        const tbodys = table.getElementsByTagName('tbody')
        if (!tbodys || tbodys.length === 0) return;

        const rows = tbodys[0].getElementsByTagName('tr')
        if (!rows || rows.length === 0) return;

        var cols = this.refs.table.columns;

        var recordSet = [];
        var len = rows.length;
        for (var i = 0; i < len; i++) {
            var record = this.getRecord(cols, rows[i]);
            if (record) {
                recordSet.push(record);
            }
        }

        return recordSet;
    }
    getRecord = (cols, row) => {
        const values = row.getElementsByTagName('td')
        if (!values || values.length === 0) {
            return null;
        }

        var record = {};
        var count = values.length;
        for (var i = 0; i < count; i++) {
            var name = cols[i].key;
            record[name] = values[i].innerText;
        }

        return record;
    }
    getRowRecord = (dRect) => {
        const table = ReactDOM.findDOMNode(this.refs.table);
        if (!table) return -1;

        const tbodys = table.getElementsByTagName('tbody')
        if (!tbodys || tbodys.length === 0) return;

        const rows = tbodys[0].getElementsByTagName('tr')
        if (!rows || rows.length === 0) return;

        var x = dRect.x + dRect.width / 2;
        var y = dRect.y + dRect.height / 2;

        var len = rows.length;
        for (var i = 0; i < len; i++) {
            var flag = this.isPosRecord(rows[i], x, y);
            if (flag) {
                return i;
            }
        }

        return -1;
    }
    isPosRecord = (row, x, y) => {
        var cRect = row.getBoundingClientRect();
        var right = cRect.left + cRect.width;
        var bottom = cRect.top + cRect.height;
        if (x >= cRect.left && x <= right && y >= cRect.top && y <= bottom) {
            return true;
        }
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 取选中的记录
    getSelectedRows = () => {
        var keys = this.state.selectedRowKeys;
        if (!keys || keys.length === 0) {
            return [];
        }

        var dataSource = this.props.dataSource;
        if (!dataSource || dataSource.length === 0) {
            return [];
        }

        var keyName = this.props.attrs.primaryKey;
        if (!keyName) {
            keyName = 'uuid';
        }

        // 所有记录
        var nodeMap = {};
        for (var i = 0; i < dataSource.length; i++) {
            var data = dataSource[i];
            var keyValue = data[keyName];
            nodeMap[keyValue] = data;
        }

        var res = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var data = nodeMap[key];
            if (data) {
                res.push(data);
            }
        }

        return res;
    }

    render() {
        const {
            attrs,
            ...attributes
        } = this.props;

        // activeName,size,page,wrap,showLine,pageRow
        var conf = this.state.tableConf;

        var showLine = (conf.showLine === true) ? true : false;
        var wrap = (conf.wrap === true) ? true : false;
        var tableSize = conf.size;
        if (!tableSize) {
            tableSize = attrs.size;
        }

        if (tableSize !== 'large' && tableSize !== 'small') {
            tableSize = 'middle';
        }

        // 工具条
        var toolbar = [];
        var marginLeft = '0px';
        if (attrs.buttons && (attrs.btnPosition !== 'bottom' || attrs.bottomButtons)) {
            marginLeft = '24px';
            toolbar.push(<div key="left" style={{ float: 'left' }}>{attrs.buttons}</div>);
        }

        // console.log(attrs, toolbar)
        var tables = this.state.tables;
        if (tables && tables.length > 1) {
            var btns = [];
            for (var i = 0; i < tables.length; i++) {
                var t = tables[i];
                btns.push(<RadioButton key={i} value={t.name}>{t.name}</RadioButton>);
            }

            var bars = <div style={{ float: 'left' }}>
                <RadioGroup value={this.state.viewType} style={{ marginLeft: marginLeft }} onChange={this.onChangeView}>{btns}</RadioGroup>
            </div>;

            toolbar.push(bars);
            marginLeft = '24px';
        }

        if (attrs.renderCard) {
            var btns = [];
            btns.push(<RadioButton key="biaoge" value='表格'>表格</RadioButton>);
            btns.push(<RadioButton key="kapian" value='卡片'>卡片</RadioButton>);

            var bars = <div style={{ float: 'left' }}>
                <RadioGroup value={this.state.cardViewType} style={{ marginLeft: marginLeft }} onChange={this.onChangeCardView}>{btns}</RadioGroup>
            </div>;

            toolbar.push(bars);
        }
        else if (attrs.onChangeEditView) {
            var btns = [];
            btns.push(<RadioButton key="query" value='查询'>查询</RadioButton>);
            btns.push(<RadioButton key="edit" value='编辑'>编辑</RadioButton>);

            var bars = <div style={{ float: 'left' }}>
                <RadioGroup value={this.state.editViewType} style={{ marginLeft: marginLeft }} onChange={this.onChangeEditView}>{btns}</RadioGroup>
            </div>;

            toolbar.push(bars);
        }
        else {
            this.state.editViewType = attrs.editViewType;
        }

        if (attrs.rightButtons) {
            toolbar.push(<div key="right" style={{ textAlign: 'right', width: '100%' }}>{attrs.rightButtons}</div>);
        }

        var toolClass = attrs.toolClass;
        if (!toolClass) {
            toolClass = 'toolbar-table';
        }

        // 工具条
        var toolDiv = null;
        if (toolbar.length > 0) {
            if (attrs.container) {
                var st = attrs.toolStyle;
                if (!st) {
                    st = { padding: 0 };
                }

                toolDiv = <div className={toolClass} style={st}>
                    <Affix target={() => attrs.container}><div style={{ backgroundColor: '#FEFEFE', width: '100%', height: '30px', padding: '0 20px 0 20px' }}>{toolbar}</div></Affix>
                </div>;
            }
            else {
                var padding = attrs.toolPadding;
                if (padding) {
                    toolDiv = <div className={toolClass} style={{ padding: padding }}>{toolbar}</div>;
                }
                else if (attrs.toolStyle) {
                    toolDiv = <div className={toolClass} style={attrs.toolStyle}>{toolbar}</div>;
                }
                else {
                    toolDiv = <div className={toolClass}>{toolbar}</div>;
                }
            }
        }

        // 选择列的按钮
        var operCol = attrs.operCol;
        if (operCol) {
            var views = attrs.views;
            if (attrs.editCol === true && (!views || views.length === 0)) {
                if (attrs.editTable === true) {
                    attrs.operCol.title = <div>
                        <Icon type="edit" style={{ cursor: 'pointer' }} onClick={this.onClickEditColumn} />
                        <span className="ant-divider" />
                        <Icon type="bars" style={{ cursor: 'pointer' }} onClick={this.onClickEditTable} />
                    </div>;
                }
                else {
                    attrs.operCol.title = <div>
                        <Icon type="edit" style={{ cursor: 'pointer' }} onClick={this.onClickEditColumn} />
                    </div>;
                }
            }
            else if (attrs.editTable === true) {
                attrs.operCol.title = <div>
                    <Icon type="bars" style={{ cursor: 'pointer' }} onClick={this.onClickEditTable} />
                </div>;
            }
        }

        // 不生成最后一列
        if (this.state.editViewType === '编辑') {
            operCol = null;
        }

        // 表格
        var columns;
        var tables = this.state.tables;
        if (tables && tables.length > 1) {
            columns = this.getTableColumns(this.state.viewType, operCol);
        }
        else if (tables && tables.length === 1) {
            var viewType = tables[0].name;
            columns = this.getTableColumns(viewType, operCol);
        }
        else {
            columns = this.getColumns(attrs.defView, operCol);
        }

        var scrollX = 0;
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            scrollX = col.width + scrollX;
        }

        // 分页
        var pag = false;
        if (conf.page === true && attrs.onRefresh) {
            // 超过一页，按实际数量显示
            var pageRow = conf.pageRow;
            var recordSet = attributes.dataSource;
            if (recordSet && recordSet.length > pageRow) {
                pageRow = recordSet.length;
            }

            pag = { showQuickJumper: true, total: attrs.totalPage, pageSize: parseInt(pageRow), current: attrs.currentPage, size: 'large', showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePage }
        }

        if (!attrs.onRefresh) {
            attrs.mustPage = true;
        }

        // 下按钮上移
        var bottomDiv = null;
        var bottomButtons = attrs.bottomButtons;
        if (!bottomButtons && attrs.btnPosition === 'bottom') {
            bottomButtons = attrs.buttons;
        }

        if (bottomButtons) {
            var recordSet = this.props.dataSource;
            var btnMargin = (recordSet.length === 0 || pag === false) ? '8px 0 0 0' : '-44px 0 0 0';
            bottomDiv = <div style={{ margin: btnMargin, width: '100%' }} >
                <div style={{ float: 'left' }}>
                    {bottomButtons}
                </div>
            </div>;
        }

        var primaryKey = attrs.primaryKey;
        if (!primaryKey || primaryKey === '') {
            primaryKey = 'uuid';
        }

        var pages = [
            <EditTable key="EditTable" ref="editTable" onTableChange={this.onTableChange} />,
            <EditTable2 key="EditTable2" ref="editTable2" onExportFile={this.onExportFile} onTableChange={this.onTableConfChange} />,
            <XlsDown key="XlsDown" ref='xls' />
        ];

        var sclX = {};
        if (scrollX > 1400) {
            sclX = { scroll: { x: scrollX + 100 } };
            if (operCol) {
                operCol.fixed = 'right';
            }

            if (attrs.height) {
                sclX.scroll.y = attrs.height;
            }
        }
        else if (attrs.height) {
            sclX = { scroll: { y: attrs.height } };
        }

        var padding = attrs.padding;
        if (!padding) {
            padding = '0 12px 8px 20px';
        }

        // 选择行
        var rowSelection = null;
        if (attrs.editViewType === '编辑') {
            var selectedRowKeys = this.state.selectedRowKeys;
            rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectChange,
            };
        }

        var view;
        if (this.state.cardViewType === '表格' || !attrs.renderCard) {
            view = <Table ref='table' columns={columns} rowKey={record => record[primaryKey]} pagination={pag} size={tableSize} bordered={showLine} rowSelection={rowSelection} {...sclX} {...attributes} />;
        }
        else {
            view = attrs.renderCard();
        }

        return <div style={{ width: '100%' }} key={attrs.tableName}>
            {toolDiv}
            <div style={{ width: '100%', padding: padding }}>
                {view}
                {bottomDiv}
            </div>
            {pages}
        </div>;
    }
}

export default DictTable;
