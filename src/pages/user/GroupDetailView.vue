<template>
  <div>
    <!--Edit Group-->
    <div class="groupsAddDiv">
      <div class="rowLeft">
        <h4>Group Name</h4>
        <div class="con">
          <input
              type="text"
              v-model="groupItem.name"
              class="textInput"
              value="name"
          :disabled="!canEditGroup">
          <a href="#" style="float: right;" class="delete2Btn" v-if="canEditGroup" @click.prevent="deleteGroup"></a>
          <!--           redInput <span class="msg">Group name already exists.</span>-->
        </div>
      </div><!--rowLeft-->
      <div class="rowRight">
        <h4>Group Users</h4>
        <div class="searchBar">
          <input placeholder="Account" class="textInput" v-if="canEditGroup" @keyup="keyUpEvent" v-model="selectUser.account">
          <a href="#" class="deleteBtn" v-if="canEditGroup" @click.prevent="resetGroupUser"></a>
          <a href="#" class="blueBtn" v-if="canEditGroup" @click.prevent="addUserEvent">Add</a>
          <ul v-if="searchResult.results.length">
            <li
                v-for="item in searchResult.results"
                :key="item.userId"
                @click.prevent="selectedSearchResult(item)">
              <a href="#">{{ item.email }}</a>
            </li>
          </ul>
        </div><!--searchBar-->

        <div class="tableBox">
          <table class="table">
            <thead>
            <tr>
              <th
                  v-for="item in columnKeys"
                  :key="item.value">{{ item.text }}
              </th>
            </tr>
            <tr>
              <th :colspan="columnKeys.length"></th>
            </tr>
            </thead>
            <tbody v-if="groupItem">
            <tr
                v-for="item in groupItem.users ? groupItem.users.list : []"
                :key="item.userId">
              <td><span class="grayBtn" @click.prevent="showDetail(item)">{{ item.email }}</span></td>
              <td><span class="grayBtn">{{ item.firstName }} {{ item.lastName}}</span></td>
              <td><span class="grayBtn">{{ item.company }}</span></td>
              <td><a href="#" class="deleteTxtBtn" v-if="canEditGroup" @click.prevent="removeUser(item)">Delete</a></td>
            </tr>
            </tbody>
          </table>
        </div><!--tableBox-->
        <div class="clear"></div>
      </div><!--rowRight-->
      <div class="clear"></div>
      <div class="rowBtn">
        <a href="#" class="redBtn" @click.prevent="saveGroup">
          <v-progress-circular color="#ffffff" indeterminate :size="28"
                               :width="2"
                               v-if="saveGroupLoading" :value="20"></v-progress-circular>
          <span v-else>Save</span>
        </a>
        <a href="#" class="grayBtn" @click.prevent="back()">Back</a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {CACHE_USER_KEY} from "@/utils/Constant";
import Notification from "@U/notice_manager";
import common from '@M/common';

