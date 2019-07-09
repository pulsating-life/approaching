'use strict';

import React from 'react';
var Reflux = require('reflux');
import { Modal, Form, Button } from 'antd';
const FormItem = Form.Item;

import ServiceMsg from '@/lib/Components/ServiceMsg';
import ModalForm from '@/lib/hoc/ModalForm';
var Common = require('@/public/script/common');
var Utils = require('@/public/script/utils');

var FormDef = require('./AuthCorpForm');
var CorpStore = require('../data/CorpStore');
var CorpActions = require('../action/CorpActions');

@ModalForm('corp')
class UpdateCorpPage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         modal: false,
         corp: {},
         hints: {},
         validRules: []
      }
   }
   onServiceComplete = (data) => {
      if (this.state.modal && data.operation === 'update') {
         if (data.errMsg === '') {
            // 成功，关闭窗口
            this.setState({modal: false, loading: false});
         }
         else {
            // 失败
            this.setState({loading: false});
         }
      }
   }
   
   // 第一次加载
   componentDidMount() {
      this.unsubscribe = CorpStore.listen(this.onServiceComplete);
      this.state.validRules = FormDef.getAuthCorpFormRule(this);
   }
   componentWillUnmount() {
      this.unsubscribe();
   }

   initPage = (corp) => {
      this.state.corp = {};
      if( corp ){
         Utils.copyValue(corp, this.state.corp);
      }
      
      this.state.hints = {};
      if (this.refs.mxgBox) {
         this.refs.mxgBox.clear();
      }
      
      this.setState({loading: false});
   }

   onClickSave = () => {
      var corp = this.state.corp;
      if(Common.formValidator(this, corp)){
         this.setState({loading: true});
         CorpActions.updateAuthCorp( corp );
      }
   }

   render() {
      var layout = 'vertical';
      var layoutItem = 'form-item-' + layout;
      // visible,label,required,check(有效性检查),options,readOnly,disabled,className,hint 等等
      var attrList = null;
      var items = FormDef.getAuthCorpForm(this, this.state.corp, attrList, null, layout);
      
      return (
         <Modal visible={this.state.modal} width='540px' title="修改公司" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
            footer={[
               <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                  <ServiceMsg ref='mxgBox' svcList={['auth-corp/update']} />
                  <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                  <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
               </div>
            ]}
         >
            <Form layout={layout}>
               {items}
            </Form>
         </Modal>
      );
   }
}

export default UpdateCorpPage;
