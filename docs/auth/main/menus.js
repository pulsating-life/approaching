var Common = require('../../public/script/common');

function ModuleMenus(MenuCtx) {
    //APP和服务
    this.appPrivMenu = [
        /*{
            name: '应用识别规则',
            to: '/auth2/MatchPage/'
        },*/
        {
            name: '模块管理',
            to: '/auth2/ModulePage/'
        },
        {
            name: '资源管理',
            to: '/auth2/ResPage/'
        },
        {
            name: '原子功能',
            to: '/auth2/TxnPage/'
        },
        {
            name: '功能组织',
            to: '/auth2/FuncPage/'
        },
        {
            name: '角色管理',
            to: '/auth2/RolePage/'
        },
        /*{
            name: '角色组管理',
            to: '/auth2/RolesPage/'
        },
        {
            name: '菜单配置',
            to: '/auth2/MenuPage/'
        },*/
        {
            name: '返回',
            to: '/auth/AppPage/',
            icon: 'rollback'
        }
    ];
    this.appMenus = [
        {
            name: '服务管理',
            to: '/auth/AppPage/',
            nextMenus: this.appPrivMenu
        },
        {
            name: 'APP管理',
            to: '/auth/FntAppPage/'
        },
        {
            name: '刷新权限',
            to: '/auth/LoadRedisPage/'
        }
    ];

    // 参数和模板
    this.paramMenus = [
        {
            name: '模板管理',
            to: '/param/ModelPage/'
        },
        {
            name: 'UI参数维护',
            to: '/param/UiParamPage/'
        },
        {
            name: '定时器管理',
            to: '/param/ConfTaskTablePage/'
        }
    ];

    //完整菜单，用于授权
    this.moduleMenus = [
        {
            name: 'APP和服务',
            to: '/auth/AppPage/',
            path: '/auth/',
            nextMenus: this.appMenus
        },
        {
            name: '模板和参数',
            to: '/param/ModelPage/',
            path: '/param/param/',
            nextMenus: this.paramMenus
        }
    ]

    if (Common.corpStruct === '园区') {
        this.moduleMenus.unshift(
            {
                name: '公司和园区',
                to: '/auth/CampusPage/'
            }
        );
    }
    else if (Common.corpStruct === '多公司') {
        this.moduleMenus.unshift(
            {
                name: '公司管理',
                to: '/auth/CorpPage/'
            }
        );
    }
    else if (Common.corpStruct === '单公司') {
        this.moduleMenus.unshift(
            {
                name: '系统管理员',
                to: '/auth/SysUserPage/'
            }
        );
    }

}

module.exports = {
    menus: function () {
        return new ModuleMenus(this);
    }
}

