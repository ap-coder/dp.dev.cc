<template>
  <div class="deliveryDetailDiv">
    <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
    <div class="fileBox" v-if="isEdit === true" >
      <h4>{{`SKU Name: ${item.displayName}`}}</h4>
      <div class="con">
        <p>
          <span>{{`Type: ${fileTypes.find(option=>option.key === item.type).text}`}}</span><br/>
          <span>{{`Visibility: ${getVisibilityText(item)}`}}</span><br/>
          <span>{{`Version: ${item.displayName}`}}</span><br/>
          <span>{{`Description: ${item.note}`}}</span><br/>
          <!--                    <span>{{`Author: ${item.ownerName}`}}</span><br/>-->
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
          <!--                    <textarea class="textInput" v-model="item.note"></textarea>-->
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
      <!--            <div class="rowDiv" v-if="isEdit === false">-->
      <!--                <div class="tit">Share User & Groups</div>-->
      <!--                <share-group-view-->
      <!--                        :message="shareMessage"-->
      <!--                        :show-radio-button="true"-->
      <!--                        :show-notice="true"-->
      <!--                        :show-save-button="false"-->
      <!--                        :enable-multi-select="true"-->
      <!--                        @save="handleShareGroup"-->
      <!--                        @clear="handleShareClear"></share-group-view>-->
      <!--            </div>-->
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
    </div>
  </div><!--usersAddDiv-->
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {CACHE_USER_KEY} from "@/utils/Constant";
// import ShareGroupView from "@/components/view/ShareGroupView";
import Notification from "@/utils/notice_manager";
import { quillEditor } from 'vue-quill-editor'
export default {
  name: "SDKInfoView",
  components:{
    // ShareGroupView,
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

    console.log(`isEdit ${this.isEdit}`);
  },
  computed:{
    ...mapGetters(['getUserInfo']),
    isEdit(){
      return this.$route.query.id !== '';
    },
    currentPath() {
      return this.$route.fullPath;
    },
    editor() {
      return this.$refs.QuillEditor.quill
    },
  },
  methods:{
    ...mapActions(['uploadSDK','getSDKInfo','saveSDKMap']),
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
      console.log(`item ${JSON.stringify(this.item)}`);
      const file = this.item.file;
      if (file){
        const limit =  100 * 1024 * 1024;
        console.log(`check file size ${file.size} > ${limit}`);
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
      console.log(ref);
      ref.click();
    },
    handleFilesUpload(){
      console.log(`handleFilesUpload`);
      const ref = this.$refs['file'];
      console.log(ref);

      this.message = '';
      const file = ref.files[0];
      console.log(file);
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
      console.log(`upload info... ${JSON.stringify(this.info)}`);
      formData.append(`info`, JSON.stringify(this.info));
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loading = true;
      this.uploadSDK({
        fileList: formData,
        token:this.getUserInfo ? this.getUserInfo.token : token }).then((response) => {
        console.log(`upload ... ${JSON.stringify(response)}`);
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
      Notification.notifyObservers('popSubPath');
      this.$router.back();
    },
    downloadEvent(){
      console.log(`url ${this.item.originURL}`);
      const link = document.createElement('a');
      link.href = this.item.originURL;
      link.download = this.item.fileName;
      link.click();
    },
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
