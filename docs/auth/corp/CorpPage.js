'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import { Button, Icon, Input, Tabs } from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');
import ServiceMsg from '@/lib/Components/ServiceMsg';
import FormUtil from '@/lib/Components/FormUtil';
import DictTable from '@/lib/Components/DictTable';
import Card from '@/lib/Components/Card';

var FormDef = require('./Components/AuthCorpForm');
import CreateCorpPage from './Components/CreateCorpPage';
import UpdateCorpPage from './Components/UpdateCorpPage';
import UserTablePage from '../user/Components/SysCompUserTablePage';
import UserPrivPage from '../user/Components/UserPrivPage';
var CorpStore = require('./data/CorpStore');
var CorpActions = require('./action/CorpActions');

const tableName = 'AuthCorpTable';
class CorpPage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         authCorpSet: [],
         action: 'query',
         activeTab: '人员',
         authCorp: null,
         filterValue: '',
         authCampus: {},
         compUser: null,
      }
   }

   onServiceComplete = (data) => {
      this.setState({
         loading: false,
         authCorpSet: data.recordSet
      });
   }

   // 第一次加载
   componentDidMount() {
      this.unsubscribe = CorpStore.listen(this.onServiceComplete);

      var authCampus = {};
      this.state.authCampus = {};
      if (Common.corpStruct === '园区') {
          if (!this.props.authCampus) {
              return;
          }

          authCampus = this.props.authCampus;
      }
      else {
          authCampus.uuid = Common.campusUuid;
          authCampus.campusName = Common.campusName;
      }

      this.loadCacheData(authCampus);
   }
   componentWillUnmount() {
      this.unsubscribe();
   }
   // 查询缓存
   loadCacheData = (authCampus) => {
      this.setState({ loading: true });
      Utils.copyValue( authCampus, this.state.authCampus );
      CorpActions.initAuthCorp(authCampus.uuid);
   }
   // 刷新
   handleQueryClick = (event) => {
      if(!this.state.authCampus.uuid){
         return;
      }
      
      this.setState({loading: true});
      CorpActions.retrieveAuthCorp(this.state.authCampus.uuid);
   }

   onChangeFilter = (e) => {
      this.setState({ filterValue: e.target.value });
   }
   onGoBack = () => {
      this.setState({ action: 'query' });
   }
   onTabChange = (activeKey) => {
       var action = this.state.action;
      if (activeKey === '返回') {
         this.onGoBack();
      }
      else if (activeKey === '人员' && action === 'detail3') {
          this.setState({ action: 'detail', activeTab: activeKey });
      }
   }

   onClickDelete = (authCorp, event) => {
      var self = this;
      var msg = '是否删除选中的公司【' + authCorp.corpCode + '】';
      Common.doConfirm(authCorp, msg).then(function (result) {
         self.setState({ loading: true });
         CorpActions.deleteAuthCorp(authCorp.uuid);
      });
      
      event.stopPropagation();
   }
   handleOpenCreateWindow = (event) => {
      if(!this.state.authCampus.uuid){
         Common.errMsg('请先选择【园区】');
         return;
      }

      this.refs.createWindow.clear(this.state.authCampus);
      this.refs.createWindow.toggle();
   }
   onClickUpdate = (authCorp, event) => {
      if(authCorp){
         this.refs.updateWindow.initPage(authCorp);
         this.refs.updateWindow.toggle();
      }
      
      event.stopPropagation();
   }

   handleAuthCorpClick = (authCorp, e) => {
       if (Common.corpStruct === '园区') {
           if (this.props.onClickUserMan) {
               this.props.onClickUserMan(authCorp);
           }
       }
       else {
           if (authCorp != null) {
               this.setState({ authCorp: authCorp, action: 'detail', activeTab: '人员' });
           }
       }

      e.stopPropagation();
   }
   onClickPriv = (compUser) => {
       this.setState({ action: 'detail3', activeTab: '权限', compUser: compUser });
   }

   // 卡片
   renderCardView = () => {
      var dataSet = Common.filter(this.state.authCorpSet, this.state.filterValue);
      var cardList =
         dataSet.map((authCorp, i) => {
            return <div key={authCorp.uuid} className='card-div' style={{ width: 300 }}>
               <Card onClick={this.handleAuthCorpClick.bind(this, authCorp)} hint='点击进入公司维护页面' title={authCorp.corpCode}>
                  <a href='#' onClick={this.onClickUpdate.bind(this, authCorp)} title='修改公司'><Icon type={Common.iconUpdate} /></a>
                  <a href='#' onClick={this.onClickDelete.bind(this, authCorp)} title='删除公司'><Icon type={Common.iconRemove} /></a>
                  <div className='ant-card-body' style={{ cursor: 'pointer', height: '66px', overflow: 'hidden' }}>{authCorp.corpName}</div>
               </Card>
            </div>
         });

      return <div style={{ margin: '10px 0 10px -10px' }}>{cardList}</div>;
   }

   render() {
      var dataSet = Common.filter(this.state.authCorpSet, this.state.filterValue);

      // 左上角按钮
        var leftButtons = [];
        if (Common.corpStruct === '园区') {
            leftButtons.push(<div style={{ paddingTop: '8px', paddingRight: '8px', display: 'inline' }}>{this.state.authCampus.campusName}，{dataSet.length}个公司</div>);
        }
        else {
            leftButtons.push(<div style={{ paddingTop: '8px', paddingRight: '8px', display: 'inline' }}>共 {dataSet.length} 个公司</div>);
        }

        leftButtons.push(<Button icon={Common.iconAdd} type="primary" title="增加公司" onClick={this.handleOpenCreateWindow} />);
        leftButtons.push(<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />);

      // 右上角按钮
      var rightButtons = <Input placeholder="查询公司" style={{ width: Common.searchWidth }} value={this.state.filterValue} onChange={this.onChangeFilter} />;

      // 表格行按钮
      var operCol = 
         {
            title: '操作',
            key: 'action',
            width: 90,
            render: (text, record) => (
               <span>
                  <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改公司'><Icon type={Common.iconUpdate} /></a>
                  <span className="ant-divider" />
                  <a href="#" onClick={this.handleAuthCorpClick.bind(this, record)} title='管理员'><Icon type={Common.iconUser} /></a>
                  <span className="ant-divider" />
                  <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除公司'><Icon type={Common.iconRemove} /></a>
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
         defView: '公司信息',
         views: null,
         viewType: '卡片',
         renderCard: this.renderCardView
      };

      if (Common.corpStruct === '园区') {
          return (
              <div className='grid-page' style={{ overflow: 'auto' }}>
                  <ServiceMsg ref='mxgBox' svcList={['auth-corp/retrieve', 'auth-corp/remove']} />
                  <DictTable dataSource={dataSet} loading={this.state.loading} attrs={attrs} />
                  <CreateCorpPage ref="createWindow" authCampus={this.state.authCampus} />
                  <UpdateCorpPage ref="updateWindow" authCorp={this.state.authCorp} />
              </div>
          );
      }
      else {
          var detailPage = null;
          var activeTab = this.state.activeTab;
          if (this.state.action === 'detail') {
              detailPage = (
                  <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                      <Tabs activeKey={activeTab} onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                          <TabPane tab="公司管理" key="返回" style={{ width: '100%', height: '100%' }}>
                          </TabPane>
                          <TabPane tab="系统管理员" key="人员" style={{ width: '100%', height: '100%' }}>
                              <UserTablePage type='sys' authCampus={this.state.authCampus} corp={this.state.authCorp} onSetPriv={this.onClickPriv} />
                          </TabPane>
                      </Tabs>
                  </div>
              );
          }
          else if (this.state.action === 'detail3') {
              detailPage = (
                  <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                      <Tabs activeKey={activeTab} onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                          <TabPane tab="公司管理" key="返回" style={{ width: '100%', height: '100%' }}>
                          </TabPane>
                          <TabPane tab="系统管理员" key="人员" style={{ width: '100%', height: '100%' }}>
                              <UserTablePage type='sys' authCampus={this.state.authCampus} corp={this.state.authCorp} onSetPriv={this.onClickPriv} />
                          </TabPane>
                          <TabPane tab="权限管理" key="权限" style={{ width: '100%', height: '100%' }}>
                              <UserPrivPage type='sys' authCampus={this.state.authCampus} corp={this.state.authCorp} compUser={this.state.compUser} />
                          </TabPane>
                      </Tabs>
                  </div>
              );
          }

          var action = this.state.action;
          var visible = (action === 'query') ? '' : 'none';
          return (
              <div style={{ width: '100%', height: '100%' }}>
                  <div className='grid-page' style={{ padding: '8px 0 10px 0', overflow: 'auto', display: visible }}>
                      <ServiceMsg ref='mxgBox' svcList={['auth-corp/retrieve', 'auth-corp/remove']} />
                      <DictTable dataSource={dataSet} loading={this.state.loading} attrs={attrs} />
                  </div>
						{detailPage}
                  <CreateCorpPage ref="createWindow" authCampus={this.state.authCampus} />
                  <UpdateCorpPage ref="updateWindow" authCorp={this.state.authCorp} />
              </div>
          );
      }
   }
}

export default CorpPage;
