<template>
  <div class="PopupFrame">
    <div class="popTitle clearfix">
      <h1>{{dialogInfo.id === '' ? 'Add Contract':item.displayName}}
        <span class="mail"></span></h1><a class="btnClose" @click="cancel"></a>
    </div>
    <v-progress-linear height="3px"
                       v-show="loading && isEdit" color="#ad1f25" indeterminate></v-progress-linear>
    <div class="pop_content">
      <div class="rowDiv">
        <div class="rowDiv">
          <div class="tit">Contract Name</div>
          <div class="con">
            <span v-if="isSales">{{item.displayName}}</span>
            <input v-else type="text" class="textInput" v-model="item.displayName">
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">Version</div>
          <div class="con">
            <span v-if="isSales">{{item.version}}</span>
            <input v-else type="text" class="textInput" v-model="item.version">
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">Release Notes</div>
          <div class="con">
            <span v-if="isSales">{{item.note}}</span>
            <textarea v-else class="textInput" v-model="item.note"></textarea>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="!isSales">
          <div class="tit">Upload File <span v-if="uploadProgress > 0 && uploadProgress <= 100">{{uploadProgress}}%</span></div>
          <div class="con">
            <span v-if="item.file" class="filename">{{item.file.name}}</span>
            <a class="uploadTxtBtn" @click="chooseFile('file')">Upload</a>
            <input ref="file"
                   type="file" :name="item.uploadFieldName"
                   style="display: none;"
                   @change="handleFilesUpload()"
                   accept=".pdf" class="v-btn theme--light primary">
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="message !== ''">
          <span class="msg">{{message}}</span>
        </div>
      </div><!--rowLeft-->
      <div class="rowBtnDiv">
        <a class="redBtn" @click.prevent="upload" v-if="!isSales">
          <v-progress-circular color="#ffffff" indeterminate :size="28"
                               :width="2"
                               v-if="saveLoading" :value="20"></v-progress-circular>
          <span v-else>Upload & Save</span>
        </a>
        <a class="grayBtn" @click.prevent="cancel">Back</a>
      </div>

      <div class="rowDiv" v-if="item.originURL !== ''">
        <div class="rowDiv">
          <div class="tit">Preview Files</div>
          <div class="con">
            <div class="fileBox" >
              <iframe :src="item.originURL" width="100%" height="500px" style="border: 0px;"></iframe>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </div><!--rowRight-->
      <div class="clear"></div>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {CACHE_USER_KEY, ROLE_ID} from "@/utils/Constant";
import Notification from "@U/notice_manager";
import common from '@M/common';

export default {
  name: "ContractInfoView",
  mixins: [common],
  data(){
    return {
      item: null,
      defaultItem: {
        displayName: '',
        type: 10,
        subType: -1,
        version: '',
        shareGroup: '',
        note:'',
        uploadFieldName: 'photos',
        file: null,
        originURL: '',
      },
      message:'',
      saveLoading: false,
      saveMessage:'',
      fileURL: '',
      uploadProgress:0,
      loading: true
    };
  },
  created() {
    // 上傳進度
    Notification.addObserver('contractProgress', (uploadProgress)=>{
      this.uploadProgress = uploadProgress;
      console.log(`contractProgress == ${uploadProgress}`);
    });

    this.item = Object.assign({} , this.defaultItem);
    this.loadData();
  },
  computed:{
    ...mapGetters(['getUserInfo']),
    isEdit(){
      return this.$route.query.id !== '';
    },
    isSales(){
      return this.getUserInfo.role === ROLE_ID.SALES_ROLE_ID;
    }
  },
  methods:{
    ...mapActions(['uploadContract','getFileInfo']),
    async loadData() {
      // const fileId = this.$route.query.id;
      const fileId = this.dialogInfo.id;
      this.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const res = await this.getFileInfo({
        token: this.getUserInfo.token ? this.getUserInfo.token : token ,
        fileId: fileId,
      });
      const result = res.data;
      this.loading = false;
      if (result && result.data){
        if (result.statusCode === 0){
          this.item = result.data;
          console.log(`get contract file == ${JSON.stringify(this.item)}`);
        }
      }
    },
    checkUpload(){
      console.log(JSON.stringify(this.fileItems));
      let hasError = false;
      let errorMessage = '';
      console.log(`item ${JSON.stringify(this.item)}`);

      if (this.item.displayName === ''){
        hasError = true;
        errorMessage = 'Contract name is required';
        this.message = errorMessage;
        return false;
      }

      if (this.item.note.length > 1000){
        hasError = true;
        errorMessage = 'Release limit 1000 character';
        this.message = errorMessage;
        return false;
      }

      const file = this.item.file;
      if (file){
        const limit =  100 * 1024 * 1024; //100M
        console.log(`check file size ${file.size} > ${limit}`);
        if (file.size > limit){
          hasError = true;
          errorMessage = 'File too large';
          this.message = errorMessage;
          return false;
        }
      } else {
        // hasError = true;
        // errorMessage = 'File is required';
      }
      console.log(`hasError ${hasError}`)

      if (hasError){
        // this.message = 'Please fill in all fields';
        this.message = errorMessage;
        return false;
      }
      return  true;
    },
    chooseFile(){
      const ref = this.$refs.file;
      console.log(ref);
      // console.log(ref);
      ref.click();
    },
    handleFilesUpload(){
      console.log(`handleFilesUpload`);
      const ref = this.$refs.file;
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
      this.$refs.file.value = null;
      this.saveLoading = true;
      const formData = new FormData();
      const file = this.item.file;
      formData.append(`photos`, file);
      const info = Object.assign({}, this.item);
      info.owner = this.getUserInfo.userId;
      delete info.file;
      formData.append(`info`, JSON.stringify(info));
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.uploadContract({
        fileList: formData,
        token:this.getUserInfo ? this.getUserInfo.token : token
      }).then((response) => {
        console.log(`upload ... ${JSON.stringify(response)}`);
        this.saveLoading = false;
        const result = response.data;
        if (result.statusCode === 0) {
          console.log('上傳成功');
          this.message = 'Upload Complete';
          this.reset();
          setTimeout(()=>{
            Notification.notifyObservers('refresh_contract');
            this.cancel();
          }, 1000);
        } else {
          this.message = result.message;
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
      // this.$router.back();
      this.hideDialog();
    }
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
