declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module 'qs' {
  const qs: any;
  export default qs;
}
declare module '$post' {
  import {$post} from '@/utils/feth';
  export default $post;
}
declare module '$get' {
  import {$get} from '@/utils/feth';
  export default $get;
}

declare module '$Message' {
  export const $Message: any;
}

declare module '$Modal' {
  export const $Modal: any;
}

declare module '$router' {
  export const $router: any;
}
declare module '@riophae/vue-treeselect' {
  export const Treeselect: any;
}
