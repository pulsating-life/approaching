﻿var Reflux = require('reflux');
var UserGroupActions = require('../action/UserGroupActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var UserGroupStore = Reflux.createStore({
	listenables: [UserGroupActions],
	
	corpUuid: '',
	recordSet: [],
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.authUrl+action;
	},
	
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			compUser: self.compUser,
			corpUuid: self.corpUuid,
			recordSet: self.recordSet,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('user-group', operation, errMsg);
	},
	
	onRetrieveUserGroup: function(corpUuid,compUser) {
		var self = this;
		var filter = {};
		filter.corpUuid = corpUuid;
		var url = this.getServiceUrl('user-group/retrieve');
		Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
			if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
				self.recordSet = result.object.list;
				self.startPage = result.object.startPage;
				self.pageRow = result.object.pageRow;
				self.totalRow = result.object.totalRow;
				self.corpUuid = corpUuid;
				
				self.fireEvent('retrieve', '', self);
			}
			else{
				self.fireEvent('retrieve', "处理错误["+result.errCode+"]["+result.errDesc+"]", self);
			}
		}, function(value){
			self.fireEvent('retrieve', "调用服务错误", self);
		});
	},
	
	onRetrieveUserGroupPage: function(corpUuid, startPage, pageRow) {
		this.startPage = startPage;
		this.pageRow = pageRow;
		this.onRetrieveUserGroup( corpUuid );
	},
	
	onInitUserGroup: function(corpUuid) {
		if( this.recordSet.length > 0 ){
			if( this.corpUuid === corpUuid ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveUserGroup(corpUuid);
	},
	
	onCreateUserGroup: function(userGroup) {
		var url = this.getServiceUrl('user-group/create');
		Utils.recordCreate(this, userGroup, url);
	},
	
	onUpdateUserGroup: function(userGroup) {
		var url = this.getServiceUrl('user-group/update');
		Utils.recordUpdate(this, userGroup, url);
	},
	
	onDeleteUserGroup: function(uuid) {
		var url = this.getServiceUrl('user-group/remove');
		Utils.recordDelete(this, uuid, url);
	},
});

module.exports = UserGroupStore;

