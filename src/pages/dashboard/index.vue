<template>
  <div class="dashboardDiv">
    <DashboardItem
        v-for="item in menuList"
        :key="item.key"
        :item="item"
        :list="dataList[item.dataKey]"
        :loading="loadingList[item.dataKey]"
        @sortClick="sortClick"/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Notification from "@U/notice_manager";
import {CACHE_USER_PERMISSION, ROLE_ID} from "@U/Constant";
import {CACHE_USER_KEY} from "@/utils/Constant";
import DashboardItem from './DashboardItem';
import * as types from "@/store/mutations_type";
import { formatDate } from '@/utils/tools';
import common from '@M/common';

export default {
  name: "Dashboard",
  mixins: [common],
  components: {
    DashboardItem
  },
  data() {
    return {
      pageIndex: 1,
      limit: 5,
      searchValue: '',
      filter: '',
      sortBy: '',
      sortByValue: 'desc',
      dataList: {
        files: [],
        users: [],
        contract: [],
        shareContract: [],
        skus:[],
      },
      loadingList: {
        files: false,
        users: false,
        contract: false,
        shareContract: false,
        skus: false,
      },
      apiResultCount: 0,
    }
  },
  watch: {
    apiResultCount(value) {
      if (value >= 3) {
        console.log(`apiResultCount == ${value}`);
        Notification.notifyObservers('isLoading', false);
      }
    }
  },
  created() {
    Notification.notifyObservers('isLoading', true);
    Notification.addObserver('refresh_user', () => {
      this.apiResultCount = 0;
      this.loadData();
      this.loadFileData();
      this.loadContractData();
      this.loadShareContractData();
      this.loadSKUData();
    });

    Notification.notifyObservers('checkUserStatus');
    if (this.checkID === null) {
      this.checkID = setInterval(() => {
        Notification.notifyObservers('checkUserStatus');
      }, 3 * 60 * 1000);
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getUserPermission']),
    isCustomer() {
      return this.getUserInfo.role === ROLE_ID.CUSTOMER_ROLE_ID;
    },
    menuList() {
      const menuList = [
        {
          key: '2',
          dataKey: 'files',
          path: '/home/files',
          cellPath: '/home/fileInfo',
          columns: this.columnFileKeys,
          label: 'Latest Deliveries',
          cellLabel: 'File Detail'
        },
        {
          key: '3',
          dataKey: 'skus',
          path: '/home/sdk',
          cellPath: '/home/skuDetail',
          columns: this.columnSkuKeys,
          label: 'Latest SKUs',
          cellLabel: 'SKU Detail'
        },
        {
          key: '6',
          dataKey: 'users',
          path: '/home/users',
          cellPath: '/home/userDetail',
          columns: this.columnKeys,
          label: this.isAdmin ? 'New Users': 'New Customers',
          cellLabel: 'User Detail'
        },
        {
          key: '9', dataKey: 'contract', path: '/home/contract',
          cellPath: this.isCustomer ? '/home/contractAccept' : '/home/contractInfo'
          , columns: this.columnContractKeys, label: 'Contract', cellLabel: 'Contract Detail'
        },
        {
          key: '12', dataKey: 'shareContract', path: '/home/files',
          cellPath: '/home/contractInfo'
          , columns: this.columnShareContractKeys, label: 'Latest Shared Contracts', cellLabel: 'Contract Detail'
        },
      ];
      const cacheMenu = localStorage.getItem(CACHE_USER_PERMISSION);
      let userMenuItems = [];

      if (cacheMenu) {
        userMenuItems = JSON.parse(cacheMenu || []);
      } else {
        userMenuItems = this.getUserPermission;
      }

      if (userMenuItems && userMenuItems.length > 0) {
        let filterList = menuList.filter(menu => {
          const menuItem = userMenuItems.find(userMenu => userMenu.menuItem === menu.key
              && userMenu.enable === true);
          if (this.isCustomer){
            return (menuItem ?? false) || menu.key === '12';
          }
          return ((menuItem ?? false) || menu.key === '12') && menu.key !== '9';
        });
        return filterList;
      }
      return [];
    },
    columnKeys() {
      return [
        {value: 'email', text: 'Account', sortable: false, required: true, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'status', text: 'Status', sortable: false, required: false, isSelectText: true, options: [
            {key: 0, text: 'Registered'},
            {key: 1, text: 'Pending'},
            {key: 2, text: 'Approved'},
            {key: -1, text: 'Disabled'},
        ],role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'registeredDate', text: 'Updated Date', isDate:true, sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
      ];
    },
    columnFileKeys() {
      return [
        {value: 'displayName', text: 'File Name', sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        // {
        //   value: 'type', text: 'Type', sortable: false, required: true, isSelectText: true,
        //   options: DELIVERY_FILE_TYPE
        // },
        {value: 'shareName', text: 'Customer', sortable: true, required: true, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'createdDate', text: 'Delivered Date', isDate:true, sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
      ].filter(item => item.role && item.role.indexOf(this.getUserInfo.role) > -1);
    },
    columnSkuKeys() {
      return [
        {value: 'displayName', text: 'SKU Name', sortable: true, required: false},
        {value: 'version', text: 'Version', sortable: false, required: true, width:'70px'},
        {value: 'updatedDate', text: 'Updated Date', sortable: true, required: false , isDate: true, width:'100px'},
      ];
    },
    columnContractKeys() {
      return [
        {value: 'displayName', text: 'Contract Name', sortable: true, required: false, role: [
            ROLE_ID.CUSTOMER_ROLE_ID,
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'updatedDate', text: 'Updated Date', isDate:true, sortable: false, required: true, role: [
            ROLE_ID.CUSTOMER_ROLE_ID,
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'accept', text: 'Accept Status', sortable: false, required: false, isSelectText: true, options: [
            {key: 0, text: 'Not Accepted', class: 'txtRed'},
            {key: 1, text: 'Accepted', class: 'txtGray'},
          ],role: [
            ROLE_ID.CUSTOMER_ROLE_ID,
          ]},
      ].filter(item => item.role && item.role.indexOf(this.getUserInfo.role) > -1);
    },
    columnShareContractKeys() {
      return [
        {value: 'displayName', text: 'Contract Name', sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
        {value :'customer', text: 'Customer', role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
        {value: 'createdDate', text: 'Shared Date', isDate:true, sortable: false, required: true, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
          ]},
      ].filter(item => item.role && item.role.indexOf(this.getUserInfo.role) > -1);
    }
  },
  methods: {
    ...mapActions(['fetchUserList', 'getFileList', 'getSDKList', 'getContractList','getShareContractList']),
    async loadData() {
      const token = localStorage.getItem(CACHE_USER_KEY);

      this.loadingList.users = true;
      const results = await this.fetchUserList({
        token: token ? token : this.getUserInfo.token,
        query: {
          searchValue: this.searchValue,
          filter: this.filter,
          pageIndex: this.pageIndex,
          limit: this.limit,
          sortBy: this.sortBy,
          sortByValue: this.sortByValue
        }
      });
      const res = results.data;
      this.apiResultCount += 1;
      if (res) {
        let list = [];
        for (let user of  res.data.list){
          user.registeredDate = formatDate(user.registeredDate);
          list.push(user);
        }
        this.dataList.users = list;
      }
      this.loadingList.users = false;
    },
    async loadFileData() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loadingList.files = true;
      const results = await this.getFileList({
        token: token ? token : this.getUserInfo.token,
        searchValue: '',
        filter: '',
        pageIndex: this.pageIndex,
        limit: 10,
        sortBy: this.sortBy,
        sortByValue: this.sortByValue,
        hiddenPublicFile: true
      });
      const res = results.data;
      this.apiResultCount += 1;
      if (res) {
        console.log(`dashboard files ${JSON.stringify(res.data.list)}`)
        const filterList = res.data.list.filter(u=>{
          const hasName = u.shareFirstName && u.shareListName && u.shareFirstName!=='' && u.shareListName!=='' ;
          const hasGroup = u.groupName && u.groupName!=='';
          console.log(`hasName ${hasName} , ${hasGroup}`);
          return (hasName || hasGroup);
        });
        let i = 0;
        for (let file of filterList){
          if (i < 5){
            this.dataList.files.push(file);
          }
          i+=1;
        }
        console.log(`this.dataList.files == ${this.dataList.files.length}`);
      }
      this.loadingList.files = false;
    },
    async loadSKUData() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loadingList.skus = true;
      const results = await this.getSDKList({
        token: token ? token : this.getUserInfo.token,
        searchValue: this.searchValue,
        filter: this.filter === -1 ? '' : this.filter,
        pageIndex: this.pageIndex,
        limit: this.limit,
        sortBy: this.sortBy,
        sortByValue: this.sortByValue
      });
      const res = results.data;
      this.apiResultCount += 1;
      if (res) {
        this.dataList.skus = res.data.list;
      }
      this.loadingList.skus = false;
    },
    async loadContractData() { // Contract 基本資料列表
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loadingList.contract = true;
      let res;
      res = await this.getContractList({
        token: token ? token : this.getUserInfo.token,
        searchValue: '',
        filter: 8,
        pageIndex: this.pageIndex,
        limit: this.limit,
        sortBy: this.sortBy ? this.sortBy : 'createdDate',
        sortByValue: this.sortByValue
      });

      if (res) {
        this.apiResultCount += 1;
        const results = res.data;
        this.dataList.contract = results.data.list;
        this.$store.commit(types.SET_CONTRACT_ACCEPT, results.data.header.unAcceptCount);
      }

      this.loadingList.contract = false;
    },
    async loadShareContractData() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loadingList.shareContract = true;
      let res;
      res = await this.getShareContractList({
        token: token ? token : this.getUserInfo.token,
        searchValue: '',
        filter: 8,
        pageIndex: this.pageIndex,
        limit: this.limit,
        sortBy: this.sortBy,
        sortByValue: this.sortByValue
      });

      if (res) {
        this.apiResultCount += 1;
        const results = res.data;
        this.dataList.shareContract = results.data.list;
      }
      this.loadingList.shareContract = false;
    },
    sortClick(dataKey, page) {
      this.sortBy = page.sortBy;
      this.sortByValue = page.sortByValue;

      switch (dataKey) {
        case 'files':
          this.loadFileData();
          break;
        case 'skus':
          this.loadSKUData();
          break;
        case 'users':
          this.loadData();
          break;
        case 'contract':
          this.loadContractData();
          break;
      }
    }
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
