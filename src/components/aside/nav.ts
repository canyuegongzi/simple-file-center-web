export const data = {
  list: [
    {
      entity: {
        id: 6,
        parentMenuId: 0,
        name: "fileManage",
        icon: "el-icon-news",
        alias: "文件系统",
        state: "ENABLE",
        sort: 1,
        value: null,
        type: "NONE",
        discription: "用于文件系统的菜单",
        createUserId: 1,
      },
      childs: [
        {
          entity: {
            id: 7,
            parentMenuId: 6,
            name: "/fileManage/categoryList",
            icon: "el-icon-user\r\n",
            alias: "文件分类",
            state: "ENABLE",
            sort: 0,
            value: "http://canyuegongzi.xyz/simple-file-center-web/#/fileManage/categoryList?hideMenus=true",
            type: "NONE",
            discription: "用于文件分类管理的菜单",
            createUserId: 1,
          },
        },
        {
          entity: {
            id: 10,
            parentMenuId: 9,
            name: "/fileManage/fileList",
            icon: "el-icon-s-tools\n\r\n",
            alias: "文件列表",
            state: "ENABLE",
            sort: 0,
            value: "http://canyuegongzi.xyz/simple-file-center-web/#/fileManage/fileList?hideMenus=true",
            type: "NONE",
            discription: "标签中心",
            createUserId: 1,
          },
        },


      ],
    },
  ],
};
