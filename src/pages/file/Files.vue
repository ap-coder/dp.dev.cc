<template>
  <div class="deliveryDiv">
    <div class="functionBar">
      <!--          <select class="select" v-model="filter" @change="changeType">-->
      <!--            <option v-for="option in deliveryFileTypes" :key="option.key"-->
      <!--                    :value="option.key">{{option.text}}</option>-->
      <!--          </select>-->
      <div class="searchBar">
        <input placeholder="File Name" class="textInput" v-model="searchValue">
        <a target="_self"  class="deleteBtn" @click="reset"></a>
        <a target="_self"  class="searchBtn" @click="searchEvent"></a>
      </div><!--searchBar-->
      <a target="_self"  class="blueBtn" v-if="canEditFile" @click="addData">Add File</a>
      <div class="clear"></div>

    </div><!--functionBar-->
    <table-view
        layoutClass=""
        :column-keys="columnKeys"
        :header="header"
        :items="list"
        :loading="loading"
        :canEdit="true"
        @changePage="changePage"
        @cellEvent="cellEvent"></table-view>

  </div><!--sdksDiv-->
</template>

<script>
import { mapActions } from 'vuex';
import common from '@M/common';
import TableView from '@C/TableView';
import {CACHE_USER_KEY, ROLE_ID} from "@/utils/Constant";
import Notification from "@/utils/notice_manager";
import * as Tools from "@/utils/tools";

export default {
  name: "DeliveryView",
  mixins: [common],
  components: {
    TableView
  },
  data() {
    return {
      filter: -1,
      searchValue: '',
      pageIndex: 1,
      limit: 10,
      loading: false,
      list: [],
      sortBy: '',
      sortByValue: 'desc',
      header: {},
      messageDialog: {
        title: '',
        content: '',
        confirm: () => {},
        cancel: () => {},
        visible: false
      }
    }
  },
  computed: {
    getCurrentPermission() {
      return Tools.getUserPermission('Files');
    },
    showEdit() {
      if (this.getCurrentPermission && this.getCurrentPermission.subItems.length) {
        return this.getCurrentPermission.subItems.find(feature => feature.featureId === 1).enable === true;
      }
      return false;
    },
    columnKeys() {
      let list = [
        {value: 'displayName', text: 'File Name', sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ]},
        {value: 'type', text: 'Type', sortable: true, required: true, isSelectText: true, options: this.deliveryFileTypes, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ]},
        {value: 'version', text: 'Version', sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ]},
        // {value: 'groupName', text: 'Customer', sortable: true, required: true},
        {value: 'shareName', text: 'Customer', sortable: true, required: true, isShareName: true, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
        {value: 'createdDate', text: 'Delivered Date', sortable: true, isDate: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ]},
        // {value: 'updatedDate', text: 'Delivered Date', sortable: true, required: false, role: [
        //     ROLE_ID.LEGAL_ROLE_ID,
        //     ROLE_ID.PRODUCT_ROLE_ID,
        //     ROLE_ID.SALES_ROLE_ID,
        //     ROLE_ID.ADMIN_ROLE_ID,
        //     ROLE_ID.OPERATIONS_ROLE_ID,
        //     ROLE_ID.SUPPORT_ROLE_ID,
        //     ROLE_ID.CUSTOMER_ROLE_ID
        //   ]},
        {value: 'function', text: '', sortable: false, required: false, isEvent: true}
      ];

      return list.filter((item) => {
        if (item.text === 'Function') {
          return true;
        }
        return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
      });
    },
  },
  created() {
    console.log('files created');
    Notification.addObserver('refresh_files', ()=>{
      this.loadData();
    });
    this.loadData();
  },
  mounted() {
    console.log('files mounted');
    if (this.isCustomer){
      Notification.notifyObservers('reloadContractStatus');
    }

    Notification.notifyObservers('popSubPath');
    Notification.notifyObservers('pushSubPath', {label: 'Files', path:'/home/files', query: {tab: 'Files'}});
  },
  methods: {
    ...mapActions([
      'getFileList',
      'showAlert',
      'hideAlert',
      'deleteFile'
    ]),
    async loadData(){
      console.log('refresh files');
      if (this.$router.currentRoute.path.indexOf('files') === -1) {
        return;
      }
      console.log(`refresh files == ${this.$router.currentRoute.path}`);
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loading = true;
      const res = await this.getFileList({
        token: this.getUserInfo ? this.getUserInfo.token: token,
        searchValue: this.searchValue,
        filter: this.filter === -1 ? '' : this.filter,
        pageIndex: this.pageIndex, limit: this.limit,
        sortBy: this.sortBy,
        sortByValue: this.sortByValue
      });
      this.loading = false;
      if (res){
        const results = res.data.data;
        this.list = results.list;
        this.header = results.header;
      }
      this.loading = false;
    },
    cellEvent(edit){
      console.log(`cellEvent == ${JSON.stringify(edit)}`);
      if (edit.key === 'download'){
        const link = document.createElement('a');
        link.href = edit.item.originURL;
        link.download = edit.item.displayName;
        link.click();
      } else if (edit.key === 'delete'){
        this.toTop();
        this.showAlert({
          content: 'Are you sure delete this file?',
          confirmEvent: async () => {
            await this.deleteFileEvent(edit);
            this.hideAlert();
          }
        });
      } else {
        this.toTop();
        this.showDialog({
          visible: true,
          component: 'FileDetailView',
          id: edit.item.fileId
        });
      }
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
        await this.loadData();
      }
    },
    addData(){
      this.toTop();
      this.showDialog({
        visible: true,
        component: 'FileAddView',
        id: ''
      });
      // Notification.notifyObservers('pushSubPath', {label: 'Add Files', path: '/home/fileAdd'});
      // this.$router.push({ path:'/home/fileAdd', query: { id: ''} });
    },
    changePage(pagination) {
      this.limit = pagination.limit;
      this.pageIndex = pagination.page;
      this.sortBy = pagination.sortBy;
      this.sortByValue = pagination.sortByValue;
      this.loadData();
    },
    changeType(){
      this.loadData();
    },
    searchEvent(){
      this.loadData();
    },
    reset(){
      this.filter = -1;
      this.searchValue = '';
      this.loadData();
    },
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
