'use strict';

var Reflux = require('reflux');

var ConfTaskActions = Reflux.createActions([
	'createConfTask',
	'updateConfTask',
	'deleteConfTask',
	'retrieveConfTask',
	'initConfTask'
]);

module.exports = ConfTaskActions;
