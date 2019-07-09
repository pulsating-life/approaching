'use strict';

var Reflux = require('reflux');
var ConfTaskActions = require('../action/ConfTaskActions');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');

var ConfTaskStore = Reflux.createStore({
	listenables: [ConfTaskActions],
	
	filter: {},
	recordSet: [],
	object: {},
	startPage : 0,
	pageRow : 0,
	totalRow : 0,
	
	init: function() {
	},
	getServiceUrl: function(action)
	{
		return Utils.paramUrl+action;
	},
	fireEvent: function(operation, errMsg, self)
	{
		self.trigger({
			filter: self.filter,
			recordSet: self.recordSet,
			object: self.object,
			startPage: self.startPage,
			pageRow: self.pageRow,
			totalRow: self.totalRow,
			operation: operation,
			errMsg: errMsg
		});

		MsgActions.showError('conf_task', operation, errMsg);
	},
	
	// 增加定时器配置信息
	onCreateConfTask: function(confTask) {
		var url = this.getServiceUrl('conf-task/create');
		Utils.recordCreate(this, confTask, url);
	},

	// 修改定时器配置信息
	onUpdateConfTask: function(confTask) {
		var url = this.getServiceUrl('conf-task/update');
		Utils.recordUpdate(this, confTask, url);
	},

	// 删除定时器配置信息
	onDeleteConfTask: function(uuid) {
		var url = this.getServiceUrl('conf-task/remove');
		Utils.recordDelete(this, uuid, url);
	},

	// 查询定时器配置信息
	onRetrieveConfTask: function(filter) {
		var self = this;
		var url = this.getServiceUrl('conf-task/retrieve');
		Utils.doRetrieve(url, filter, 0, 0, 0).then(function(result) {
			self.recordSet = result.list;
			self.startPage = result.startPage;
			self.pageRow = result.pageRow;
			self.totalRow = result.totalRow;
			self.filter = Utils.clone(filter);
			self.fireEvent('retrieve', '', self);
		},
		function(errMsg){
			self.fireEvent('retrieve', errMsg, self);
		});
	},

	// 查询定时器配置信息
	onInitConfTask: function(filter) {
		if( this.recordSet.length > 0 ){
			if( Utils.compareTo(this.filter, filter) ){
				this.fireEvent('retrieve', '', this);
				return;
			}
		}
		
		this.onRetrieveConfTask(filter);
	}
});

module.exports = ConfTaskStore;
