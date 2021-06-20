<template lang="pug">
    .container.mg0
        form-page-head(pageTitle="上传文件" :isShowButton="true" @goBack="goBack")
        el-form(:model="formInfo" :rules="formInfoRules" ref="form" label-width="150px" style="width: 900px; margin: 0 auto;margin-top: 32px" class="demo-ruleForm" size="mini")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="文件分类：" prop="categoryId")
                        treeselect(v-model="formInfo.categoryId" :normalizer="normalizer" label="name" children="children" value="id" :multiple="false" :options="cateTreeOptions" placeholder="请选择上级分类")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="存储类型：" prop="platform")
                        el-select(v-model="formInfo.platform" size="mini" style="width: 100%" @change="platformChange")
                            el-option(v-for="(item, index) in platformOptions" :value="item.value" :key="index" :label="item.label")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="文件：" prop="platform")
                        el-upload(
                            class="upload-demo"
                            ref="upload"
                            size="mini"
                            :action="uploadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            multiple
                            :data="{category: formInfo.categoryId, userName: formInfo.userName, token: token}"
                            :headers="{token: token}"
                            :file-list="formInfo.fileList"
                            :auto-upload="false"
                            :on-change="onChange"
                            :before-upload="beforeAvatarUpload"
                        )
                            el-button(slot="trigger" size="small" type="primary") 选取文件
                            div(slot="tip" class="el-upload__tip") 只能上传jpg/png文件，且不超过500kb
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    .footer
                        el-button(type="primary" size="mini" @click="okFun") 确认
                        el-button(size="mini") 取消
</template>

<script lang="ts">
import {MimeStorage} from "@/utils/localStorage";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
import { Loading } from 'element-ui';
import Rule from "@/type/Rule";
import BaseHeader from "@/components/table-page/BaseHeader.vue";
import BaseTable from "@/components/table-page/BaseTable.vue";
import {$get, $post} from "@/utils/feth";
import FormPageHead from "@/components/form/FormPageHead.vue";
import SelectOption from "@/type/SelectOption";
import {categoryApi, fileApi} from "@/api/api";
import {listToTree} from "@/utils/tree-data";
import CategoryInfo from "@/views/category/CategoryInfo";
@Component({
    components: {
        FormPageHead,
    },
})
export default class AddFile extends Vue {
    public formInfo = {
      categoryId : null,
      fileList: [],
      platform: 'Qiniu',
      userName: ''
    }
  private token: any;
  public uploadImgApi: string = '';
  public qiniuMultipleUrl: string = '';
  public diskMultipleUrl: string = '';
  private uploadUrl: string = '';
  private loadingInstance1: any;
  public normalizer(node:any) {
    return {
      id: node.id,
      label: node.name,
      children: node.children,
    }
  }
  public cateTreeOptions = []
  public organizationSelectOptions: SelectOption[] = [];
  public platformOptions = [
    {
      label: '七牛云',
      value: 'Qiniu'
    },
    {
      label: 'Disk',
      value: 'Disk'
    }
  ]
  public $refs!: {
    form: HTMLFormElement;
    form1: HTMLFormElement;
    upload: any;
  };
  public formInfoRules = {
    categoryId: [
      new Rule({message: '文件分类不能为空'}),
    ],
    platform: [
      new Rule({message: '存储平台不能为空'}),
    ],
  }
  /**
   * 获取全部的功能
   */
  public async getCategoryList() {
    const response: any = await $get(categoryApi.list.url, {
      page: 1,
      pageSize: 100000,
      name: "",
    });
    this.organizationSelectOptions =
      response.data && response.data.data
        ? this.dealCtegoryListData(response.data.data.data)
        : [];
    const treeData = response.data && response.data.data
      ? listToTree(response.data.data.data, 'id', 'parentId', 'children')
      : [];
    this.cateTreeOptions = treeData.length > 0 ? treeData[0].children ? treeData[0].children  : [] : []
    return false;
  }


  public platformChange(val: string) {
    this.uploadUrl =  val === 'Qiniu' ? this.qiniuMultipleUrl : val === 'Disk' ? this.diskMultipleUrl : ''
  }
  /**
   * 处理功能列表
   */
  private dealCtegoryListData(data: any) {
    const res = data.map((item: CategoryInfo) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    return res;
  }
  public goBack()  {
      this.$router.back()
  }
  beforeAvatarUpload (file: any) {
    const isLt2M = file.size / 1024 / 1024 < 5
    if (!isLt2M) {
      this.$message.error("上传文件大小不能超过 5MB!")
    }
    console.log(this.formInfo.fileList.length)
    return isLt2M
  }
  public handleRemove(file: any, fileList: any) {
    console.log(file, fileList);
  }

  public handlePreview(file:any){
    console.log(file)
  }

  /**
   * 文件选择 // 文件上传成功 // 文件上传失败
   * @param file {object}
   * @param fileList {Array}  选择的文件数组
   * @returns {boolean}
   */
  public onChange (file: any, fileList: any[]) {
    let num = 0
    for (let i = 0; i< fileList.length; i++) {
      if (fileList[i].status === 'success') {
        num ++
      }
    }
    if (fileList.length === num) {
      this.loadingInstance1.close()
      this.goBack()
      console.log(this.formInfo.fileList);
    }
  }

  public okFun() {
    let params: any;
    let api: string = "";
    api = this.formInfo.platform === 'Qiniu' ? fileApi.multipleQiniu.url : this.formInfo.platform === 'Disk' ? fileApi.multipleDisk.url : ''
    this.$refs.form.validate(async (valid: boolean) => {
    if (!valid) {
      return false;
    }
    if (!api) {
      return false
    }
    let isSubmit: boolean = true;
    if(this.$refs.upload.uploadFiles.length < 1) {
      this.$message('请选择文件')
      return false;
    }
    const listLength = this.$refs.upload.uploadFiles
    if (listLength.length > 3) {
      this.$message.error("最多只能选择3份附件!")
      return false
    }
    console.log(listLength)
    for (let i = 0; i< listLength.length; i++) {
      const isLt2M = listLength[i].size / 1024 / 1024 < 5
      if (!isLt2M) {
        isSubmit = false
        this.$message.error("上传文件大小不能超过 5MB!")
      }
    }
    if (isSubmit) {
      this.$refs.upload.submit();
      this.loadingInstance1 = Loading.service({ fullscreen: true, text: '文件上传中......' });
    }
    });
  }

  public async created() {
    const mimeStorage = new MimeStorage();
    const token: any = mimeStorage.getItem('token');
    // @ts-ignore
    this.uploadImgApi = window['FILEENV'].fileDomain;
    this.qiniuMultipleUrl = this.uploadImgApi + fileApi.multipleQiniu.url
    this.diskMultipleUrl = this.uploadImgApi + fileApi.multipleDisk.url
    this.platformChange('Qiniu')
    this.token = token;
    await this.getCategoryList()
    this.$nextTick(() =>{
      this.formInfo.userName = Vue.prototype._user.name
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
</style>
