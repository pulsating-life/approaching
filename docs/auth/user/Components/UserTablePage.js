'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Button, Icon, Input, Upload } from 'antd';
const Search = Input.Search;

var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');
import ServiceMsg from '@/lib/Components/ServiceMsg';
import FormUtil from '@/lib/Components/FormUtil';
import DictTable from '@/lib/Components/DictTable';
import XlsTempFile from '@/lib/hoc/XlsTempFile';

var FormDef = require('./CompUserForm');
import CreateCompUserPage from './CreateCompUserPage';
import UpdateCompUserPage from './UpdateCompUserPage';
var CompUserStore = require('../data/CompUserStore');
var CompUserActions = require('../action/CompUserActions');

const tableName = 'CompUserTable';
@XlsTempFile
class UserTablePage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         compUserSet: {
            recordSet: [],
            startPage : 1,
            pageRow : 10,
            totalRow : 0
         },
         compUser: null,
         filterValue: '',
         filter: {},
      }
   }

   onServiceComplete = (data) => {
       if (data.operation !== 'find') {
           this.setState({
               loading: false,
               compUserSet: data
           });
       }
   }

   // 第一次加载
   componentDidMount() {
      this.unsubscribe = CompUserStore.listen(this.onServiceComplete);
      var dataSet = this.state.compUserSet;
      var conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
      dataSet.startPage = (conf.page !== true) ? 0 : 1;

      this.loadCacheData();
   }
   componentWillUnmount() {
      this.unsubscribe();
   }
    getCorpUuid = () => {
        return window.loginData.compUser.corpUuid;
    }
    getFilter = () => {
        var filter = {};
        if (Common.userDept === 'Y') {
            var dept = this.props.dept;
            filter.deptUuid = dept ? dept.uuid : '#';
        }
        else {
            filter.corpUuid = this.getCorpUuid();
        }

        var filterValue = this.state.filterValue;
        if (filterValue) {
            filter.userCode = filterValue;
            filter.userName = filterValue;
            filter.perName = filterValue;
        }

        return filter;
    }
   // 查询缓存
   loadCacheData = () => {
      this.setState({ loading: true });
      var dataSet = this.state.compUserSet;
        var filter = this.getFilter();
        CompUserActions.initCompUser(filter, 1, dataSet.pageRow);
   }
   // 刷新
   handleQueryClick = (event) => {
      this.setState({loading: true});
      var dataSet = this.state.compUserSet;
        var filter = this.getFilter();
        CompUserActions.retrieveCompUserPage(filter, dataSet.startPage, dataSet.pageRow);
   }
   onTableRefresh = (current, pageRow) => {
      var dataSet = this.state.compUserSet;
      dataSet.startPage = current;
      dataSet.pageRow = pageRow;
      this.handleQueryClick();
   }

   onChangeFilter = (e) => {
      this.setState({ filterValue: e.target.value });
   }
   onSearch = (e) => {
       var dataSet = this.state.compUserSet;
       dataSet.startPage = 1;
      this.handleQueryClick();
   }

   onClickDelete = (compUser, event) => {
      var self = this;
      var msg = '是否删除选中的用户【' + compUser.userName + '】';
      Common.doConfirm(compUser, msg).then(function (result) {
         self.setState({ loading: true });
         CompUserActions.deleteCompUser(compUser.uuid);
      });
      
      event.stopPropagation();
   }
   handleOpenCreateWindow = (event) => {
        var deptUuid = null;
        if (Common.userDept === 'Y') {
            if (this.props.dept) {
                deptUuid = this.props.dept.uuid;
            }
            else {
                MsgActions.showError('comp-user', 'retrieve', '请先选择部门');
                return;
            }
        }

        this.refs.createWindow.clear(this.getCorpUuid(), deptUuid);
      this.refs.createWindow.toggle();
   }
   onClickUpdate = (compUser, event) => {
      if(compUser){
         this.refs.updateWindow.initPage(compUser);
         this.refs.updateWindow.toggle();
      }
      
      event.stopPropagation();
   }
    handleTempDown = (e) => {
        this.downXlsTempFile(FormDef.userFields);
    }
    uploadComplete = (errMsg) => {
        this.setState({loading: false});
        if(errMsg !== ''){
            Common.errMsg(errMsg);
        }
    }
    beforeUpload = (file) => {
        var deptUuid;
        if (Common.userDept === 'Y') {
            if (this.props.dept) {
                deptUuid = this.props.dept.uuid;
            }
            else {
                MsgActions.showError('comp-user', 'retrieve', '请先选择部门');
                return;
            }
        }

        this.setState({loading: true});
        var url = Utils.authUrl + 'auth-user/upload-xls';
        var data={ corpUuid: this.getCorpUuid(), deptUuid: deptUuid };   // 上传数据
        this.uploadXlsFile(url, data, FormDef.userFields, file, this.uploadComplete);
        return false;
    }
   handleCompUserClick = (compUser, e) => {
      if (compUser && this.props.onSetPriv) {
         this.state.compUser = compUser;
         this.props.onSetPriv(compUser);
      }

      e.stopPropagation();
   }

   render() {
      var dataSet = this.state.compUserSet.recordSet;
       var disabled = (Common.userDept === 'Y' && !this.props.dept);
       
      // 左上角按钮
      var title = this.state.compUserSet.totalRow + ' 个用户';
      var leftButtons = [
          <div style={{ paddingTop: '8px', paddingRight: '8px', display: 'inline' }}>{title}</div>,
          <Button icon={Common.iconAdd} type="primary" title="增加用户" disabled={disabled} onClick={this.handleOpenCreateWindow} />,
          <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />,
           <Button icon='download' title='下载模板' onClick={this.handleTempDown} style={{marginLeft: '4px'}}/>,
           <Upload name='file' action='/posts/' beforeUpload={this.beforeUpload} disabled={disabled} style={{marginLeft: '4px'}}>
               <Button icon='upload'/>
           </Upload>
      ];

      // 右上角按钮
      var rightButtons = <Search placeholder="用户名或工号" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} onSearch={this.onSearch} />;

      // 表格行按钮
      var operCol = 
         {
            title: '操作',
            key: 'action',
            width: 90,
            render: (text, record) => (
               <span>
                  <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改用户'><Icon type={Common.iconUpdate} /></a>
                  <span className="ant-divider" />
                  <a href="#" onClick={this.handleCompUserClick.bind(this, record)} title='权限管理'><Icon type='safety' /></a>
                  <span className="ant-divider" />
                  <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除用户'><Icon type={Common.iconRemove} /></a>
               </span>
            )
         };

      // 表格属性
      var compUserSet = this.state.compUserSet;
      var attrs = {
         self: this,
         tableName: tableName,
         primaryKey: 'uuid',
         buttons: leftButtons,
         btnPosition: 'top',
         rightButtons: rightButtons,
         operCol: operCol,
         tableForm: FormDef,
         editCol: false,
         editTable: false,
         defView: '用户信息',
         views: null,
         totalPage: compUserSet.totalRow,
         currentPage: compUserSet.startPage,
         onRefresh: this.onTableRefresh,
      };

      return (
         <div className='grid-page' style={{ padding: '8px 0 10px 0', overflow: 'auto' }}>
            <ServiceMsg ref='mxgBox' svcList={['comp-user/retrieve', 'comp-user/remove']} />
            <DictTable dataSource={dataSet} loading={this.state.loading} attrs={attrs} />
            <CreateCompUserPage ref="createWindow" />
            <UpdateCompUserPage ref="updateWindow" compUser={this.state.compUser}/>
         </div>
      );
   }
}

export default UserTablePage;
