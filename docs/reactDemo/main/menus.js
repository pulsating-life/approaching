var Common = require('../../public/script/common');

function ModuleMenus(MenuCtx) {
	// 二级菜单
	this.demoMenus = [
		{
			name: '欢迎页面',
			to: '/reactDemo/demo/HelloPage/'
		}
    ];

	// 完整菜单，用于授权
	this.moduleMenus = [
		{
			name: '欢迎使用',
			to: '/reactDemo/demo/HelloPage/',
			path: '/reactDemo/demo/',
			nextMenus: this.demoMenus
		}
	]
}

module.exports = {
    menus: function() {
        return new ModuleMenus(this);
    }
}

