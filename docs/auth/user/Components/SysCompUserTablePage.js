'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Button, Icon, Input } from 'antd';
const Search = Input.Search;

var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');
import ServiceMsg from '@/lib/Components/ServiceMsg';
import FormUtil from '@/lib/Components/FormUtil';
import DictTable from '@/lib/Components/DictTable';

var FormDef = require('./CompUserForm');
import CreateCompUserPage from './CreateCompUserPage';
import UpdateCompUserPage from './UpdateCompUserPage';
var CompUserStore = require('../data/CompUserStore');
var CompUserActions = require('../action/CompUserActions');

const tableName = 'SysCompUserTable';
class SysCompUserTablePage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         compUserSet: [],
         compUser: null,
         filterValue: '',
         filter: {},
      }
   }

   onServiceComplete = (data) => {
      this.setState({
         loading: false,
         compUserSet: data.recordSet
      });
   }

   // 第一次加载
   componentDidMount() {
      this.unsubscribe = CompUserStore.listen(this.onServiceComplete);
        this.loadData();
    }
   componentWillUnmount() {
      this.unsubscribe();
   }
    getCorpUuid = () => {
            var corp = this.props.corp;
            return corp ? corp.uuid : Common.corpUuid;
    }
    getFilter = () => {
        var filter = {};
        filter.deptUuid = this.getCorpUuid();

        var filterValue = this.state.filterValue;
        if (filterValue) {
            filter.userCode = filterValue;
            filter.userName = filterValue;
            filter.perName = filterValue;
        }

        return filter;
    }
    loadData = () => {
        this.setState({ loading: true });
        var filter = this.getFilter();
        CompUserActions.initCompUser(filter, 0, 0);
    }
   // 刷新
   handleQueryClick = (event) => {
        this.setState({ loading: true });
        var filter = this.getFilter();
        CompUserActions.retrieveCompUserPage(filter, 0, 0);
    }

   onChangeFilter = (e) => {
      this.setState({ filterValue: e.target.value });
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
        var deptUuid = this.getCorpUuid();

        this.refs.createWindow.clear(deptUuid, deptUuid);
      this.refs.createWindow.toggle();
   }
   onClickUpdate = (compUser, event) => {
      if(compUser){
         this.refs.updateWindow.initPage(compUser);
         this.refs.updateWindow.toggle();
      }
      
      event.stopPropagation();
   }

   handleSysCompUserClick = (compUser, e) => {
      if (compUser && this.props.onSetPriv) {
         this.state.compUser = compUser;
         this.props.onSetPriv(compUser);
      }

      e.stopPropagation();
   }

   render() {
      var dataSet = Common.filter(this.state.compUserSet, this.state.filterValue);

      // 左上角按钮
      var title = this.state.compUserSet.length + ' 个系统管理员';
      var leftButtons = [
          <div style={{ paddingTop: '8px', paddingRight: '8px', display: 'inline' }}>{title}</div>,
         <Button icon={Common.iconAdd} type="primary" title="增加用户" onClick={this.handleOpenCreateWindow} />,
         <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />,
      ];

      // 右上角按钮
      var rightButtons = <Input placeholder="查询用户" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} />;

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
                  <a href="#" onClick={this.handleSysCompUserClick.bind(this, record)} title='权限管理'><Icon type='safety' /></a>
                  <span className="ant-divider" />
                  <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除用户'><Icon type={Common.iconRemove} /></a>
               </span>
            )
         };

      // 表格属性
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
         defView: '系统用户',
         views: null,
      };

      return (
         <div className='grid-page' style={{ padding: '8px 0 10px 0', overflow: 'auto' }}>
            <ServiceMsg ref='mxgBox' svcList={['comp_user/retrieve', 'comp_user/remove']} />
            <DictTable dataSource={dataSet} loading={this.state.loading} attrs={attrs} />
            <CreateCompUserPage ref="createWindow"/>
            <UpdateCompUserPage ref="updateWindow" compUser={this.state.compUser}/>
         </div>
      );
   }
}

export default SysCompUserTablePage;
