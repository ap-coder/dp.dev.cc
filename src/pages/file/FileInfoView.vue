<template>
  <div class="deliveryDetailDiv">
    <v-progress-linear height="3px"
                       v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
    <!--fileBox-->
    <div class="fileBox" v-show="!loading">
      <h4 v-if="showField(itemDetail, 'displayName')">{{`File Name: ${itemDetail.displayName}`}}</h4>
      <div class="con">
        <p>
          <span>{{`File Type: ${getDeliveryFileType(itemDetail.type)}`}}</span>
          <span v-if="showField(itemDetail, 'version')"><br/>{{ `Version: ${itemDetail.version}` }}</span>
          <span v-if="showField(itemDetail, 'fileDescription')"><br/>
                            License Key: <span id="LicenseKey">{{itemDetail.fileDescription}}</span>
            <!--                        <input id="LicenseKey" v-model="itemDetail.fileDescription" hidden>-->

                            <a v-if="showCopy(itemDetail)" style="margin-left: 10px;" target="#" class="blueBtn" @click.prevent="copyKey()">Copy Key</a>
                            <a v-if="showCopy(itemDetail)" href="#" target="_self" class="redBtn" @click.prevent="verifyKey(itemDetail)">Check Status</a>
                        </span>
          <span v-if="showField(itemDetail, 'customerId')"><br />{{`Customer ID: ${itemDetail.customerId}`}}</span>
<!--          <span v-if="showField(itemDetail, 'groupName')"><br />Share to: {{itemDetail.groupName}}</span>-->
          <span v-if="showField(itemDetail, 'createdDate')"><br />{{`Created Date: ${itemDetail.createdDate}`}}</span>
        </p>
      </div>
      <div class="con" v-if="message !==''">
        <span class="red--text">{{message}}</span>
        <div class="clear"></div>
      </div>
      <!--con-->
      <div class="con">
        <a class="deleteTxtBtn" v-if="showEdit" @click="deleteClick(itemDetail)">Delete</a>
        <!--                <a class="EditTxtBtn" v-if="showEdit" @click="editClick(itemDetail)">Edit</a>-->
        <a
            v-if="showField(itemDetail, 'originURL')"
            @click="downloadClick(itemDetail)"
            class="downloadTxtBtn">{{itemDetail.name === ''? itemDetail.displayName: itemDetail.name}}</a>
        <a v-if="showField(itemDetail, 'fileDescription')"
           @click="downloadText(itemDetail)"
           class="downloadTxtBtn">Download</a>
      </div>
      <!--con-->
    </div>
    <!--fileBox-->
    <div class="rowBtn">
      <a class="grayBtn" @click="back">Back</a>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import common from '@M/common';
import {CACHE_USER_KEY} from "@/utils/Constant";
// import Notification from "@/utils/notice_manager";
import {downloadTxtFile, getUserPermission, showCopyButton} from "@/utils/tools";
import Notification from "@U/notice_manager";

