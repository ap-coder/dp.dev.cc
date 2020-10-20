<template>
  <div class="usersContent">
    <div class="functionBar">
      <!--            <select class="select" v-model="filter" @change="changeStatus">-->
      <!--                <option-->
      <!--                    v-for="item in userStatus"-->
      <!--                    :value="item.key"-->
      <!--                    :key="item.key">{{item.text}}</option>-->
      <!--            </select>-->
      <div class="searchBar">
        <input placeholder="" class="textInput" v-model="searchValue">
        <a href="#" class="deleteBtn" @click.prevent="resetSearch"></a>
        <a href="#" class="searchBtn" @click.prevent="search"></a>
      </div><!--searchBar-->
      <a target="_self" @click.prevent="addData" v-if="showEdit" class="blueBtn">Add User</a>
      <div class="clear"></div>

    </div><!--functionBar-->
    <table-view
        layoutClass=""
        :column-keys="columnKeys"
        :header="header"
        :items="list"
        :loading="loading"
        :can-edit="true"
        @changePage="changePage"
        @cellEvent="cellEvent"></table-view>
  </div><!--usersContent-->
</template>

<script>
import {mapActions} from 'vuex';
import common from '@M/common';
import TableView from '../../components/TableView';
import {CACHE_USER_KEY, ROLE_ID} from "@U/Constant";
import Notification from "@U/notice_manager";
import * as Tools from '@/utils/tools';

export default {
  name: 'UsersView',
  mixins: [common],
  components: {
    TableView
  },
  data() {
    return {
      header: {},
      list: [],
      loading: false,
      pageIndex: 1,
      limit: 20,
      sortBy: '',
      sortByValue: 'desc',
      searchValue: '',
      filter: '',
      isEdit: false
    }
  },
  computed: {
    getCurrentPermission() {
      return Tools.getUserPermission('Users');
    },
    showEdit() {
      if (this.getCurrentPermission && this.getCurrentPermission.subItems.length) {
        return this.getCurrentPermission.subItems.find(feature => feature.featureId === 1).enable === true;
      }
      return false;
    },
    columnKeys() {
      let list =  [
        {value: 'firstName', text: 'User Name', sortable: true, required: true, isName: true, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'email', text: 'Email', sortable: false, required: true, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'company', text: 'Company', sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'groupName', text: 'Group', sortable: false, required: false},
        {value: 'epicId', text: 'Epic ID', sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        { value: 'updatedDate', text: 'Updated Date', sortable: true, required: false, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]},
        {value: 'status', text: 'Status', sortable: false, required: false, isSelectText: true, options: this.userStatus, role: [
            ROLE_ID.LEGAL_ROLE_ID,
            ROLE_ID.PRODUCT_ROLE_ID,
            ROLE_ID.SALES_ROLE_ID,
            ROLE_ID.ADMIN_ROLE_ID,
            ROLE_ID.OPERATIONS_ROLE_ID,
            ROLE_ID.SUPPORT_ROLE_ID
        ]}
      ];

      return list.filter(item => item.role && item.role.indexOf(this.getUserInfo.role) > -1)
    },
    userRoleList() {
      let list = [];
      this.getRoleList.forEach(role => {
        list.push({
          key: role.roleId,
          text: role.name,
        })
      });
      return list;
    },
  },
  async created() {
    this.loadData();

    if (this.$router.currentRoute.path.indexOf('users') > -1) {
      setInterval(() => {
        this.loadData();
      }, 3 * 60 * 1000);
    }
  },
  mounted() {
    Notification.notifyObservers('pushSubPath', {label: 'Users', path:'/home/users', query: {tab: 'Users'}});
  },
  methods: {
    ...mapActions([
      'fetchUserList',
      'loadRoleList'
    ]),
    async loadData() {
      if (this.$router.currentRoute.path.indexOf('users') === -1) {
        return;
      }
      console.log(JSON.stringify(this.getUserInfo));
      if (!this.getUserInfo) {
        return;
      }

      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loading = true;

      const res = await this.fetchUserList({
        token: this.getUserInfo.token ? this.getUserInfo.token : token,
        query: {
          searchValue: this.searchValue,
          filter: this.filter,
          pageIndex: this.pageIndex,
          limit: this.limit,
          sortBy: this.sortBy,
          sortByValue: this.sortByValue
        }
      });
      const result = res.data.data;
      if (result) {
        this.list = result.list;
        this.header = result.header;
      }

      this.loading = false;
    },
    changePage(pagination) {
      this.limit = pagination.limit;
      this.pageIndex = pagination.page;
      this.sortBy = pagination.sortBy;
      this.sortByValue = pagination.sortByValue;
      this.loadData();
    },
    changeStatus() {
      this.loadData();
    },
    cellEvent(edit) {
      console.log(edit);
      const {item} = edit;

      this.isEdit = true;
      Notification.notifyObservers('pushSubPath', {label: 'User Detail', path:'/home/userDetail'});
      this.$router.push({path: '/home/userDetail', query: {id: item.userId}});

    },
    addData() {
      this.isEdit = true;
      Notification.notifyObservers('pushSubPath', {label: 'Add User', path:'/home/userDetail'});
      this.$router.push({path: '/home/userDetail', query: {id: ''}});
    },
    search() {
      this.loadData();
    },
    resetSearch() {
      this.searchValue = '';
      this.search();
    }
  },
  destroyed() {
    !this.isEdit && Notification.notifyObservers('popSubPath');
  }
}
</script>
<style scoped src="../../assets/css/all-admin.css">

</style>
