<template>
  <div class="contractDiv">
    <div class="functionBar">
      <div class="searchBar">
        <input placeholder="File Name" class="textInput" v-model="searchValue"
               @keyup.enter="searchEvent">
        <a href="#" @click.prevent="reset" class="deleteBtn"></a>
        <a href="#" @click.prevent="searchEvent" class="searchBtn"></a>
      </div><!--searchBar-->
      <a href="#" @click.prevent="addData" v-if="canEditFile" class="blueBtn">Add Contract</a>
      <div class="clear"></div>
    </div>
    <table-view
        layoutClass=""
        :column-keys="columnKeys"
        :header="header"
        :items="list"
        :loading="loading"
        :canEdit="true"
        @changePage="changePage"
        @cellEvent="cellEvent"></table-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TableView from '@C/TableView';
import {CACHE_USER_KEY, ROLE_ID} from "@/utils/Constant";
import Notification from "@/utils/notice_manager";
import common from '@M/common';
import * as types from "@/store/mutations_type";

export default {
  name: "ContractListView",
  mixins: [common],
  components: {
    TableView
  },
  data(){
    return {
      loading: false,
      list: [],
      pageIndex: 1,
      limit: 10,
      sortBy: 'updatedDate',
      sortByValue: 'desc',
      filter: 10,
      searchValue:'',
      header: {}
    };
  },
  created() {
    Notification.addObserver('refresh_contract',()=>{
      this.loadData();
    })
    this.loadData();
  },
  mounted() {
    Notification.notifyObservers('popSubPath');
    Notification.notifyObservers('pushSubPath', {label: 'Contracts', path:'/home/files', query: {tab: 'Contracts'}});
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    columnKeys() {
      let list = [
        { value: 'displayName', text: 'Contract Name', sortable: true, required: false, role: [
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ] },
        { value: 'version', text: 'Version', sortable: true, required: false, role: [
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ] },
        { value: 'shareName', text: 'Customer', sortable: false, required: false , isShareName:true, role: [
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.LEGAL_ROLE_ID,
        ] },
        { value: 'updatedDate', text: 'Shared Date', isDate: true, sortable: true, required: false, role: [
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ] },
        { value: 'accept', text: 'Status', sortable: false, required: false, isSelectText:true, options: [
            { key:0 , text:'Not Accepted', class: 'txtRed'},
            { key:1 , text:'Accepted', class: 'txtGray'},
          ],role: [
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.CUSTOMER_ROLE_ID
          ] },
        { value: 'download', text: '', sortable: true, required: false, role: [
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
          return this.canEditFile === false || item.role.indexOf(this.getUserInfo.role) > -1;
        } else if (item.value === 'function') {
          if (this.canEditFile){
            return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
          }
          return false;
        } else {
          return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
        }
      });
    }
  },
  methods:{
    ...mapActions([
      'getFileList',
      'configFileDetail',
      'removeShareContract',
      'getShareContractList',
      'getUserContractList',
      'acceptContractInfo',
      'getContractList',
    ]),
    changePage(page){
      this.pageIndex = page.page;
      this.limit = page.limit;
      this.sortBy = page.sortBy;
      this.sortByValue = page.sortByValue;
      this.loadData();
    },
    async loadData(){

      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loading = true;
      let res;
      if (this.isCustomer){
        res = await this.getContractList({
          token: token ? token : this.getUserInfo.token,
          searchValue: this.searchValue,
          filter: this.filter === -1 ? '' : this.filter,
          pageIndex: this.pageIndex, limit: this.limit,
          sortBy: this.sortBy,
          sortByValue: this.sortByValue
        });
        console.log(`=== getContractList === `, res.data);
      } else {
        res = await this.getShareContractList({
          token: token ? token : this.getUserInfo.token,
          searchValue: this.searchValue,
          filter: this.filter === -1 ? '' : this.filter,
          pageIndex: this.pageIndex, limit: this.limit,
          sortBy: this.sortBy,
          sortByValue: this.sortByValue
        });
        console.log(`=== getShareContractList === `, res.data);
      }
      if (res){
        const results = res.data;
        this.list = results.data.list;
        this.header = results.data.header;
        this.$store.commit(types.SET_CONTRACT_ACCEPT, results.data.header.unAcceptCount);
      }
      this.loading = false;
    },
    refreshData() {
      this.loadData();
    },
    addData(){
      this.showDialog({
        visible: true,
        component: 'ContractAddView',
        id: ''
      });
      // Notification.notifyObservers('pushSubPath', { label: 'Add Contract', path: '/home/contractInfo' });
      // this.$router.push({ path:'/home/contractInfo', query: {id: '' }});
    },
    async cellEvent(edit){
      console.log(`cell event ${JSON.stringify(edit)}`);
      if (edit.key === 'download'){
        console.log(`url ${edit.item.originURL}`);
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = edit.item.originURL;
        link.download = edit.item.fileName;
        link.click();
      } else if (edit.key === 'delete'){
        this.showAlert({
          visible: true,
          content: 'Are you sure delete this file?',
          confirmEvent: async ()=>{
            await this.deleteFileEvent(edit);
            this.hideAlert();
          }
        });
      } else if (edit.key === 'accept') {
        await this.acceptEvent(edit);
      } else {
        console.log(`isCustomer === ${this.isCustomer} / ${edit.item.fileId} / ${edit.item.userId}`);

        if (this.isCustomer){
          this.showDialog({
            visible: true,
            component: 'ContractAcceptView',
            id: edit.item.fileId,
          });
          // Notification.notifyObservers('pushSubPath', { label: 'Contract Detail', path: '/home/contractAccept' });
          // this.$router.push({ path: '/home/contractAccept' , query:{ id: edit.item.fileId }});
        } else {
          this.showDialog({
            visible: true,
            component: 'ContractDetailView',
            id: edit.item.fileId,
            userId: edit.item.userId,
          });
          // Notification.notifyObservers('pushSubPath', { label: 'Contract Detail', path: '/home/contractInfo' });
          // this.$router.push({ path: '/home/contractInfo' , query:{ id: edit.item.fileId }});
        }
      }
    },
    async acceptEvent(edit){
      const res = await this.acceptContractInfo({
        token: this.getUserInfo.token,
        info: {
          fileId: edit.item.fileId,
          userId: this.getUserInfo.userId,
        },
      });
      if (res) {
        const results = res.data;
        if (results.statusCode === 0) {
          this.loadData();
        }
      }
    },
    async deleteFileEvent(edit){
      const res = await this.removeShareContract({
        token: this.getUserInfo.token,
        info: {
          fileId: edit.item.fileId,
          userId: edit.item.userId
        },
      });
      if (res) {
        const results = res.data;
        if (results.statusCode === 0) {
          this.hideAlert();
          this.loadData();
        } else {
          this.hideAlert();
        }
      }
    },
    changeType(){
      this.loadData();
    },
    searchEvent(){
      this.loadData();
    },
    reset(){
      this.filter = 10;
      this.searchValue = '';
      this.loadData();
    },
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
