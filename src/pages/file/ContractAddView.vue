<template>
  <div class="PopupFrame" >
    <div class="popTitle clearfix">
      <h1>Add Contract<span class="mail"></span></h1><a class="btnClose" @click="cancel"></a>
    </div>
    <div class="pop_content">
      <div class="deliveryAddDiv" style="height: 200px;">
        <div class="rowTop">
          <h4>Users</h4>
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
            <h4>Add Contract</h4>
            <select class="select ml-2 mb-2" v-model="selectedContract">
              <option key="-1" :value="-1">Choose Contract</option>
              <option v-for="option in contractList" :key="option.key"
                      :value="option.fileId">{{ option.displayName }}, {{option.version ? option.version: '--'}}
              </option>
            </select>

          </div><!--fileBox-->
        </div>
        <div class="rowDiv">
          <span class="msg" v-if="message">{{ message }}</span>
        </div>
        <div class="clear"></div>
        <div class="rowBtn">
          <a @click.prevent="shareEvent" class="redBtn">
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
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import ShareGroupView from "@/components/view/ShareGroupView";
import Notification from "@/utils/notice_manager";
import common from '@M/common';
import {CACHE_USER_KEY, ROLE_ID, DELIVERY_FILE_TYPE} from "@/utils/Constant";

export default {
  name: "ContractAddView",
  mixins: [common],
  components: {
    ShareGroupView
  },
  data() {
    return {
      contractList: [],
      selectedContract: null,
      uploadProgress:0,
      selectGroup: null,
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
    };
  },
  watch: {
    radioGroup() {
      this.searchResult.results = [];
      this.selectUserName = '';
    },
  },
  created() {
    // 上傳進度
    Notification.addObserver('fileProgress', (uploadProgress)=>{
      this.uploadProgress = uploadProgress;
    });

    this.loadContractData();
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
        '9': ['file'],
        '10': ['file'],
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
    ...mapActions(['uploadFile', 'getGroupList', 'getCustomerList', 'shareContract', 'getContractList']),
    async loadContractData() {

      const token = localStorage.getItem(CACHE_USER_KEY);
      let res;
      res = await this.getContractList({
        token: token ? token : this.getUserInfo.token,
        sortBy:'',
        sortByValue:'',
        searchValue: '',
        filter: '',
        pageIndex: -1,
        limit: -1
      });
      console.log(`=== getContractList === `, res.data);
      if (res) {
        const results = res.data;
        this.contractList = results.data.list;
      }
    },
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
    },
    deleteFile(i) {
      this.fileItems.splice(i, 1);
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
    async shareEvent() {
      console.log(`shareSelectedContract ${this.selectGroup} ${this.selectedContract}`)
      if (this.selectedContract === -1) {
        return;
      }

      this.saveLoading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const result = await this.shareContract({
        token: token ? token : this.getUserInfo.token,
        info: {
          userId: this.selectGroup,
          fileId: this.selectedContract
        }
      });
      this.saveLoading = false;
      if (result && result.data.statusCode === 0) {
        this.message = 'Share contract successfully';
        console.log(`save ${result.data.message}`);
        setTimeout(() => {
          this.message = '';
          this.hideDialog();
          Notification.notifyObservers('refresh_contract');
        }, 1000);
      } else {
        this.message = result ? result.data.message : 'Share Error';
        setTimeout(() => {
          this.message = '';
        }, 1000);
      }
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
    keyUpEvent() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // this.search = this.selectUser.account;
        this.search = this.selectUserName;
      }, 0.5 * 1000);
    },
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
