<style lang="stylus">
</style>
<template lang="pug">
    div(id="root-view")
        el-container(style="height: 100%")
            el-aside(width="200px" style="height: 100%" v-if="showMenus" :class="{absolute: /^\\/map/.test($route.path)}")
                Aside(:menus="menus")
            el-container()
                el-header#root-header(v-if="showMenus" :class="{absolute: /^\\/map/.test($route.path)}")
                    Header()
                el-main(style="padding: 0")
                    el-scrollbar(style="height:100%;" class="fpi-scroll")
                        router-view(id="root-main")
</template>
<script lang="ts">
  import "@/styles/app.styl";
  import "@/styles/yf.styl";
  import { Component, Vue } from 'vue-property-decorator';
  import Aside from '@/components/aside/Index.vue';
  import Header from '@/components/header/Index.vue';
  import {data} from "@/components/aside/nav";
  import {$post} from "@/utils/feth";
  import {MimeStorage} from "@/utils/localStorage";
  @Component({
    components: {
      Aside,
      Header,
    },
  })
  export default class App extends Vue {
    private token: any;
    public data() {
      return {
        menus: data.list,
      };
    }

    public get showMenus() {
      // @ts-ignore
      if (window.__POWERED_BY_QIANKUN__ !== undefined) {
        // @ts-ignore
        return !window.__POWERED_BY_QIANKUN__
      }
      // @ts-ignore
      return (!this.session$.hideMenus)
    }
    public async getUserInfo() {
      try {
        const res: any = await $post('/user/findUserToken', {token: this.token}, 'scus')
        Vue.prototype._user = res.data
      }catch (e) {
        console.log(e);
      }
    }
    private async created() {
      const mimeStorage = new MimeStorage();
      const token: any = mimeStorage.getItem('token');
      // @ts-ignore
      this.uploadImgApi = window['FILEENV'].fileDomain;
      this.token = token;
      await this.getUserInfo()

    }
  }
</script>
<style lang="stylus" scoped>
    .fade-enter-active .fade-leave-active
        transition opacity .5s
    .fade-enter .fade-leave-active
        opacity 0

    .transitionRouter-enter-active .transitionRouter-leave-active
        transition all 0.4s
    .transitionRouter-enter .transitionRouter-leave
        transform translate3d(100%, 0, 0)
</style>

