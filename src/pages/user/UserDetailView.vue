<template>
  <div class="rowDiv">
    <div class="usersDiv" v-if="isEdit">
      <div class="userNameBox">
        <h6>{{`${itemDetail.firstName || '-'} ${itemDetail.lastName || '-'}`}}
          <a target="_self" :class="`${canEditUser ? 'EditTxtBtn': 'ViewTxtBtn'} editUser_PopWd`" @click="editHandle"></a>
<!--          <a class="delete2Btn" style="float: right;" @click.prevent="deleteUser"></a>-->
        </h6>
        <span class="mail">{{itemDetail.email}}</span>
      </div>
      <ul class="userUl">
        <!-- <li><a href="#" id="tab_user" class="now" @click.prevent="changeTab(-1)">User Detail</a></li> -->
        <li><a href="#" id="tab_file" class="now" @click.prevent="changeTab(0)">Files</a></li>
        <!--                <li><a href="#" id="tab_group" @click.prevent="changeTab(1)">Groups</a></li>-->
        <li><a href="#" id="tab_contract" @click.prevent="changeTab(2)">Contracts</a></li>
        <div class="clear"></div>
      </ul>
      <div v-if="tab === -1">
        <profile-content v-if="itemDetail"
                         :user-profile="itemDetail"
                         :errorMessage="message"
                         :saveLoading="saveLoading"
                         :isEdit="isEdit"
                         @saveEvent="saveEvent"
                         @cancelEvent="cancelEvent">

        </profile-content>
      </div>
      <div v-else-if="tab === 0">
        <div class="usersContent">
          <div class="functionBar">
            <select class="select" v-model="userFile.filter" @change="changeFileType">
              <option v-for="option in fileTypeList" :key="option.key"
                      :value="option.key">{{ option.text }}
              </option>
            </select>
            <a target="_self" class="blueBtn" v-if="canEditFile" @click="addFiles">Add File</a>
            <div class="clear"></div>
          </div>
          <table-view
              :column-keys="columnKeys"
              :loading="userFile.loading"
              :items="userFile.list"
              :header="userFile.header"
              :canEdit="true"
              @changePage="changePage"
              @cellEvent="cellEvent"></table-view>
        </div>
      </div>
      <div v-else-if="tab === 1">
        <div class="usersContent">
          <table-view
              :column-keys="groupColumnKeys"
              :loading="userGroup.loading"
              :items="userGroup.list"
              :header="userGroup.header"
              @changePage="changePage"
              @cellEvent="cellEvent"></table-view>
        </div>
      </div>
      <div v-else-if="tab === 2">
        <div class="usersContent">
          <div class="functionBar" v-if="isContractModify">
            <select class="select" v-model="selectedContract">
              <option key="-1" :value="-1">Choose Contract</option>
              <option v-for="option in contractList" :key="option.key"
                      :value="option.fileId">{{ option.displayName }}, {{option.version ? option.version: '--'}}
              </option>
            </select>
            <a target="_self" class="blueBtn" style="float: none" @click="shareSelectedContract">
              <v-progress-circular color="#ffffff" indeterminate :size="28"
                                   :width="2"
                                   v-if="shareContractloading" :value="20"></v-progress-circular>
              <span>Add Contract</span>
            </a>
            <div class="clear"></div>
          </div>
          <div class="rowDiv">
            <span class="msg" v-if="message">{{ message }}</span>
            <div class="clear"></div>
          </div>
          <table-view
              :column-keys="contractColumnKeys"
              :loading="userContract.loading"
              :items="userContract.list"
              :header="userContract.header"
              :canEdit="true"
              @changePage="changePage"
              @cellEvent="cellEvent"></table-view>
        </div>
      </div>
    </div>
    <div v-else>
      <profile-content v-if="itemDetail"
                       :user-profile="itemDetail"
                       :errorMessage="message"
                       :saveLoading="saveLoading"
                       :isEdit="isEdit"
                       @saveEvent="saveEvent"
                       @cancelEvent="cancelEvent">

      </profile-content>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import ProfileContent from '@/components/view/ProfileContent';
