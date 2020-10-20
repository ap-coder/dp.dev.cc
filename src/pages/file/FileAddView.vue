<template>
    <div class="PopupFrame" >
        <div class="popTitle clearfix">
        <h1>Add File<span class="mail"></span></h1><a class="btnClose" @click="cancel"></a>
        </div>
        <div class="pop_content">
            <div class="deliveryAddDiv">
                <div class="rowTop">
<!--                <h4>Users</h4>-->
                <div class="con">
                    <share-group-view
                        :message="shareMessage"
                        :enable-share-all="false"
                        :show-radio-button="true"
                        :show-notice="true"
                        :show-save-button="false"
                        :enable-multi-select="false"
                        :is-file="true"
                        @changeRadio="changeShareType"
                        @save="handleShareGroup"
                        @clear="handleShareClear"></share-group-view>
                </div>
                </div><!--rowTop-->
                <div class="rowBottom">
<!--                <h4>Add File</h4>-->
                <div
                    v-for="(item, i) in fileItems" :key="i"
                    class="fileBox">
                    <h4>
<!--                    #{{ 9 > i ? `0${i + 1}` : i + 1 }}-->
                    <a target="_self" class="delete3Btn" v-if="i" @click.prevent="deleteFile(i)"></a>
                    </h4>
                    <div class="tit">File Type</div>
                    <div class="con">
                    <v-radio-group v-model="item.radioGroup" row @change="changeType(item)">
                        <v-radio label="SKU File" color="#ad1f25"
                                value="0"
                        ></v-radio>
                        <v-radio label="Other File" color="#ad1f25"
                                value="1"
                        ></v-radio>
                    </v-radio-group>
                    </div>
                    <template v-if="item.radioGroup === '0'">
                    <div class="searchBar">
                        <select class="select" :style="{width: isMobile ? '100%':'380px'}" v-model="skuList[i].searchValue"
                                @change="selectedSKUItem(i)">
                          <option v-for="item in skuResult.list" :key="item.fileId"
                                  :value="item.fileId">({{getFileType(item.type)}}) {{item.displayName}} {{getVersion(item.version)}}
                          </option>
                        </select>
                    </div><!--searchBar-->
                    </template>
                    <template v-if="showField(i, item, 'customerId')">
                    <div class="clear"></div>
                    <div class="tit"><span class="red--text">*</span>Customer ID</div>
                    <div class="con">
                        <input placeholder="Customer ID" class="textInput" v-model="item.customerId">
                    </div><!--con-->
                    </template>
                    <template v-if="showField(i, item, 'expiredDate') && item.radioGroup === '0'">
                    <div class="clear"></div>
                    <div class="tit">Expired Date</div>
                    <div class="con">
                        <v-menu
                            ref="menu"
                            v-model="item.menu"
                            :nudge-right="40"
                            :return-value="item.expiredDate"
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px">
                        <template v-slot:activator="{ on }">
                            <input placeholder="2020-05-28" class="textInput" v-model="item.expiredDate" v-on="on">
                        </template>
                        <v-date-picker
                            v-model="item.expiredDate"
                            header-color="#ad1f25"
                            color="#ad1f25"
                            no-title scrollable>
                        </v-date-picker>
                        </v-menu>
                    </div><!--con-->
                    </template>
                    <template v-if="showField(i, item, 'fileDescription') && item.radioGroup === '0'">
                    <div class="tit"><span class="red--text">*</span>License Key</div>
                    <div class="con">
                        <textarea id="LicenseKey" type="text" placeholder="License Key" class="textInput"
                                  rows="5"
                                  style="width: 400px"
                                  v-if="item.selectType === 2" v-model="item.fileDescription"></textarea>
                        <input id="LicenseKey" type="text" placeholder="License Key" class="textInput"
                               v-else
                            v-model="item.fileDescription">
                        <a target="_self" class="blueBtn" v-if="isCustomer" @click="copyKey(item)">Copy Key</a>
                        <a target="_self" class="redBtn" v-if="isCustomer" @click="verifyKey(item)">Verify</a>
                    </div><!--con-->
                    <div class="clear"></div>
                    </template>
                    <template v-if="item.radioGroup === '1'">
                    <div class="tit">Upload File</div>
                    <div class="con">
                        <span class="filename" v-if="item.file">{{ item.file.name }}</span>
                        <a target="_self" class="uploadTxtBtn" @click.prevent="chooseFile('file_'+i)">Upload</a>
                        <input :ref="'file_'+i"
                            type="file"
                            :name="item.uploadFieldName"
                            style="visibility: hidden; margin: 0; height: 1px"
                            @change="handleFilesUpload(i)"
                            accept="*" class="v-btn theme--light primary">
                    </div>
                    <div class="clear"></div>
                    </template>
                    <span class="msg" v-if="item.message">{{ item.message }}</span>
                </div><!--fileBox-->
