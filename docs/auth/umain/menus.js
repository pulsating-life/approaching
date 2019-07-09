var Common = require('../../public/script/common');

function ModuleMenus(MenuCtx)
{
    // 用户管理
    this.umanMenus = [
        {
            name: '用户组管理',
            to: '/uman/UserGroupPage/'
        },
        {
            name: '用户管理',
            to: '/uman/UserPage/'
        },
        {
            name: '权限管理',
            to: '/uman/CorpAppPage/'
        }
    ];

    if (Common.userDept === 'Y') {
        this.umanMenus.unshift(
            {
                name: '机构维护',
                to: '/uman/DeptPage/'
            }
        );
    }

    // 完整菜单，用于授权
    this.moduleMenus = [];

    if (Common.userDept === 'Y') {
        this.moduleMenus.push(
            {
                name: '用户管理',
                to: '/uman/DeptPage/',
                path: '/uman',
                nextMenus: this.umanMenus,
            }
        );
    }
    else {
        this.moduleMenus.push(
            {
                name: '用户管理',
                to: '/uman/UserPage/',
                path: '/uman',
                nextMenus: this.umanMenus,
            }
        );
    }
}


module.exports = {
    menus: function() {
        return new ModuleMenus(this);
    }
}