export default {
  name: "FileDetailView",
  mixins: [common],
  data() {
    return {
      message:'',
      itemDetail: {
        activations: 0,
        createdDate: '',
        customerId: '',
        displayName: '',
        expiredDate: '',
        fileDescription: '',
        fileId: '',
        filePath: null,
        isDelete: false,
        name: '',
        note: null,
        originURL: '',
        owner: '',
        shareGroup: '',
        size: 0,
        subType: -1,
        type: 2,
        updatedDate: '',
        url: null,
        version: ''
      },
      loading: false
    }
  },
  created(){
    this.loadData();
  },
  computed: {
    getCurrentPermission() {
      return getUserPermission('Files');
    },
    showEdit() {
      if (this.getCurrentPermission && this.getCurrentPermission.subItems.length) {
        return this.getCurrentPermission.subItems.find(feature => feature.featureId === 1).enable === true;
      }
      return false;
    },
    fields() {
      return {
        '-1': ['username','company','email','displayName','version', 'groupName', 'createdDate', 'originURL'],
        '0': ['username','company','email','displayName','expiredDate','version', 'createdDate', 'originURL'],
        '1': ['username','company','email','displayName','version', 'groupName', 'createdDate', 'originURL'],
        '2': ['username','company','email','displayName','version', 'groupName', 'customerId', 'fileDescription', 'expiredDate', 'createdDate'],
        '3': ['username','company','email','displayName','version', 'groupName', 'fileDescription', 'expiredDate', 'createdDate'],
        '4': ['username','company','email','displayName','version', 'groupName', 'fileDescription', 'expiredDate', 'createdDate'],
        '6': ['username','company','email','displayName','version', 'groupName', 'createdDate', 'originURL'],
        '7': ['username','company','email','displayName','version', 'groupName', 'createdDate', 'originURL'],
        '8': ['username','company','email','displayName', 'groupName', 'createdDate', 'originURL'],
        '9': ['username','company','email','displayName', 'groupName', 'createdDate', 'originURL']
      }
    },
  },
  methods: {
    ...mapActions([
      'getFileInfo',
      'deleteFile'
    ]),
    async loadData(){
      this.loading = true;

      const fileId = this.$route.query.id;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const res = await this.getFileInfo({
        token: this.getUserInfo.token ? this.getUserInfo.token : token ,
        fileId: fileId,
      });
      const result = res.data;

      if (result && result.data){
        if (result.statusCode === 0){
          this.itemDetail = result.data;
          this.loading = false;
          console.log(this.itemDetail);
        }
      } else {
        this.$router.back();
      }
    },
    getDeliveryFileType(key) {
      return this.deliveryFileTypes.find(item => item.key === key).text;
    },
    showField(item, key) {
      const { type } = item;
      if (this.fields[`${type}`]){
        return this.fields[`${type}`].indexOf(key) > -1;
      }
      return false;
    },
    downloadClick(item) {
      const { displayName, originURL } = item;
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = originURL;
      link.download = displayName;
      link.click();
    },
    downloadText(item) {
      const { displayName, fileDescription } = item;
      downloadTxtFile(`${displayName}.txt`, fileDescription);
    },
    deleteClick(edit) {
      this.showAlert({
        content: 'Are you sure delete this file?',
        confirmEvent: async () => {
          await this.deleteFileEvent(edit);
          this.hideAlert();
        }
      });
    },
    async deleteFileEvent(edit){
      console.log(`deleteFileEvent === ${JSON.stringify(edit)}`);
      const token = localStorage.getItem(CACHE_USER_KEY);
      const res = await this.deleteFile({
        token: this.getUserInfo.token ? this.getUserInfo.token : token,
        info: {
          fileId: edit.fileId,
          userId: edit.shareGroup,
        }
      });
      const result = res.data;
      this.hideDialog();
      if (result && result.data) {
        console.log(`delete result ${result}`);
        Notification.notifyObservers('refresh_files');
      }
    },
    editClick(item) {
      console.log(item);
      // Notification.notifyObservers('pushSubPath', {label: 'Edit'});
      // this.$router.push({ path:'/home/fileEdit', query:{ fileId: item.fileId } });
      this.showDialog({
        visible: true,
        component: 'FileEditView',
        id: item.fileId
      });
    },
    back(){
      this.$router.back();
    },
    showCopy(item){
      return showCopyButton(item);
    },
    copyKey() {
      const el = document.querySelector('#LicenseKey');
      const textArea = document.createElement("textarea");
      textArea.value = el.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();

      this.message = 'copied';
      setTimeout(()=>{
        this.message = '';
      }, 1000);
    },
    verifyKey(item){
      const { type } = item;
      const link = document.createElement('a');
      link.href = type === 3 ?
          'https://ems.tachyoniq.com/ems/customerLogin.html' :
          'https://quicklicensemanager.com/codecorp/QlmCustomerSite/qlmlicenseinfo.aspx';
      link.target = '_blank';
      link.click();
    },
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
