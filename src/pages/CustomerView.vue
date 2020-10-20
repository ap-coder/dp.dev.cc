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
import TableView from '@/components/TableView';
import {CACHE_USER_KEY} from "@U/Constant";
import Notification from "@U/notice_manager";
import * as Tools from '@/utils/tools';

export default {
  name: 'CustomerView',
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
      return [
        // { value: 'account', text: 'Account', sortable: true, required: false },
        {value: 'firstName', text: 'Name', sortable: true, required: true, isName: true},
        {value: 'email', text: 'Email', sortable: false, required: true},
        {value: 'company', text: 'Company', sortable: true, required: false},
        {value: 'groupName', text: 'Group', sortable: false, required: false},
        {value: 'epicId', text: 'Epic ID', sortable: true, required: false},
        {
          value: 'status',
          text: 'Status',
          sortable: false,
          required: false,
          isSelectText: true,
          options: this.userStatus
        },
        // { value: 'role', text: 'Role', sortable: false, required: false ,isSelectText:true ,options: this.userRoleList},
        // { value: 'registeredDate', text: 'Registered Date', sortable: true, required: true },
        // { value: 'delete', text: 'Delete', sortable: true, required: true ,isEvent: true},
      ];
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

    if (this.$router.currentRoute.path.indexOf('customers') > -1) {
      setInterval(() => {
        this.loadData();
      }, 3 * 60 * 1000);
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions([
      'fetchUserList',
      'loadRoleList'
    ]),
    async loadData() {
      if (this.$router.currentRoute.path.indexOf('customers') === -1) {
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
<style scoped src="../assets/css/all-admin.css">

</style>