<!--                <div class="fileBox">-->
<!--                    <a target="_self" class="blueBtn" @click.prevent="addMoreFile">Add More File</a>-->
<!--                </div>&lt;!&ndash;fileBox&ndash;&gt;-->
                </div>
                <div class="rowDiv">
                <span v-if="uploadProgress > 0 && uploadProgress <= 100">Upload progress: {{uploadProgress}}%</span>
                </div>
                <div class="clear"></div>
                <div class="rowBtn">
                <a @click.prevent="upload" class="redBtn">
                    <v-progress-circular
                        color="#ffffff"
                        indeterminate
                        :size="28"
                        :width="2"
                        v-if="saveLoading"
                        :value="20"></v-progress-circular>
                    <span v-else>Save</span>
                </a>
                <a class="grayBtn" @click="cancel">Back</a>
                </div>
            </div><!--usersAddDiv-->
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {getNowDate} from '@/utils/tools';
import ShareGroupView from "@/components/view/ShareGroupView";
import Notification from "@/utils/notice_manager";
import common from '@M/common';
import {CACHE_USER_KEY, ROLE_ID, DELIVERY_FILE_TYPE} from "@/utils/Constant";

export default {
  name: "FileDetailView",
  mixins: [common],
  components: {
    ShareGroupView
  },
  data() {
    return {
      uploadProgress:0,
      selectGroup: null,
      shareToUserGroup: false,
      selectUserName: '',
      search: null,
      checkBox: false,
      searchLoading: false,
      valid: false,
      fileItems: [],
      message: '',
      selectMessage: '',
      shareMessage: '',
      itemDetail: null,
      defaultItem: {
        radioGroup: '0',
        fileId: '',
        fileName: '',
        displayName: '',
        customerId: '',
        owner: '',
        shareGroup: null,
        selectType: -1,
        selectSubType: -1,
        expiredDate: getNowDate(),
        version: '',
        fileDescription: '',
        menu: false,
        uploadFieldName: 'photos',
        file: null,
        message: '',
        activations: 0,
        skuId: '',
      },
      searchResult: {
        item: null,
        loading: false,
        results: [],
      },
      saveLoading: false,
      verifyLoading: false,
      verifyMessage: '',
      saveMessage: '',
      soracoURL: 'https://quicklicensemanager.com/codecorp/QlmCustomerSite/qlmlicenseinfo.aspx',
      skuResult: {
        pageIndex: 1,
        limit: 1000,
        loading: false,
        list: [],
        filter: '',
        sortBy: 'createdDate',
        sortByValue: 'desc'
      },
      skuList: [],
    };
  },
  watch: {
    radioGroup() {
      // console.log(`radioGroup ${val}`);
      // this.groupList = [];
      this.searchResult.results = [];
      this.selectUserName = '';
    },
    // async search(val) {
    //   this.selectMessage = '';
    //   // Items have already been loaded
    //   // if (this.groupList && this.groupList.length > 0) return;
    //
    //   // Items have already been requested
    //   if (this.searchLoading) return;
    //
    //   this.searchLoading = true;
    //
    //   if (this.radioGroup === '0') {
    //     const results = await this.getCustomerList({
    //       token: this.getUserInfo.token,
    //       query: {
    //         searchValue: '',
    //         sortBy: 'registeredDate',
    //         sortValue: 'DESC',
    //         pageIndex: 1, limit: 1000
    //       }
    //     });
    //     const res = results.data.data;
    //     this.$set(this.searchResult, 'results', res.list);
    //   } else {
    //     const results = await this.getGroupList({
    //       token: this.getUserInfo.token,
    //       searchValue: val,
    //       pageIndex: 1, limit: 10,
    //     });
    //     const res = results.data;
    //     if (res) {
    //       // this.groupList = res.data;
    //       this.searchResult.result = res.data.list;
    //     }
    //   }
    //   this.searchLoading = false;
    // }
  },
  created() {
    // 上傳進度
    Notification.addObserver('fileProgress', (uploadProgress)=>{
      this.uploadProgress = uploadProgress;
    });


    if (this.fileItems.length === 0) {
      const newFile = Object.assign({}, this.defaultItem);
      this.fileItems.push(newFile);
      this.skuList.push({
        searchValue: '',
        selectSKU: '',
      });
    }
    this.loadSKUData('');
    console.log(this.$route.query.id);
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    edkTypes() {
      return [
        {key: -1, text: 'Select a EDK Library'},
        {key: 0, text: 'CortexDecoder For Android'},
        {key: 1, text: 'CortexDecoder For iOS'},
        {key: 2, text: 'CortexDecoder For Windows M'},
      ];
    },
    fields() {
      return {
        '-1': ['customerId', 'fileDescription'],
        '0': ['selectSubType'],
        '1': ['displayName', 'file'],
        '2': ['displayName', 'fileDescription', 'customerId', 'expiredDate', 'file'], //EDK
        '3': ['displayName', 'fileDescription', 'expiredDate'], // gem
        '4': ['displayName', 'fileDescription', 'expiredDate'], //so
        '6': ['displayName', 'file'],
        '7': ['displayName', 'file'],
        '8': ['file'],
        '9': ['file'], // other file
      }
    },
    fieldsError() {
      return {
        customerId: {error: 'Customer Id is required'},
        fileDescription: {error: 'License Key is required'},
        selectSubType: {error: 'Select SubType'},
        displayName: {error: 'File name is required'},
        file: {error: 'File too large'}
      }
    },
    isCustomer() {
      return this.getUserInfo.role === ROLE_ID.CUSTOMER_ROLE_ID;
    }
  },
  methods: {
    ...mapActions(['uploadFile', 'getGroupList', 'getCustomerList', 'verifyFileKey', 'getSDKList']),
    getVersion(version){
      if (version) {
        return `v${version}`;
      }
      return '';
    },
    getFileType(type){
      return DELIVERY_FILE_TYPE.find(item=>item.key === type).text;
    },
    changeShareType(type) {
      console.log(`changeShareType == ${type}`);
      if (type === '-1' || type === -1){
        this.selectGroup = type;
      }
    },
    async loadSKUData(searchValue) {
      console.log(`=== getSDKList ===`, this.getUserInfo);
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.skuResult.loading = true;
      const res = await this.getSDKList({
        token: (this.getUserInfo && this.getUserInfo.token) ? this.getUserInfo.token : token,
        searchValue: searchValue,
        filter: '',
        pageIndex: this.skuResult.pageIndex,
        limit: this.skuResult.limit,
        sortBy: this.skuResult.sortBy,
        sortByValue: this.skuResult.sortByValue,
      });

      if (res) {
        const results = res.data.data;
        // public 的過濾
        this.skuResult.list = results.list.filter(sku=>sku.visibility === 2);
        const first = this.skuResult.list[0];
        console.log(`first ${JSON.stringify(first)}`);

        this.skuList[0].searchValue = first.fileId;
        this.skuList[0].selectSKU = first;

        this.fileItems[0].selectType = first.type;
      }
      this.skuResult.loading = false;
    },
    showField(i, item, key) {
      let type = item.selectType;
      // console.log(`type1 ${type}`);
      if (this.skuList[i].selectSKU) {
        type = this.skuList[i].selectSKU.type;
      }
      // console.log(`selectSKU ${JSON.stringify(this.skuList[i].selectSKU)}`);
      // console.log(`type2 ${type}`);
      return this.fields[`${type}`].indexOf(key) > -1;
    },
    cancel() {
      this.hideDialog();
    },
    handleShareClear() {
      this.saveMessage = '';
    },
    handleShareGroup(user) {
      console.log(`handleShareGroup == ${JSON.stringify(user)}`);
      this.shareMessage = '';

      if (user.isGroup) {
        const item = user.group;
        this.selectGroup = item.groupId;
      } else {
        const item = user.items[0];
        this.selectGroup = item.userId;
      }
      console.log(`shareGroup == ${this.selectGroup}`);
      this.shareToUserGroup = user.shareToGroupUser;
      console.log(`shareToGroupUser == ${this.shareToGroupUser}`);
    },
    addMoreFile() {
      const newFile = Object.assign({}, this.defaultItem);
      const first = this.fileItems[0];
      if (first && this.fileItems.length < 10) {
        // newFile.selectType = 1;
        this.fileItems.push(newFile);
        this.skuList.push({
          searchValue: '',
          selectSKU: '',
        });

        const index = this.skuList.length-1;
        const first = this.skuResult.list[0];
        console.log(`addMoreFile ${index}, SKU ${JSON.stringify(first)}`);

        this.skuList[index].searchValue = first.fileId;
        this.skuList[index].selectSKU = first;

      }
    },
    deleteFile(i) {
      this.fileItems.splice(i, 1);
      this.skuList.splice(i, 1);
    },
    checkUpload() {
      let hasError = false;

      this.message = '';
      if (!this.selectGroup || this.selectGroup === '') {
        console.log(`selectGroup ${this.selectGroup}`);
        this.message = 'Please fill in all fields';
        this.shareMessage = 'Customer or Group is required';
        return false;
      }

      this.fileItems.forEach((item, i) => {
        // const {selectType} = item;
        let selectType = item.selectType;
        if (item.radioGroup === '1'){ // other file
          selectType = 9;
        }
        console.log(`selectType === ${selectType}`);

        const checkFields = this.fields[`${selectType}`];
        item.message = ''
        if (checkFields.length) {

          for (let loop = 0; loop < checkFields.length; loop++) {
            const filedKey = checkFields[loop];
            const isCheck = !!this.fieldsError[filedKey];
            // const value = item[filedKey];
            const value = this.skuList[i].searchValue;
            console.log(`searchValue == ${filedKey}, ${value}`);

            if (isCheck) {
              const errorMes = this.fieldsError[filedKey].error;
              const file = item.file;
              const limit = 100 * 1024 * 1024;
              const customerId = item.customerId;
              const fileDescription = item.fileDescription = item.fileDescription.replace(/\s*/g, "");

              switch (filedKey) {
                  // case 'selectSubType':
                  //     (value < 0) && (item.message = errorMes);
                  //     break;
                case 'displayName':
                  !value && (item.message = errorMes);
                  break;
                case 'file':
                  if (file) {
                    console.log(`check file size ${file.size} > ${limit}`);
                    if (file.size > limit) {
                      item.message = errorMes;
                    }
                  }
                  break;
                case 'customerId':
                  if(!customerId) {
                    item.message = errorMes;
                  }
                  break;
                case 'fileDescription':
                  if(!fileDescription) {
                    item.message = errorMes;
                  }
                  break;
              }
            }

            if (item.message) {
              hasError = true;
            }
          }
        }
      });

      console.log(`error ${this.message}`);

      if (hasError) {
        return false;
      }
      return true;
    },
    chooseFile(key) {
      const ref = this.$refs[key];
      ref[0].click();
    },
    handleFilesUpload(i) {
      const ref = this.$refs['file_' + i];
      this.message = '';
      const file = ref[0].files[0];
      this.fileItems[i].message = '';
      this.fileItems[i].file = file;
    },
    upload() {
      if (!this.checkUpload()) {
        return;
      }
      this.saveLoading = true;
      const formData = new FormData();
      let i = 0;
      for (let item of this.fileItems) {
        const file = item.file;
        console.log(`upload file === ${JSON.stringify(file)}`);
        formData.append(`photos[${i}]`, file);
        const info = Object.assign({}, item);
        info.shareToGroupUser = this.shareToUserGroup ? this.shareToUserGroup : false;
        info.selectType = item.radioGroup === '1' ? 9 : info.selectType;
        info.displayName = item.radioGroup === '0' ? this.skuList[i].selectSKU.displayName : file.name;
        info.owner = this.getUserInfo.userId;
        info.shareGroup = this.selectGroup;
        info.skuId = item.radioGroup === '1' ? '': (this.skuList[i].selectSKU ? this.skuList[i].selectSKU.fileId : '');
        delete info.file;
        formData.append(`info_${i}`, JSON.stringify(info));
        i += 1;
      }
      this.uploadFile({
        fileList: formData,
        token: this.getUserInfo.token
      }).then((response) => {
        console.log(`upload ... ${JSON.stringify(response)}`);
        this.saveLoading = false;
        if (response.status === 200) {
          console.log('上傳成功');
          this.message = 'Upload Complete';
          if (this.$router.currentRoute.path.indexOf('home/files') > -1){
            Notification.notifyObservers('refresh_files');
          }
          if (this.$router.currentRoute.path.indexOf('userDetail') > -1){
            Notification.notifyObservers('refresh_user_files');
          }

          this.reset();
          this.cancel();
        }
      }).catch(e => {
        this.saveLoading = false;
        this.message = 'Upload Error';
        console.log(`上傳失敗 ${e}`);
      });
    },
    reset() {
      this.fileItems = [];
      const newFile = Object.assign({}, this.defaultItem);
      this.fileItems.push(newFile);
      this.radioGroup = '0';
      this.selectUserName = '';
      this.groupList = [];
      this.selectGroup = null;
      this.selectMessage = '';
      setTimeout(() => {
        this.message = '';
      }, 2000);
    },
    verifyKey(item) {
      const {selectType} = item;
      const link = document.createElement('a');
      link.href = selectType === 3 ?
          'https://ems.tachyoniq.com/ems/customerLogin.html' :
          'https://quicklicensemanager.com/codecorp/QlmCustomerSite/qlmlicenseinfo.aspx';
      link.target = '_blank';
      link.click();
    },
    copyKey(item) {
      const el = document.querySelector('#LicenseKey');

      el.select();
      document.execCommand('copy');
      item.message = 'copied';
    },
    keyUpEvent() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // this.search = this.selectUser.account;
        this.search = this.selectUserName;
      }, 0.5 * 1000);
    },
    selectedSearchResult(item) {
      this.selectUser = item;

      if (this.radioGroup === '0') {
        this.selectUserName = item.account;
      } else if (this.radioGroup === '1') {
        this.selectUserName = item.name;
      }
      this.searchResult.results = [];
      this.handleShareGroup(item);
    },
    searchSKU(i) {
      const searchValue = this.skuList[i].searchValue;
      this.loadSKUData(searchValue);
    },
    resetSearch(i) {
      this.skuList[i].selectSKU = null;
      this.skuList[i].searchValue = '';
      this.skuResult.list = [];
    },
    selectedSKUItem(i) {
      const find = this.skuResult.list.find(file => file.fileId === this.skuList[i].searchValue);

      this.skuList[i].selectSKU = find;
      this.fileItems[i].selectType = find.type;
      // console.log(`select ${JSON.stringify(this.skuList[i])}`);
    },
    changeType(item){
      console.log(`changeType ${item.radioGroup}`);
      if (item.radioGroup === '0') {
        this.loadSKUData('');
      } else {
        item.selectType = -1;
      }
    }
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
