import Router from 'vue-router';
import { RouteItem } from '@/type/route';
import {Message} from 'element-ui';
import Storage from '@/utils/storage';
export const route = [
    {
      path: '/',
      redirect: {
        name: 'file-index',
      },
    },
    {
      path: '/fileManage/categoryList',
      name: 'category-index',
      component: () => import( './views/category/Index.vue'),
    },
    {
      path: '/fileManage/fileList',
      name: 'file-index',
      component: () => import('./views/file/Index.vue'),
    },
  ];

function beforeEach(to: { matched: { length: number; }; }, from: any, next: () => void) {
  if (to.matched.length > 0) {
    const location = window.location;
    const token: string =  Storage.localGet('token') || '';
    // if (!token) {
    //   const url = location.href;
    //     // @ts-ignore
    //   window.location.replace(window.ENV.domain + window.ENV.casDomain + '?redirectUrl=' + url);
    // } else {
    //   next();
    // }
    next();

  } else {
    Message.error('没有相应的权限，请联系管理员！');
  }
}

export const getRouter = (allMenus: RouteItem[]) => {
  const router = new Router({routes: route});
  router.beforeEach(beforeEach);
  return router;
};

