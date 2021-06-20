<template lang="pug">
    .container
        base-header(title="文件列表" @editRow="editRow" :isShowTool="false" :isDelete="false" @deleteRow="deleteRow")
        base-table(:dataFormat="tableColumn"  :customTable="true" :allowDelete="false" :isAdd="false" :allowEdit="false" :allowIndex="true" :allowDeleteData="allowDeleteData" :tableData="tableData"  @editRow="editRow" @deleteRow="deleteRow" :handleSelectionChange="handleSelectionChange")
            .search-items(slot="table-tools")
                .search-item
                    el-input(v-model="query.queryStr" @blur="getData('search')"  @keyup.enter.native="getData('search')" placeholder="请输入名称搜索" size="mini" suffix-icon="el-icon-search")
                .search-item
                    el-tooltip(content="单文件上传接口仅用于非管理系统" placement="top" effect="light")
                        el-upload(class="upload-demo" :action="actionServer" disabled :show-file-list="false" :headers="{ignoretoken: true}" :on-change="onChangeFile" :before-upload="beforeAvatarUpload" size="mini")
                            el-button(size="mini" type="primary") Disk存储(单)
                    el-tooltip(content="单文件上传接口仅用于非管理系统" placement="top" effect="light")
                        el-upload(class="upload-demo" :action="actionQiNiu" disabled :show-file-list="false" :headers="{ignoretoken: true}" :on-change="onChangeFile" :before-upload="beforeAvatarUpload" size="mini" style="margin-left: 8px")
                            el-button(size="mini" type="primary") 七牛存储（单）
                    el-button(size="mini" type="primary" style="margin-left: 8px" @click="addFile") 上传文件
            .div(slot="custom-table")
                el-table(:data="tableData" border size="mini"  ref="dataTable" @selection-change="handleSelectionChange")
                    el-table-column(prop="index" label="序号" type="index" align="center" width="120")
                    el-table-column(prop="name" label="名称"  align="center")
                    el-table-column(prop="encoding" label="编码"  align="center")
                    el-table-column(prop="size" label="大小"  align="center")
                    el-table-column(prop="serverCategoryName" label="存储平台"  align="center")
                    el-table-column(prop="time" label="time"  align="center")
                    el-table-column(prop="serverCategoryName" label="存储平台"  align="center")
                    el-table-column(prop="url" label="链接"  align="center")
                        template( slot-scope="scope")
                            p(@click="seeFile(scope.row)") {{scope.row.url}}
                    el-table-column(label="操作"  align="center" width="180")
                        template( slot-scope="scope")
                            a(class="operate edit" @click="deleteRow(scope)") 删除
            el-pagination(slot="table-pagination" @size-change="handleSizeChange" :current-page.sync="currentPage"
            :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total")
        el-dialog(:visible.sync="isShowDialog" width="450px")
            el-image(:src="imageUrl" style="margin: 16px")
        el-dialog(:visible.sync="dialogVisible" @close="dialogClose" width="450px")
            span(slot="title") {{dialogTitle}}
            div(style="height: 370px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="tagInfo" :rules="tagInfoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-input(v-model="tagInfo.name" size="mini"  placeholder="请输入名称")
                        el-form-item(label="编码：" prop="code")
                            el-input(v-model="tagInfo.code" size="mini" :disabled="formEditFlag" placeholder="请输入编码")
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="tagInfo.desc" size="mini" placeholder="请输入描述" )
</template>

<script lang="ts">
    import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
    import BaseHeader from '@/components/table-page/BaseHeader.vue';
    import BaseTable from '@/components/table-page/BaseTable.vue';
    import { $post, $get } from "@/utils/feth";
    import { fileApi} from '@/api/api';
    import Rule from "@/type/Rule";
    import SelectOption from "@/type/SelectOption";
    import { confirmDelete, responseMsg } from "@/utils/response";
    import {listToTree} from '@/utils/tree-data';
    import FileInfo from "./FileInfo";
    import {MimeStorage} from "@/utils/localStorage";
    @Component({
        components: {
            BaseHeader,
            BaseTable,
        },
    })
    export default class File extends Vue {
        public tagInfoRules = {
            name: [new Rule({ message: "名称不能为空" })],
            code: [new Rule({ message: "编码不能为空" })],
            desc: [new Rule({ message: "描述不能为空" })],
        };
        public $refs!: {
            form: HTMLFormElement;
            form1: HTMLFormElement;
        };
        public isShowDialog: boolean = false;
        public imageUrl: string = ''
        public tableColumn = [
            { prop: "name", label: "名称", width: 180 },
            { prop: "encoding", label: "编码", width: 60 },
            { prop: "size", label: "大小" },
            { prop: "serverCategoryName", label: "存储平台"},
            { prop: "time", label: "时间"},
            { prop: "url", label: "链接"},
        ];
        public tagInfo = new FileInfo();
        public tableData = [];
        public currentPage: number = 1;
        public selectedRow: Array<number | string> = [];
        public pageSize: number = 10;
        public total: number = 0;
        public pageTitle: string = "新增";
        public query: any = {
            queryStr: "",
        };
        public dialogVisible: boolean = false;
        public dialogChartAuth: boolean = false;
        public dialogUserVisible: boolean = false;
        public dialogTitle: string = "新增标签";
        public formEditFlag: boolean = false;
        public organizationSelectOptions: SelectOption[] = [];
        public categoryId: any = "";
        public authTreeData: any = [];
        public actionServer: string = ''
        public actionQiNiu: string = ''
        private token: any;
        @Watch("currentPage", { deep: true, immediate: false })
        public currentPageChange(val: any, oldVal: any) {
            this.getData();
        }
        public editRow(data: any) {
            this.dialogVisible = true;
            this.dialogTitle = data != "editRow" ? "编辑标签" : "新增标签";
            if (data != "editRow") {
                this.categoryId = data.row.id;
                this.formEditFlag = true;
                this.geTagInfo();
            }
        }

        public deleteRow(data: any) {
            const ids = data == "deleteRow" ? this.selectedRow : [data.row.id];
            if (ids.length < 1 || ids === null) {
                this.$message({
                    message: "请先选择要删除的数据！",
                    type: "warning",
                });
                return false;
            }
            if (data.row.serverCategory === 0) {
              confirmDelete(fileApi.delete.url, this.getData, { id: ids[0],  isDelFile: 1});
            }else if (data.row.serverCategory === 1){
              confirmDelete(fileApi.deleteQiniu.url, this.getData, { id: ids[0],  isDelFile: 1});
            }

        }

        public isShowImage(url: string) {
          //获取最后一个.的位置
          const index= url.lastIndexOf(".");
          const ext = url.substr(index+1);
          return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1
        }

        /**
         * 查看文件
         */
        public seeFile(scope: any) {
            if (this.isShowImage(scope.url)) {
              this.isShowDialog = true
              this.imageUrl = scope.url
            }else {
              this.$confirm(`是否下载 ${scope.name} ？`, "下载提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info"
              }).then(() => {
                let a = document.createElement('a')
                a.href = scope.url
                a.download = scope.name
                a.click()
              })
            }
        }
        /**
         * 当前行是否可删除
         * @param row {object}
         * @returns {boolean}
         */
        public allowDeleteData(row: any) {
            return true;
        }

        /**
         * 多选
         * @param val
         * @returns {string}
         */
        public handleSelectionChange(val: any) {
            const selectedIds: Array<string | number> = [];
            for (let i = 0; i < val.length; i++) {
                selectedIds.push(val[i].id);
            }
            this.selectedRow = selectedIds;
            return selectedIds.join(",");
        }

        public beforeAvatarUpload(file: any) {
          console.log(file)
          const res = /.*[\u4e00-\u9fa5]+.*$/.test(file.name)
          if (res) {
            this.$message.error('文件名不能包含中文')
            return false
          }
          return true
        }
      /**
       * 文件选择 // 文件上传成功 // 文件上传失败
       * @param file {object}
       * @param fileList {Array}  选择的文件数组
       * @returns {boolean}
       */
      public onChangeFile (file: any, fileList: any) {
        if (file.status == "success") {
          if (file.response) {
            this.$message.success('文件上传成功')
            this.getData()
          }else {
            this.$message.error('文件上传失败')
          }
        }
      }
      /**
         * 获取数据
         * @param flag
         */
        public async getData(flag?: string) {
            if (flag == "search") {
                this.currentPage = 1;
            }
            const response: any = await $get(fileApi.list.url, {
                page: this.currentPage,
                pageSize: this.pageSize,
                name: this.query.queryStr,
            });
            this.total = (response.data && response.data.count) || 0;
            this.tableData =
                response.data && response.data.data ? response.data.data : [];
            this.tableData.forEach((item: any) => {
                item.editFlag = 1;
                item.serverCategoryName = item.serverCategory ===1 ? "七牛云": "Disk";
            });
            const totalPageNumber = Math.ceil(this.total / this.pageSize);
            if (totalPageNumber < this.currentPage && this.total !== 0) {
                this.currentPage = totalPageNumber;
                this.getData();
            } else if (this.total === 0) {
                this.currentPage = 1;
            }
            return false;
        }

        /**
         * pageSize修改
         * @param val
         */
        public handleSizeChange(val: number) {
            this.pageSize = val;
            this.getData();
            return false;
        }

        /**
         * 弹窗关闭
         */
        private dialogClose() {
            this.dialogVisible = false;
            this.dialogChartAuth = false;
            this.dialogUserVisible = false;
            this.categoryId = "";
            this.formEditFlag = false;
            this.tagInfo = new FileInfo();
        }

        /**
         * 弹窗取消
         */
        private cancelFun() {
            this.dialogVisible = false;
            this.categoryId = "";
            this.formEditFlag = false;
            this.dialogUserVisible = false;
            this.tagInfo = new FileInfo();
            this.getData();
        }

        /**
         * 文件上传
         */
        public addFile() {
          this.$router.push({
            path: '/fileManage/AddFile'
          })
          console.log(444)
        }
        /**
         * 获取标签info
         */
        private async geTagInfo() {
            const res: any = await $get(fileApi.info.url, { id: this.categoryId });
            const tag: any =
                res.data && res.data.data ? res.data.data : new FileInfo();
            this.tagInfo = {
                name: tag.name,
                desc: tag.desc,
                code: tag.code,
            };
            this.formEditFlag = true;
        }

        private async created() {
          const mimeStorage = new MimeStorage();
          const token: any = mimeStorage.getItem('token');
          // @ts-ignore
          this.actionQiNiu = window['FILEENV'].fileDomain + fileApi.qiniu.url;
          // @ts-ignore
          this.actionServer = window['FILEENV'].fileDomain + fileApi.disk.url;
          this.token = token;
          await this.getData();
        }
    }
</script>

<style lang="stylus" scoped>
    .options
        >>>.el-input
            .el-input__inner
                height 28px !important
</style>

