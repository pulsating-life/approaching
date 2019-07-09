'use strict';

import React from 'react';
var Reflux = require('reflux');
import { Modal, Form, Button } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '@/lib/Components/ServiceMsg';
import ModalForm from '@/lib/hoc/ModalForm';
var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');

var FormDef = require('./AuthCampusForm');
var CampusStore = require('../data/CampusStore');
var CampusActions = require('../action/CampusActions');

@ModalForm('authCampus')
class CreateCampusPage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         modal: false,
         authCampus: {},
         hints: {},
         validRules: []
      }
   }
   
   onServiceComplete = (data) => {
      if (this.state.modal && data.operation === 'create') {
         if (data.errMsg === '') {
            // 成功，关闭窗口
            this.setState({ modal: false, loading: false });
         }
         else {
            // 失败
            this.setState({ loading: false });
         }
      }
   }
   
   // 第一次加载
   componentDidMount() {
      this.unsubscribe = CampusStore.listen(this.onServiceComplete);
      this.state.validRules = FormDef.getAuthCampusFormRule(this);
   }
   componentWillUnmount() {
      this.unsubscribe();
   }

   // 初始化页面数据
   clear = () => {
      this.state.authCampus = {};
      var authCampus = this.state.authCampus;
      FormDef.initAuthCampusForm(authCampus);
      authCampus.uuid = '';
      
      this.state.hints = {};
      if (this.refs.mxgBox) {
         this.refs.mxgBox.clear();
      }
      
      this.setState({loading: false});
   }

   onClickSave = () => {
      var authCampus = this.state.authCampus;
      if(Common.formValidator(this, authCampus)){
         this.setState({loading: true});
         CampusActions.createAuthCampus( authCampus );
      }
   }

   render() {
      var layoutItem = 'form-item-vertical';
      // visible,label,required,check(有效性检查),options,readOnly,disabled,className,hint 等等
      var attrList = null;
      var items = FormDef.getAuthCampusForm(this, this.state.authCampus, attrList, null, 'vertical');
      
      return (
         <Modal visible={this.state.modal} width='540px' title="增加园区" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
            footer={[
               <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                  <ServiceMsg ref='mxgBox' svcList={['auth-campus/create']} />
                  <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                  <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
               </div>
            ]}
         >
            <Form layout='vertical'>
               {items}
            </Form>
         </Modal>
      );
   }
}

export default CreateCampusPage;
