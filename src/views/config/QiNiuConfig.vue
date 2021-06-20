<template lang="pug">
    .container.mg0
        form-page-head(:pageTitle="pageTitle" :isShowButton="false" @goBack="goBack")
        el-form(:model="qiNiuConfigInfo" :rules="qiNiuConfigInfoRules" :disabled="isShow" ref="form" label-width="150px" class="demo-ruleForm" size="mini")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="accessKey：" prop="accessKey")
                        el-input(v-model="qiNiuConfigInfo.accessKey" size="mini" type="password" placeholder="请输入accessKey")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="secretKey：" prop="secretKey")
                        el-input(v-model="qiNiuConfigInfo.secretKey" size="mini" type="password" placeholder="请输入secretKey")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="bucket：" prop="bucket")
                        el-input(v-model="qiNiuConfigInfo.bucket" size="mini" placeholder="请输入bucket")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="expires：" prop="expires")
                        el-input(v-model="qiNiuConfigInfo.expires" size="mini" placeholder="请输入expires")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="persistentNotifyUrl：" prop="persistentNotifyUrl")
                        el-input(v-model="qiNiuConfigInfo.persistentNotifyUrl" size="mini" placeholder="请输入persistentNotifyUrl")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="scope：" prop="scope")
                        el-input(v-model="qiNiuConfigInfo.scope" size="mini" placeholder="请输入scope")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="origin：" prop="origin")
                        el-input(v-model="qiNiuConfigInfo.origin" size="mini" placeholder="请输入origin")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    .footer
                        el-button(type="primary" @click="okFun" size="mini" :disabled="isShow") 确定
</template>

<script lang="ts">
  import {MimeStorage} from "@/utils/localStorage";
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  import Rule from "@/type/Rule";
  import {$get, $post} from "@/utils/feth";
  import {categoryApi, qiNiuConfigApi} from "@/api/api";
  import QiNiuConfigInfo from "@/views/config/QiNiuConfigInfo";
  import BaseHeader from "@/components/table-page/BaseHeader.vue";
  import BaseTable from "@/components/table-page/BaseTable.vue";
  import FormPageHead from "@/components/form/FormPageHead.vue";
  @Component({
    components: {
      BaseHeader,
      BaseTable,
      FormPageHead,
    },
  })
  export default class QiNiuConfig extends Vue {
    public qiNiuConfigInfo: QiNiuConfigInfo = new QiNiuConfigInfo();
    public productAttrList = []
    private token: any;
    private id: string | (string | null)[] = '';
    private attrType: string | (string | null)[] = ''
    public currentRow: any;
    public pageTitle: string = '添加品牌';
    public uploadImgApi: string = '';
    public qiNiuConfigInfoRules = {
      accessKey: [
        new Rule({message: 'accessKey不能为空'}),
      ],
      secretKey: [
        new Rule({message: 'secretKey不能为空'}),
      ],
      scope: [
        new Rule({message: 'scope不能为空', trigger: 'change'}),
      ],
      bucket: [
        new Rule({message: 'bucket不能为空', trigger: 'change'}),
      ],
      expires: [
        new Rule({message: 'expires不能为空', trigger: 'change'}),
        {
          pattern: /(^[1-9]\d*$)/,
          message: '必须为正整数',
          trigger: 'blur'
        },
      ],
      persistentNotifyUrl: [
        new Rule({message: '排序不能为空'})
      ],
    };
    public $refs!: {
      form: HTMLFormElement,
      form1: HTMLFormElement,
    };
    public formInfo: QiNiuConfigInfo = new QiNiuConfigInfo();
    public query: any = {
      queryStr:  '',
    };
    private isShow: boolean = true;

    public goBack()  {
      this.$router.back()
    }

    /**
     * 弹窗取消
     */
    private cancelFun() {
      this.$refs.form.resetFields();
      this.qiNiuConfigInfo = new QiNiuConfigInfo()
      this.getQiNiuConfigInfo()

    }
    /**
     * 属性添加
     */
    private async okFun() {
      let params: any;
      let api: string = "";
      if (this.pageTitle.indexOf("修改") > -1) {
        params = { ...this.qiNiuConfigInfo };
        params.expires = Number( params.expires)
        api = qiNiuConfigApi.edit.url;
      }
      this.$refs.form.validate(async (valid: boolean) => {
        if (!valid) {
          return false;
        }
        const res: any = await $post(api, params);
        if (res.success) {
          this.$message({
            message: this.pageTitle + "成功！",
            type: "success",
            center: true,
          });
          this.cancelFun()
        }
      });
    }

    /**
     * 获取属性详情
     * @param id
     */
    public async getQiNiuConfigInfo() {
      try {
        const res:any = await $get(qiNiuConfigApi.info.url, {}) as QiNiuConfigInfo;
        const info = res.data ? res.data as QiNiuConfigInfo : new QiNiuConfigInfo()
        this.qiNiuConfigInfo = info
      }catch (e) {
        this.qiNiuConfigInfo = new QiNiuConfigInfo();
      }
    }

    /**
     * 初始化组件的详情
     */
    public async initAttrInfoValue() {
      this.pageTitle = this.id ? '修改配置': '修改配置'
      this.getQiNiuConfigInfo()
    }

    private created() {
      const mimeStorage = new MimeStorage();
      const token: any = mimeStorage.getItem('token');
      // @ts-ignore
      this.uploadImgApi = window['FILEENV'].fileDomain;
      this.token = token;
      this.initAttrInfoValue()
      this.$nextTick(() =>{
        console.log(Vue.prototype._user.name)
        this.isShow = !(Vue.prototype._user.name && Vue.prototype._user.name === 'root')
      })

    }
  }
</script>

<style scoped lang="stylus">
    .footer
        justify-content center
        display flex
        margin-top 32px
        margin-bottom 32px
    .avatar-uploader
        width 120px
        height 120px
        >>>.el-upload
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 120px;
            font-size: 28px;
</style>
