
var corpStruct = '园区';	// 园区，多公司，单公司
var serviceIP = 'http://127.0.0.1:监听端口,package.json/';
var utilConf = {
	checkRole: false,	// 检查权限
	localDict: false,
	imageUrl: 'http://127.0.0.1:监听端口,package.json/assets',
	authUrl: serviceIP+'auth_s/',
	paramUrl: serviceIP+'param_s/',
	
	// 合并到主配置文件
	reactDemoUrl: serviceIP+'reactDemo_s/',
};

var commonConf = {
    // 公共变量
    resMode: false,
    
    corpStruct: corpStruct,
    campusUuid: 'nan',
    campusName: '无',
    corpUuid: '113K11A4B8R3L003',
    corpName: '无锡公司',
    
    // 公共变量
    authHome: (corpStruct === '园区') ? '/auth/CampusPage/' : ((corpStruct === '多公司') ? '/auth/CorpPage/' : '/auth/SysUserPage/'),
    uManHome: '/uman/UserPage/',
    reactDemoHome: '/reactDemo/demo/HelloPage/',

    iconAdd: 'plus',
    iconRefresh: 'sync',
    iconBack: 'rollback',
    iconUpdate: 'edit',
    iconRemove: 'delete',
    iconUser: 'user',
    iconAddChild: 'folder-add',
    iconDetail: 'bars',

    tableBorder: false,
    tableHeight: '510px',
    searchWidth: '180px',

    // 日期格式
    dateFormat: 'YYYY-MM-DD',
    monthFormat: 'YYYY-MM',

	// 标题
	removeTitle: '删除确认',
	removeOkText: '确定',
	removeCancelText: '取消',
};