import Notification from "@U/notice_manager";
import {CACHE_USER_KEY, DELIVERY_FILE_TYPE, ROLE_ID} from "@/utils/Constant";
import TableView from "@/components/TableView";
import common from '@M/common';
import * as Tools from "@U/tools";
import {RSAEncrypted} from "@U/tools";

export default {
  name: "UserDetailView",
  mixins: [common],
  components: {
    ProfileContent,
    TableView
  },
  data() {
    return {
      valid: false,
      lazy: false,
      message: '',
      saveLoading: false,
      itemDetail: {},
      defaultItem: {
        account: '',
        password: '',
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        cellphone: '',
        status: 0,
        role: 0,
        defaultPassword: '',
        checkPassword: '',
        country: '',
        company: '',
        city: '',
        epicId: '',
        accountManager: '',
        groupId:'',
      },
      userFile: {
        filter: '',
        loading: false,
        list: [],
        totalItems: 0,
        pageIndex: 1,
        limit: 10,
        header: {},
        sortBy:'createdDate',
        sortByValue:'DESC',
      },
      userGroup: {
        loading: false,
        list: [],
        totalItems: 0,
        pageIndex: 1,
        limit: 10,
        header: {},
      },
      userContract: {
        loading: false,
        list: [],
        totalItems: 0,
        pageIndex: 1,
        limit: 10,
        header: {},
        sortBy:'createdDate',
        sortByValue:'DESC',
      },
      contractList: [],
      selectedContract: -1,
      shareContractloading: false,
      tab: 0,
    }
  },
  created() {
    console.log(`User detail ${this.isEdit}`)
    this.loadData();
    this.loadRoleData();

    Notification.addObserver('refresh_user_files', ()=>{
        this.loadUserFiles();
    });

    Notification.addObserver('delete_user',()=>{
      this.$router.push({ path: '/home/users', query: { tab:'Users'}});
    });
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getSelectUser']),
    getContractPermission(){
      return Tools.getUserPermission('Contracts');
    },
    isContractModify(){
      if (this.getContractPermission && this.getContractPermission.subItems.length){
        return this.getContractPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
      }
      return false;
    },
    fileTypeList() {
      return [
        {key: '', text: 'All'},
        {key: 99, text: 'Private'},
        {key: 100, text: 'Group'}];
    },
    isEdit() {
      return this.$route.query.id !== '';
    },
    columnKeys() {
      let list = [
        {value: 'displayName', text: 'File Name', emptyValue: '--', sortable: true, required: false,  role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
        {
          value: 'type', text: 'Type', sortable: true, required: true, isSelectText: true, options: DELIVERY_FILE_TYPE ,
          role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]
        },
        {
          value: 'version', text: 'Version', sortable: true, required: true,
          role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]
        },
        {value: 'createdDate', text: 'Delivered Date', sortable: true, isDate:true , required: false,
          role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
        { value: 'download', text: '', sortable: false, required: false, role: [
            ROLE_ID.CUSTOMER_ROLE_ID
          ] },
        {value: 'delete_check_group', text: '', sortable: false, required: false, isEvent: true ,
          role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]}
      ];
      return list.filter((item) => {
        if (item.value === 'download'){
          return this.canEditUser === false || item.role.indexOf(this.getUserInfo.role) > -1;
        } else if (item.value === 'delete_check_group') {
          if (this.canEditUser){
            return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
          }
          return false;
        } else {
          return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
        }
      });
    },
    groupColumnKeys() {
      return [
        // { value: 'groupId', text: 'Group ID', sortable: true, required: false },
        {value: 'name', text: 'Group Name', sortable: false, required: true},
        // { value: 'userList', text: 'Group Users', sortable: false, required: true },
        {value: 'createdDate', text: 'Created Date', isDate:true, sortable: false, required: true},
      ];
    },
    contractColumnKeys() {
      let list = [
        {value: 'displayName', text: 'Contract Name', sortable: true, required: false , role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
        {value: 'createdDate', text: 'Shared Date', isDate:true, sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
        {
          value: 'accept',
          text: 'Status',
          sortable: false,
          required: false,
          isSelectText: true,
          options: [
            {key: 0, text: 'Not Accepted', class: 'txtRed'},
            {key: 1, text: 'Accepted', class: 'txtGray'},
          ],
          role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]
        },
        { value: 'download', text: '', sortable: false, required: false, role: [
            ROLE_ID.CUSTOMER_ROLE_ID
          ] },
        { value: 'function', text: '', sortable: false, required: false ,isEvent:true, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ] }
      ];
      return list.filter((item) => {
        if (item.value === 'download'){
          return this.isContractModify === false || item.role.indexOf(this.getUserInfo.role) > -1;
        } else if (item.value === 'function') {
          if (this.isContractModify){
            return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
          }
          return false;
        } else {
          return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
        }
      });
    }
  },
  methods: {
    ...mapActions([
      'getUserDetail',
      'saveUserInfo',
      'getFileList',
      'getUserGroupList',
      'getUserContractList',
      'getContractList',
      'shareContract',
      'deleteContract',
      'deleteFileItem',
      'deleteFile',
      'getKey',
      'setUserDetails',
      'loadRoleList',
      'deleteUserInfo',
      'removeShareContract']),
    async loadData() {
      this.userFile.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const userId = this.$route.query.id;
      if (userId && userId !== '') {
        const res = await this.getUserDetail({
          token: token ? token : this.getUserInfo.token
          , user: {
            userId
          }
        });

        if (res.data) {
          this.itemDetail = res.data.data;
          this.setUserDetails(res.data.data);
          if (!this.itemDetail.groupId) {
            // this.itemDetail.groupId = '';
            this.$set(this.itemDetail, 'groupId', '');
          }
          await this.loadUserFiles();
        } else {
          console.log(`error ${JSON.stringify(res.data)}`);
        }
      } else {
        this.itemDetail = Object.assign({}, this.defaultItem);
        this.itemDetail.parentId = this.getUserInfo.userId;
      }
    },
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
    async loadRoleData() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      await this.loadRoleList({
        token: token ? token : this.getUserInfo.token,
        query: {searchValue: ''}
      });
    },
    async saveEvent(item) {
      console.log(`saveEvent`)
      if (!item.check) {
        this.message = 'Please fill in all fields';
        return;
      }
      this.itemDetail = item.user;
      this.itemDetail.isEdit = item.isEdit;

      const keyResponse = await this.getKey();
      const keyResult = keyResponse.data;
      if (keyResult && keyResult.statusCode === 0 && !item.isEdit) {
        const rsaKey = keyResult.data.publicKey;
        const RSAEncryptedPassword = RSAEncrypted(rsaKey, this.itemDetail.defaultPassword.trim());
        this.itemDetail.password = RSAEncryptedPassword;

        delete this.itemDetail.defaultPassword;
        delete this.itemDetail.checkPassword;
      }
      this.saveUser();
    },
    async saveUser() {
      this.saveLoading = true;
      const response = await this.saveUserInfo({
        token: this.getUserInfo.token,
        info: this.itemDetail
      });
      const result = response.data;
      this.saveLoading = false;
      if (result && result.statusCode === 0) {
        this.message = 'User information updated successfully';
        console.log(`save ${result.message}`);
        setTimeout(() => {
          this.message = '';
          !this.isEdit && this.cancelEvent();
        }, 1000);
      } else {
        this.message = result.message ? result.message : 'Save Error';
      }
    },
    cancelEvent() {
      Notification.notifyObservers('popSubPath');
      this.$router.back();
    },
    async loadUserFiles() {
      this.userFile.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const res = await this.getFileList({
        userId: this.itemDetail.userId,
        token: this.getUserInfo ? this.getUserInfo.token : token,
        searchValue: '',
        filter: this.userFile.filter,
        pageIndex: this.userFile.pageIndex,
        limit: this.userFile.limit,
        sortBy: this.userFile.sortBy,
        sortByValue: this.userFile.sortByValue,
      });
      if (res) {
        const results = res.data;
        this.userFile.list = results.data.list;
        this.userFile.header = results.data.header;
        console.log(`search results ${JSON.stringify(results)}`);
      }
      this.userFile.loading = false;
    },
    async loadUserGroups() {
      this.userGroup.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const res = await this.getUserGroupList({
        userId: this.itemDetail.userId,
        token: this.getUserInfo ? this.getUserInfo.token : token,
        searchValue: '',
        filter: this.userFile.filter,
        pageIndex: this.userGroup.pageIndex,
        limit: this.userGroup.limit,
      });
      if (res) {
        const results = res.data;
        this.userGroup.list = results.data.list;
        this.userGroup.header = results.data.header;
        console.log(`search results ${JSON.stringify(results)}`);
      }
      this.userGroup.loading = false;
    },
    async loadUserContract() {
      this.userContract.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const res = await this.getUserContractList({
        userId: this.itemDetail.userId,
        token: token ? token : this.getUserInfo.token,
        searchValue: '',
        filter: this.userContract.filter,
        pageIndex: this.userContract.pageIndex,
        limit: this.userContract.limit,
        sortBy: this.userContract.sortBy,
        sortByValue: this.userContract.sortByValue,
      });
      if (res) {
        const results = res.data;
        this.userContract.list = results.data.list;
        this.userContract.header = results.data.header;
        console.log(`search contract results ${JSON.stringify(this.userContract.list)}`);
      }
      this.userContract.loading = false;
    },
    async changeTab(key) {
      this.tab = key;
      let list = ['#tab_file', '#tab_group', '#tab_user', '#tab_contract'];
      for (let item of list) {
        if (this.tab === -1) {
          if (item === '#tab_user') {
            // eslint-disable-next-line no-undef
            $(item).addClass('now');
          } else {
            // eslint-disable-next-line no-undef
            $(item).removeClass('now');
          }
        } else if (this.tab === 0) {
          if (item === '#tab_file') {
            // eslint-disable-next-line no-undef
            $(item).addClass('now');
          } else {
            // eslint-disable-next-line no-undef
            $(item).removeClass('now');
          }
        } else if (this.tab === 1) {
          if (item === '#tab_group') {
            // eslint-disable-next-line no-undef
            $(item).addClass('now');
          } else {
            // eslint-disable-next-line no-undef
            $(item).removeClass('now');
          }
        } else if (this.tab === 2) {
          if (item === '#tab_contract') {
            // eslint-disable-next-line no-undef
            $(item).addClass('now');
          } else {
            // eslint-disable-next-line no-undef
            $(item).removeClass('now');
          }
        }
      }
      if (key === 0) {
        await this.loadUserFiles();
      } else if (key === 1) {
        await this.loadUserGroups();
      } else if (key === 2) {
        await this.loadUserContract();
        await this.loadContractData();
      }
    },
    async changeFileType() {
      await this.loadUserFiles();
    },
    changePage(page) {
      console.log(`changePage === ${this.tab} / ${JSON.stringify(page)}`);
      if (this.tab === 0) {
        this.userFile.pageIndex = page.page;
        this.userFile.limit = page.limit;
        this.userFile.sortBy = page.sortBy;
        this.userFile.sortByValue = page.sortByValue;
        this.loadUserFiles();
      }
      if (this.tab === 2) {
        this.userContract.pageIndex = page.page;
        this.userContract.limit = page.limit;
        this.userContract.sortBy = page.sortBy;
        this.userContract.sortByValue = page.sortByValue;
        this.loadUserContract();
      }
    },
    editHandle() {
      this.toTop();
      this.showDialog({
        visible: true,
        component: 'UserDetailPop',
        confirmEvent: this.loadData
      });
    },
    cellEvent(edit) {
      console.log(`cell event ${JSON.stringify(edit.item)}`);
      const { key, item } = edit;
      switch(this.tab) {
        case 0:
            console.log(0);

            if (key === 'share') {
                Notification.notifyObservers('pushSubPath', {label: 'Share File'});
                this.$router.push({path: '/home/shareFile', query: {id: item.fileId}});
            } else if (key === 'download') {
                console.log(`url ${item.originURL}`);
                const link = document.createElement('a');
                link.target = '_blank';
                link.href = item.originURL;
                link.download = item.fileName;
                link.click();
            } else if(key === 'delete') {
              this.toTop();
              this.showAlert({
                visible: true,
                content: 'Are you sure delete this file?',
                confirmEvent: async () => {
                  await this.removeFile(item);
                  this.hideAlert();
                }
              });
            } else {
                this.toTop();
                this.showDialog({
                  visible: true,
                  component: 'FileDetailView',
                  id: item.fileId
                });
            }
            break;
        case 2:
            console.log(1);
            if(key === 'delete') {
                this.toTop();
                this.showAlert({
                    visible: true,
                    content: 'Are you sure delete this contract?',
                    confirmEvent: async () => {
                        await this.removeContract(item);
                        this.hideAlert();
                    }
                });
            } else if (key === 'download') {
              console.log(`url ${item.originURL}`);
              const link = document.createElement('a');
              link.target = '_blank';
              link.href = item.originURL;
              link.download = item.fileName;
              link.click();
            } else {
                this.toTop();
                this.showDialog({
                    visible: true,
                    component: 'ContractDetailView',
                    id: item.fileId,
                    userId: this.itemDetail.userId,
                });
            }
            break;
        default: {
            let query = this.$router.currentRoute.query;
            query.id = item.groupId;
            Notification.notifyObservers('pushSubPath', {label: 'Group Detail'});
            this.$router.push({path: '/home/groupDetail', query: query});
            break;
        }
      }
    },
    addFiles() {
        const userId = this.$route.query.id;
        this.toTop();
        this.showDialog({
            visible: true,
            component: 'FileAddView',
            id: userId
        });
    },
    async removeFile(item) {
      const { fileId } = item;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const result = await this.deleteFileItem({
        token: token ? token : this.getUserInfo.token,
        userId: this.itemDetail.userId,
        fileId ,
      });

      if (result && result.data.statusCode === 0) {
        this.message = 'delete file successfully';

        this.loadUserFiles();
        setTimeout(() => {
          this.message = '';
        }, 1000);
      } else {
        this.message = result ? result.data.message : 'Delete Error';
        setTimeout(() => {
          this.message = '';
        }, 1000);
      }
    },
    async removeContract(item) {
        const { fileId } = item;
        const token = localStorage.getItem(CACHE_USER_KEY);
        const result = await this.removeShareContract({
            token: token ? token : this.getUserInfo.token,
            info: {
                userId: this.itemDetail.userId,
                fileId
            }
        });

        if (result && result.data.statusCode === 0) {
            this.message = 'delete contract successfully';

            await this.loadUserContract();
            setTimeout(() => {
                this.message = '';
            }, 1000);
        } else {
            this.message = result ? result.data.message : 'Delete Error';
            setTimeout(() => {
                this.message = '';
            }, 1000);
        }
    },
    async shareSelectedContract() {
      if (this.selectedContract === -1) {
        return;
      }

      this.shareContractloading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const result = await this.shareContract({
        token: token ? token : this.getUserInfo.token,
        info: {
          userId: this.itemDetail.userId,
          fileId: this.selectedContract
        }
      });
      this.shareContractloading = false;
      if (result && result.data.statusCode === 0) {
        this.message = 'Share contract successfully';
        console.log(`save ${result.message}`);
        await this.loadUserContract();
        setTimeout(() => {
          this.message = '';
        }, 1000);
      } else {
        this.message = result ? result.data.message : 'Share Error';
        setTimeout(() => {
          this.message = '';
        }, 1000);
      }
    },
    deleteUser() {
      console.log(`deleteUser`);
      this.toTop();
      this.showAlert({
        content: 'Are you sure delete this user?',
        confirmEvent: async () => {
          console.log(`confirmEvent user`);
          const token = localStorage.getItem(CACHE_USER_KEY);
          const res = await this.deleteUserInfo({token, info:{userId: this.itemDetail.userId}});
          const result = res.data;
          console.log(`res == ${JSON.stringify(res)}`);
          if (result && result.statusCode === 0) {
            this.back();
          } else {
            this.message = result ? result.message : 'Delete User Error';
            console.log(`error ${JSON.stringify(res)}`);
          }
          this.hideAlert();
        }
      });
    },
    back(){
      this.$router.back();
    }
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
