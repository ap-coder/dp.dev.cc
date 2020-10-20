<template>
  <div>
    <div class="btnBox">
      <a target="_self" class="blueBtn" v-if="canEditGroup" @click="addGroup">Add Groups</a>
    </div>
    <table-view
        layoutClass="groupsContent"
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
import {mapActions} from 'vuex';
import common from '@M/common';
import TableView from '@C/TableView';
import {CACHE_USER_KEY} from "@U/Constant";
import Notification from "@U/notice_manager";

export default {
  name: 'GroupView',
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
      limit: 10,
      searchValue: '',
      filter: '',
      isEdit: false
    }
  },
  created() {
    this.loadGroupList();
  },
  mounted() {
    Notification.notifyObservers('pushSubPath', {label: 'Group', path:'/home/users', query: {tab: 'Group'}});
  },
  computed: {
    columnKeys() {
      return [
        // { value: 'groupId', text: 'Group ID', sortable: true, required: false },
        {value: 'name', text: 'Group Name', sortable: false, required: true},
        {value: 'userList', text: 'Users', sortable: false, required: true},
        {value: 'updatedDate', text: 'Updated Date', sortable: false, required: true},
      ];
    },
  },
  methods: {
    ...mapActions([
      'getGroupList',
      'loadGroupList'
    ]),
    async loadGroupList() {
      this.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      console.log(`load group1 ${token}  ${this.getUserInfo.token}`);
      const res = await this.getGroupList({
        token: token ? token : this.getUserInfo.token,
        searchValue: '',
        pageIndex: this.pageIndex,
        limit: this.limit
      });
      const result = res.data.data;

      if (result) {
        this.list = result.list;
        this.header = result.header;

        this.list.forEach(group => {
          group.userList = '';
          group.users.forEach((user, i) => {
            group.userList += `${user.account}${i < group.users.length - 1 ? ', ' : ''}`;
          });
        });
        this.loading = false;
      }
    },
    changePage(pagination) {
      this.limit = pagination.limit;
      this.pageIndex = pagination.page;
      this.loadGroupList();
    },
    cellEvent(edit) {
      console.log(edit);
      const {item} = edit;
      let query = this.$router.currentRoute.query;
      query.id = item.groupId;

      this.isEdit = true;
      Notification.notifyObservers('pushSubPath', {label: 'Group Detail',path: '/home/groupDetail'});
      this.$router.push({path: '/home/groupDetail', query: query});

    },
    addGroup() {
      // this.groupItem = Object.assign({}, this.defaultGroup);
      this.isEdit = true;
      Notification.notifyObservers('pushSubPath', {label: 'Add Group'});
      this.$router.push({path: '/home/groupDetail', query: {id: ''}});
    }
  },
  destroyed() {
    !this.isEdit && Notification.notifyObservers('popSubPath');
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