export default {
  name: "GroupDetailView",
  mixins: [common],
  data() {
    return {
      editGroup: false,
      saveGroupLoading: false,
      defaultGroup: {
        groupId: '',
        name: '',
        users: {
          header: {
            totalCount: 0,
            limit: 10,
            totalPage: 1,
          },
          list:[],
        },
      },
      groupItem: {},
      errorMessage: '',
      selectUser: {},
      searchResult: {
        item: null,
        loading: false,
        results: [],
      },
      search: null,
      selectMessage: '',
      timer: null,
    }
  },
  created() {
    this.loadData();
  },
  watch: {
    async search(val) {
      console.log(`search ${val}`);
      if (!val) {
        return;
      }
      this.selectMessage = '';
      // Items have already been loaded
      console.log(`searchResult ${JSON.stringify(this.searchResult)}`);
      if (this.searchResult.results && this.searchResult.results.length > 0) return;

      // Items have already been requested
      if (this.searchLoading) return;

      this.searchResult.loading = true;

      const results = await this.getCustomerList({
        token: this.getUserInfo.token,
        query: {
          searchValue: '',
          sortBy: 'registeredDate',
          sortValue: 'DESC',
          pageIndex: 1, limit: 1000
        }
      });
      // console.log(`getCustomerList ${JSON.stringify(results)}`);
      const res = results.data;
      if (res) {
        this.searchResult.results = res.data.list;
      }
      this.searchResult.loading = false;
    },
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getMenuList', 'getRoleList']),
    columnKeys() {
      return [
        // { value: 'userId', text: 'User ID', sortable: true, required: false },
        {value: 'email', text: 'Email', sortable: false, required: true},
        {value: 'username', text: 'UserName', sortable: false, required: true , isName: true},
        {value: 'company', text: 'Company', sortable: false, required: true},
        {value: 'delete', text: '', sortable: false, required: true, isEvent: true},
      ];
    },
  },
  methods: {
    ...mapActions(['getGroupInfo', 'createGroup', 'updateGroup', 'configUserDetail', 'getCustomerList'
      , 'configUserDetail', 'showAlert', 'hideAlert','deleteGroupInfo']),
    back() {
      Notification.notifyObservers('popSubPath');
      this.$router.back();
    },
    async loadData() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      const groupId = this.$route.query.id;
      if (groupId && groupId !== '') {
        const res = await this.getGroupInfo({
          token: token ? token : this.getUserInfo.token,
          info: {
            pageIndex: 1,
            limit: 10,
            groupId
          }
        });
        if (res.data) {
          this.groupItem = res.data.data;
          // this.groupItem.users = res.data.data.users.list;
          console.log(`groupItem == ${JSON.stringify(this.groupItem)}`);
        } else {
          console.log(`error ${JSON.stringify(res.data)}`);
        }
      } else {
        this.groupItem = Object.assign({}, this.defaultGroup);
        this.groupItem.parentId = this.getUserInfo.userId;
      }
    },
    addUserEvent() {
      if (!this.selectUser.userId){
        return;
      }
      const exist = this.groupItem.users.list.find(user => {
        return user.userId === this.selectUser.userId;
      });
      if (!exist) {
        this.groupItem.users.list.push({
          userId: this.selectUser.userId,
          email: this.selectUser.email
        });
        console.log(`group ${JSON.stringify(this.groupItem)}`);
        this.$forceUpdate();
      }
    },
    removeUser(item) {
      console.log(item);
      this.groupItem.users.list = this.groupItem.users.list.filter(user => user.userId !== item.userId);
    },
    resetGroupUser() {
      this.selectUser = {};
      this.searchResult.results = [];
      this.searchResult.item = '';
    },
    keyUpEvent() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search = this.selectUser.account;
      }, 0.5 * 1000);
    },
    selectedSearchResult(item) {
      console.log(`selectedSearchResult == ${JSON.stringify(item)}`);
      this.selectUser = item;
      this.searchResult.results = [];
    },
    async saveGroup() {
      if (this.groupItem.name === '') {
        this.errorMessage = 'group name is required';
        return;
      }
      this.editGroup = this.groupItem.groupId !== '';
      this.saveGroupLoading = true;
      console.log(`save group ${this.getUserInfo} ${JSON.stringify(this.groupItem)}`);
      let res;
      if (this.editGroup === true) { // 儲存
        res = await this.updateGroup({
          token: this.getUserInfo.token,
          group: {
            groupId: this.groupItem.groupId,
            name: this.groupItem.name,
            users: this.groupItem.users.list,
          }
        });
      } else { //新增
        res = await this.createGroup({
          token: this.getUserInfo.token,
          group: {
            name: this.groupItem.name,
            users: this.groupItem.users.list,
          }
        });
      }

      this.saveGroupLoading = false;
      console.log(JSON.stringify(res.data));
      if (res && res.data) {
        this.errorMessage = res.data.message;
        this.resetGroupUser();
        this.back();
      } else {
        this.errorMessage = res.data ? res.data.message : 'Save Error';
      }
    },
    showDetail(item) {
      this.configUserDetail(item);
      Notification.notifyObservers('pushSubPath', {label: 'User Detail', path: '/home/userDetail'});
      this.$router.push({path: '/home/userDetail', query: {id: item.userId}});
    },
    deleteGroup() {
      this.showAlert({
        content: 'Are you sure delete this group?',
        confirmEvent: async () => {
          const token = localStorage.getItem(CACHE_USER_KEY);
          const groupId = this.$route.query.id;
          if (groupId && groupId !== '') {
            const res = await this.deleteGroupInfo({ token : token, info: { groupId }});
            const result = res.data;
            console.log(`res == ${JSON.stringify(res)}`);
            if (result && result.statusCode === 0) {
              this.back();
            } else {
              this.errorMessage = result ? result.message : 'Delete Group Error';
              console.log(`error ${JSON.stringify(res)}`);
            }
          }
          this.hideAlert();
        }
      });
    }
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
