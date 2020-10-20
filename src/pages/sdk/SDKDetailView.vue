<template>
    <div class="PopupFrame">
        <div class="popTitle clearfix">
        <h1>{{ item.displayName }}<span class="mail"></span></h1><a class="btnClose" @click="cancel"></a>
        </div>
        <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="pop_content">
            <div class="deliveryDetailDiv">
                <div class="fileBox" v-if="isEdit === true" >
                    <h4>{{`SKU Name: ${item.displayName}`}}</h4>
                    <div class="con">
                        <p>
                            <span>{{`Type: ${(getType(item))}`}}</span><br/>
                            <span>{{`Visibility: ${getVisibilityText(item)}`}}</span><br/>
                            <span>{{`Version: ${item.version}`}}</span><br/>
                            <span>{{`Description: ${item.note}`}}</span><br/>
                            <span>{{`Updated Date: ${formatDateText(item.updatedDate)}`}}</span>
                        </p>
                    </div>
                </div>
                <div class="rowLeft" v-if="isEdit === false" >
                    <div class="rowDiv">
                        <div class="tit">SKU Name</div>
                        <div class="con">
                            <input type="text" class="textInput" v-if="isEdit === false" v-model="item.displayName">
                            <span v-else>{{item.displayName}}</span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">Type</div>
                        <div class="con">
                            <select class="select" v-if="isEdit === false" v-model="item.type">
                                <option
                                        v-for="option in fileTypes"
                                        :key="option.key"
                                        :value="option.key">{{option.text}}</option>
                            </select>
                            <span v-else>{{fileTypes.find(option=>option.key === item.type).text}}</span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">Version</div>
                        <div class="con">
                            <input type="text" class="textInput" v-if="isEdit === false" v-model="item.version">
                            <span v-else>{{item.displayName}}</span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">Description</div>
                        <div class="con">
                            <quill-editor v-if="isEdit === false"
                                    ref="QuillEditor"
                                    v-model="item.note"
                                    :options="editorOption"
                                    @blur="onEditorBlur($event)"
                                    @focus="onEditorFocus($event)"
                                    @ready="onEditorReady($event)"
                            />
                            <div v-else v-html="item.note"></div>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">Author</div>
                        <div class="con">
                            <input type="text" class="textInput" v-if="isEdit === false" :disabled="true"
                                v-model="getUserInfo.account">
                            <span v-else>{{item.ownerName}}</span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv" v-if="isEdit === false">
                        <div class="tit">Upload File</div>
                        <div class="con">
                            <span v-if="item.file" class="filename">{{item.file.name}}</span>
                            <span v-if="!item.file && item.name" class="filename">{{item.name}}</span>
                            <a :href="`#${currentPath}`" target="_self" class="uploadTxtBtn" @click="chooseFile('file')">Upload</a>
                            <input ref="file"
                                type="file" :name="item.uploadFieldName"
                                style="visibility: hidden; margin: 0; height: 1px"
                                @change="handleFilesUpload()"
                                accept="*" class="v-btn theme--light primary">
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv mt-2" v-if="message !==''">
                        <span class="red--text">{{message}}</span>
                        <div class="clear"></div>
                    </div>
                </div><!--rowLeft-->
                <div class="rowBtn">
                    <a href="#" class="redBtn" v-if="isEdit === false" @click.prevent="upload">
                        <v-progress-circular color="#ffffff" indeterminate :size="28"
                                            :width="2"
                                            v-if="saveLoading" :value="20"></v-progress-circular>
                        <span v-else>Save</span>
                    </a>
                    <v-btn :class="'red'" dark v-if="isEdit === true && item.originURL"
                        @click="downloadEvent()">Download</v-btn>
                    <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>
                    <a class="deleteTxtBtn" style="float: right;" v-if="isEdit && showEdit" @click="deleteClick(item)">Delete</a>
                </div>
            </div><!--usersAddDiv-->
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import common from '@M/common';
    import {CACHE_USER_KEY} from "@/utils/Constant";
    import { quillEditor } from 'vue-quill-editor'
    import Notification from "@U/notice_manager";
    import * as Tools from "@U/tools";
    export default {
        name: "SDKDetailView",
        mixins: [common],
        components:{
            quillEditor
        },
        data(){
          return {
              item: null,
              defaultItem: {
                  displayName: '',
                  type:-1,
                  version: '',
                  note:'',
                  uploadFieldName: 'photos',
                  file: null,
                  enterprise: false,
              },
              message:'',
              loading: false,
              saveLoading: false,
              saveMessage:'',
              shareMessage:'',
              info: null,
              shareUsers:[],
              editorOption: {
              },
          };
        },
        created() {
            this.item = Object.assign({} , this.defaultItem);
            this.loadData();
        },
        computed:{
            ...mapGetters(['getUserInfo']),
            getCurrentPermission(){
              return Tools.getUserPermission('SKUs');
            },
            showEdit(){
              if (this.getCurrentPermission && this.getCurrentPermission.subItems.length){
                return this.getCurrentPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
              }
              return false;
            },
            isEdit(){
                return this.dialogInfo.id !== '';
            },
            currentPath() {
                return this.$route.fullPath;
            },
            editor() {
                return this.$refs.QuillEditor.quill
            },
        },
        methods:{
            ...mapActions(['uploadSDK','getSDKInfo','saveSDKMap','deleteSDK']),
            getType(item){
              console.log(`find type ${JSON.stringify(item)}`);
              const find = this.deliveryFileTypes.find(option=>option.key === item.type);
              return find ? find.text : '--';
            },
            getVisibilityText(item) {
              if (item.visibility === 0){
                return 'Private';
              } else if (item.visibility === 1){
                return 'Public';
              } else if (item.visibility === 2){
                return 'Protected';
              } else {
                return '--';
              }
            },
            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady(quill) {
                console.log('editor ready!', quill);
                this.editor.container.style.height = '300px';
            },
            handleShareClear(){
                this.saveMessage = '';
            },
            async handleShareGroup(item){
                console.log(`handleShareGroup == ${JSON.stringify(item)}`);
                this.shareUsers = item.isGroup ? [item.items] : item.items;
            },
            async loadData() {
                const fileId = this.dialogInfo.id;
                if (!fileId || fileId === ''){
                    return;
                }
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                const res = await this.getSDKInfo({
                    token: this.getUserInfo.token ? this.getUserInfo.token : token ,
                    fileId: fileId,
                });
                const result = res.data;
                this.loading = false;

                if (result && result.data){
                    if (result.statusCode === 0){
                        this.item = result.data;
                        console.log(`get sdk file ==`, this.item);
                    }
                }
            },
            checkUpload(){
                console.log(JSON.stringify(this.fileItems));
                let hasError = false;
                const file = this.item.file;
                if (file){
                    const limit =  100 * 1024 * 1024;
                    if (file.size > limit){
                        hasError = true;
                        this.message = 'File too large';
                    }
                } else {
                    if (this.item.type === -1){
                        hasError = true;
                        this.message = 'Select Type';
                    } else if (!this.item.file){
                        hasError = true;
                        this.message = 'File is required';
                    } else if (this.item.displayName === ''){
                        hasError = true;
                        this.message = 'File name is required';
                    } else if (this.item.note.length > 1000){
                        hasError = true;
                        this.message = 'Release limit 1000 character';
                    } else if (this.shareUsers.length === 0){
                        hasError = true;
                        this.message = 'Share Users is required';
                    }
                }
                console.log(`失敗 ${hasError} / ${this.message}`);
                if (hasError && this.message === ''){
                    this.message = 'Please fill in all fields';
                    return false;
                }
                return  true;
            },
            chooseFile(){
                const ref = this.$refs['file'];
                ref.click();
            },
            handleFilesUpload(){
                const ref = this.$refs['file'];

                this.message = '';
                const file = ref.files[0];
                this.$set(this.item, 'file', file);
            },
            upload() {
                if (!this.checkUpload()){
                    return;
                }
                this.saveLoading = true;
                const formData = new FormData();
                const file = this.item.file;
                formData.append(`photos`, file);
                this.info = Object.assign({}, this.item);
                this.info.owner = this.getUserInfo.userId;
                this.info.shareUsers = this.shareUsers;
                delete this.info.file;
                formData.append(`info`, JSON.stringify(this.info));
                const token = localStorage.getItem(CACHE_USER_KEY);
                this.loading = true;
                this.uploadSDK({
                    fileList: formData,
                    token:this.getUserInfo ? this.getUserInfo.token : token }).then((response) => {
                    this.saveLoading = false;
                    if (response.status === 200) {
                        console.log('上傳成功');
                        this.message = 'Upload Complete';
                        this.loading = false;
                        this.reset();
                        // this.cancel();
                    }
                }).catch(e=>{
                    this.saveLoading = false;
                    this.message = 'Upload Error';
                    console.log(`上傳失敗 ${e}`);
                });
            },
            reset(){
                this.item = Object.assign({}, this.defaultItem);
                this.selectMessage = '';
                setTimeout(()=>{
                    this.message = '';
                }, 2000);
            },
            cancel(){
                this.hideDialog();
            },
            downloadEvent(){
                const link = document.createElement('a');
                link.href = this.item.originURL;
                link.download = this.item.fileName;
                link.click();
            },
            deleteClick(item){
              this.item.token = this.getUserInfo.token;
              this.showAlert({
                content: 'Are you sure delete this sku?',
                confirmEvent: async () => {
                  this.hideAlert();
                  await this.deleteSDK(item);
                  this.hideDialog();
                  Notification.notifyObservers('sku_refresh');
                }
              });
              this.toTop();
            },
        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
