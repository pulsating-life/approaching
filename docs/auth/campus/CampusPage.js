'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var Reflux = require('reflux');
import {Button, Icon, Spin, Input, Tabs} from 'antd';
const Search = Input.Search;
const TabPane = Tabs.TabPane;

var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');
import ServiceMsg from '@/lib/Components/ServiceMsg';
import Card from '@/lib/Components/Card';

import CreateCampusPage from './Components/CreateCampusPage';
import UpdateCampusPage from './Components/UpdateCampusPage';
import CorpPage from '../corp/CorpPage';
import UserTablePage from '../user/Components/SysCompUserTablePage';
import UserPrivPage from '../user/Components/UserPrivPage';
var CampusStore = require('./data/CampusStore');
var CampusActions = require('./action/CampusActions');

var filterValue = '';
class CampusPage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         authCampusSet: [],
         loading: false,
         action: 'query',
         filter: {},

         activeTab: '公司',
         authCampus: null,   // 当前选中的节点
         corp: null,        // 选中的公司
         compUser: null,    // 选中的人
      }
   }
   
   onServiceComplete = (data) => {
      this.setState({
         loading: false,
         authCampusSet: data.recordSet
      });
   }
   
   // 第一次加载
   componentDidMount() {
      this.unsubscribe = CampusStore.listen(this.onServiceComplete);

      this.setState({ loading: true });
      this.loadCacheData();
   }
   componentWillUnmount() {
      this.unsubscribe();
   }
   // 查询缓存
   loadCacheData = () => {
      this.setState({ loading: true });
      
      CampusActions.initAuthCampus();
   }
   // 刷新
   handleQueryClick = (event) => {
      this.setState({loading: true});
      CampusActions.retrieveAuthCampus();
   }

   onClickDelete = (authCampus, event) => {
      var self = this;
      var msg = '是否删除选中的园区【' + authCampus.campusName + '】';
      Common.doConfirm(authCampus, msg).then(function (result) {
         self.setState({ loading: true });
         CampusActions.deleteAuthCampus(authCampus.uuid);
      });

      event.stopPropagation();
   }
   handleOpenCreateWindow = (event) => {
      this.refs.createWindow.clear();
      this.refs.createWindow.toggle();
   }
   onClickUpdate = (authCampus, event) => {
      if(authCampus){
         this.state.authCampus = authCampus;
         this.refs.updateWindow.initPage(authCampus);
         this.refs.updateWindow.toggle();
      }
      
      event.stopPropagation();
   }
   handleAuthCampusClick = (authCampus, e) => {
      if(authCampus != null){
          this.setState({ authCampus: authCampus, activeTab: '公司', action: 'detail' });
      }
      
      e.stopPropagation();
   }
   onFilterRecord = (e) => {
      filterValue = e.target.value;
      this.setState({loading: this.state.loading});
   }
   onGoBack = () => {
      this.setState({action: 'query'});
   }
   onTabChange = (activeKey) => {
       var action = this.state.action;
       if (activeKey === '返回') {
           this.onGoBack();
       }
       else if (activeKey === '公司' && (action === 'detail2' || action === 'detail3')) {
           this.setState({ action: 'detail', activeTab: activeKey });
       }
       else if (activeKey === '人员' && action === 'detail3') {
           this.setState({ action: 'detail2', activeTab: activeKey });
       }
   }
   onClickUserMan = (corp) => {
       this.setState({ action: 'detail2', activeTab: '人员', corp: corp });
   }
   onClickPriv = (compUser) => {
       this.setState({ action: 'detail3', activeTab: '权限', compUser: compUser });
   }
   
   render() {
      var recordSet = Common.filter(this.state.authCampusSet, filterValue);
      var cardList =
         recordSet.map((authCampus, i) => {
            return <div key={authCampus.uuid} className='card-div' style={{width: 300}}>
               <Card onClick={this.handleAuthCampusClick.bind(this, authCampus)} hint='点击进入园区维护页面' title={authCampus.campusName}>
                  <a href="#" onClick={this.onClickUpdate.bind(this, authCampus)} title='修改'><Icon type={Common.iconUpdate}/></a>
                  <a href="#" onClick={this.onClickDelete.bind(this, authCampus)}  title='删除'><Icon type={Common.iconRemove}/></a>
                  <div className='ant-card-body' style={{cursor:'pointer', height:'66px', overflow:'hidden'}}>{authCampus.campusLoc}</div>
               </Card>
            </div>
         }
      );
   
       var action = this.state.action;
      var visible = (action === 'query') ? '' : 'none';
      var cardPage = (
         <div className='card-page' style={{display:visible}}>
            <div>
               <ServiceMsg ref='mxgBox' svcList={['auth-campus/retrieve', 'auth-campus/remove']}/>
               <div className='toolbar-card'>
                  <div style={{float:'left'}}>
                     <div style={{paddingTop:'16px', paddingRight:'4px', display: 'inline'}}>{recordSet.length}个园区</div>
                     <Icon type="plus-circle-o" onClick={this.handleOpenCreateWindow} title='增加园区' className='toolbar-icon' style={{color: '#108ee9'}}/>
                     <Icon type="reload" onClick={this.handleQueryClick} title='刷新数据' className='toolbar-icon' style={{paddingLeft:'8px'}}/>
                  </div>
                  <div style={{textAlign:'right', width:'100%'}}>
                     <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
                  </div>
               </div>
            </div>

            {
               this.state.loading ?
                  <div><Spin tip="正在努力加载数据..." style={{minHeight: '200px'}}>{cardList}</Spin></div>
                  :
                  <div className='card-body'>{cardList}</div>
            }
         </div>
      );

      var detailPage = null;
      if (action === 'detail') {
          detailPage = (
              <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                  <Tabs activeKey={this.state.activeTab} onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                      <TabPane tab="园区管理" key="返回" style={{ width: '100%', height: '100%' }}>
                      </TabPane>
                      <TabPane tab="公司管理" key="公司" style={{ width: '100%', height: '100%' }}>
                          <CorpPage authCampus={this.state.authCampus} onClickUserMan={this.onClickUserMan}/>
                      </TabPane>
                  </Tabs>
              </div>
         );
      }
      else if (action === 'detail2') {
          detailPage = (
              <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                  <Tabs activeKey={this.state.activeTab} onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                      <TabPane tab="园区管理" key="返回" style={{ width: '100%', height: '100%' }}>
                      </TabPane>
                      <TabPane tab="公司管理" key="公司" style={{ width: '100%', height: '100%' }}>
                          <CorpPage authCampus={this.state.authCampus} onClickUserMan={this.onClickUserMan}/>
                      </TabPane>
                      <TabPane tab="系统管理员" key="人员" style={{ width: '100%', height: '100%' }}>
                          <UserTablePage type='sys' authCampus={this.state.authCampus} corp={this.state.corp} onSetPriv={this.onClickPriv}/>
                      </TabPane>
                  </Tabs>
              </div>
          );
      }
      else if (action === 'detail3') {
          detailPage = (
              <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                  <Tabs activeKey={this.state.activeTab} onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                      <TabPane tab="园区管理" key="返回" style={{ width: '100%', height: '100%' }}>
                      </TabPane>
                      <TabPane tab="公司管理" key="公司" style={{ width: '100%', height: '100%' }}>
                          <CorpPage authCampus={this.state.authCampus} onClickUserMan={this.onClickUserMan} />
                      </TabPane>
                      <TabPane tab="系统管理员" key="人员" style={{ width: '100%', height: '100%' }}>
                          <UserTablePage type='sys' authCampus={this.state.authCampus} corp={this.state.corp} onSetPriv={this.onClickPriv} />
                      </TabPane>
                      <TabPane tab="权限管理" key="权限" style={{ width: '100%', height: '100%' }}>
                          <UserPrivPage type='sys' authCampus={this.state.authCampus} corp={this.state.corp} compUser={this.state.compUser} />
                      </TabPane>
                  </Tabs>
              </div>
          );
      }
      
      return (
         <div style={{width: '100%',height:'100%'}}>
            {cardPage}
            {detailPage}
            <CreateCampusPage ref="createWindow" />
            <UpdateCampusPage ref="updateWindow" authCampus={this.state.authCampus}/>
         </div>
      );
   }
}

export default CampusPage;
