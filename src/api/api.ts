export const categoryApi = {
  add: {
    method: 'post',
    url: '/category/add',
  },
  addUser: {
    method: 'post',
    url: '/category/add',
  },
  update: {
    method: 'update',
    url: '/category/update',
  },
  delete: {
    method: 'delete',
    url: '/category/delete',
  },
  info: {
    method: 'get',
    url: '/category/info',
  },
  list: {
    method: 'get',
    url: '/category/list',
  },
  tree: {
    method: 'get',
    url: '/category/categoryTree',
  },
};
export const fileApi = {
  qiniu: {
    method: 'post',
    url: '/qiniu/uploadQiniu'
  },
  disk: {
    method: 'post',
    url: '/upload/add'
  },
  multipleQiniu: {
    method: 'post',
    url: '/qiniu/multipleQiniu'
  },
  multipleDisk: {
    method: 'post',
    url: '/upload/multipleDisk'
  },
  add: {
    method: 'post',
    url: '/file/add',
  },
  update: {
    method: 'update',
    url: '/file/update',
  },
  delete: {
    method: 'delete',
    url: '/file/delete',
  },
  deleteQiniu: {
    method: 'delete',
    url: '/qiniu/deleteFile',
  },
  info: {
    method: 'get',
    url: '/file/info',
  },
  list: {
    method: 'get',
    url: '/file/list',
  },
  all: {
    method: 'get',
    url: '/file/all',
  },
};

export const qiNiuConfigApi = {
  info: {
    method: 'get',
    url: '/file/config',
  },
  edit: {
    method: 'post',
    url: '/file/editConfig',
  },
}

