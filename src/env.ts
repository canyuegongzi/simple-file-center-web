// 生产环境
export const ENV = {
    domain: 'http://www.canyuegongzi.xyz',
    casDomain: 'http://www.canyuegongzi.xyz/user-login-cas-web', //cas服务
    wgmsBaseWeb: 'http://www.canyuegongzi.xyz/simple-file-center/v1.0',
    userDomain: 'http://www.canyuegongzi.xyz/simple-user-center/v1.0',//用户服务
    webHomePage: '/wgms-base-web', //cas跳转地址
    fileDomain: 'http://www.canyuegongzi.xyz/simple-file-center/v1.0', // 文件服务
    // fileDomain: 'http://127.0.0.1:8883/simple-file-center/v1.0', // 文件服务
    sysConfig: {}
 }
// @ts-ignore
window.FILEENV = ENV
