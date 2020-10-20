<template>
    <div>
      <!-- List -->
      <div v-if="showEditView === false">
        <div class="btnBox">
          <a href="#/home/users" target="_self" class="blueBtn" @click="addGroup">Add Groups</a>
        </div>
        <div class="groupsContent">
          <flat-table-view :column-keys="groupColumnKeys"
                           :loading="loading"
                           :items="groupList"
                           :total-items="groupTotal"
                           @changePage="changePage"
                           @cellEvent="cellEvent"></flat-table-view>
        </div>
      </div>

      <!--Edit Group-->
      <div class="groupsAddDiv" v-if="groupVisible === false && showEditView===true">
        <div class="rowLeft">
          <h4>Group Name</h4>
          <div class="con">
            <input
              type="text"
              v-model="groupItem.name"
              class="textInput"
              value="name">
<!--           redInput <span class="msg">Group name already exists.</span>-->
          </div>
        </div><!--rowLeft-->
        <div class="rowRight">
          <h4>Group Users</h4>
          <div class="searchBar">
            <input placeholder="Account" class="textInput" @keyup="keyUpEvent" v-model="selectUser.account">
            <a href="#" class="deleteBtn" @click.prevent="resetGroupUser"></a>
            <a href="#" class="blueBtn" @click.prevent="addUserEvent">Add</a>
            <ul v-if="searchResult.results.length">
              <li
                v-for="item in searchResult.results"
                :key="item.userId"
                @click="selectedSearchResult(item)">
                <a href="#">{{item.account}}</a>
              </li>
            </ul>
          </div><!--searchBar-->

          <div class="tableBox">
            <table class="table">
              <thead>
                <tr>
                  <th
                    v-for="item in groupUserKeys"
                    :key="item.value">{{item.text}}</th>
                </tr>
                <tr>
                  <th colspan="2"></th>
                </tr>
              </thead>
              <tbody v-if="groupItem">
                <tr
                  v-for="item in groupItem.users"
                  :key="item.userId">
                  <td><span>{{item.account}}</span></td>
                  <td><a href="#" class="redBtn" @click.prevent="removeUser(item)">Delete</a></td>
                </tr>
              </tbody>
            </table>
          </div><!--tableBox-->
          <div class="clear"></div>
          <div class="pageBar">
              <div>
                <span>1-5&nbsp;of&nbsp;26</span>
                <select class="select">
                  <option>5</option>
                </select>
              </div>
              <div>
                <button class="preBtn"></button>
                <button class="nextBtn"></button>
              </div>
          </div><!--pageBar-->
        </div><!--rowRight-->
        <div class="clear"></div>
        <div class="rowBtn">
          <a href="#" class="redBtn" @click.prevent="saveGroup">Save</a>
          <a href="#" class="grayBtn" @click.prevent="back()">Back</a>
        </div>
      </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    // import TableView from '../components/TableView';
    // import MobileDetect from 'mobile-detect';
    import {CACHE_USER_KEY} from "@/utils/Constant";
    import Notification from "../utils/notice_manager";
    import FlatTableView from "@/components/FlatTableView";
    // const md = new MobileDetect(window.navigator.userAgent);
    export default {
        name: "GroupListView",
        props:{
        },
        components: {
            // TableView,
            FlatTableView
        },
        data(){
            return {
                valid: false,
                loading: false,
                groupVisible: true,
                groupList: [],
                pageIndex: 1,
                limit: 10,
                groupTotal: 0,
                showEditView: false,
                editGroup:false,
                saveGroupLoading: false,
                defaultGroup: {
                    groupId: '',
                    name:'',
                    users:[],
                },
                groupItem:{},
                errorMessage:'',
                selectUser: {},
                searchResult:{
                    item: null,
                    loading: false,
                    results: [],
                },
                search: null,
                selectMessage:'',
                timer: null
            }
        },
        watch: {
            async search(val) {
                console.log(`search ${val}`);
                if (!val){
                    return ;
                }
                this.selectMessage = '';
                // Items have already been loaded
                console.log(`searchResult ${JSON.stringify(this.searchResult)}`);
                if (this.searchResult.results && this.searchResult.results.length > 0) return;

                // Items have already been requested
                if (this.searchLoading) return;

                this.searchResult.loading = true;

                const results = await this.getCustomerList({ token: this.getUserInfo.token ,
                  query: {
                    searchValue:'',
                    sortBy: 'registeredDate',
                    sortValue: 'DESC',
                    pageIndex: 1, limit: 1000
                  }});
                // console.log(`getCustomerList ${JSON.stringify(results)}`);
                const res = results.data;
                if (res){
                    this.searchResult.results = res.data.list;
                }
                this.searchResult.loading = false;
            },
        },
        async created(){
            if (this.$router.currentRoute.path.indexOf('users') > -1) {
                this.loadGroupList();
            }
        },
        computed: {
            ...mapGetters(['getUserInfo', 'getMenuList', 'getRoleList']),
            groupColumnKeys() {
                return [
                    // { value: 'groupId', text: 'Group ID', sortable: true, required: false },
                    { value: 'name', text: 'Group Name', sortable: false, required: true },
                    { value: 'userList', text: 'Group Users', sortable: false, required: true },
                    { value: 'createdDate', text: 'Created Date', sortable: false, required: true, isDate: true },
                ];
            },
            groupUserKeys() {
                return [
                    // { value: 'userId', text: 'User ID', sortable: true, required: false },
                    { value: 'account', text: 'Account', sortable: false, required: true },
                    { value: 'delete', text: '', sortable: false, required: true, isEvent: true },
                ];
            },
            getGroupTitle(){
                if (this.editGroup){
                    return 'Edit Group';
                }
                return 'New Group';
            },
        },
        methods: {
            ...mapActions(['getGroupList', 'createGroup', 'updateGroup', 'configUserDetail','getCustomerList']),
            back() {
                // this.$router.back();
                this.showEditView = false;
                Notification.notifyObservers('popSubPath');
                this.loadGroupList();
            },
            changePage(page){
                this.pageIndex = page.page;
                this.limit = page.rowsPerPage;
                if (this.limit > this.groupTotal){
                  this.pageIndex = 1;
                }
                this.loadGroupList();
            },
            refreshData(){
                this.groupList = [];
                this.loadGroupList();
            },
            cellEvent(edit){
                console.log(`cell event ${JSON.stringify(edit)}`);
                // this.errorMessage = '';
                // this.showEditView = true;
                // this.groupVisible = false;
                // this.editGroup = true;
                // this.groupItem = edit.item;
                Notification.notifyObservers('pushSubPath', {label: 'Group Detail'});
                // this.loadGroupList();

                this.$router.push({path: '/home/groupDetail', query:{ id: edit.item.groupId}});
            },
            async loadGroupList(){
                this.groupVisible = false;
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                console.log(`load group1 ${token}  ${this.getUserInfo.token}`);
                const results = await this.getGroupList({
                  token: token ? token :  this.getUserInfo.token,
                  searchValue:'',
                  pageIndex: this.pageIndex,
                  limit: this.limit
                });
                if (results && results.data){
                    if (results.data.statusCode === 0){
                        this.groupList = results.data.data.list;
                        this.groupTotal = results.data.data.header.totalCount;
                        console.log(`groupList == ${JSON.stringify(this.groupList)}`);
                        this.groupList.forEach(group=>{
                            group.userList = '';
                            group.users.forEach((user, i)=>{
                                group.userList += `${user.account}${i < group.users.length - 1 ? ', ':''}`;
                            });
                        });
                    }
                    this.loading = false;
                }
            },
            addGroup(){
                this.showEditView = true;
                this.groupItem = Object.assign({}, this.defaultGroup);
                Notification.notifyObservers('pushSubPath', {label: 'Add Group'});
            },
            async saveGroup(){
                if (this.groupItem.name === ''){
                    this.errorMessage = 'group name is required';
                    return;
                }
                this.saveGroupLoading = true;
                console.log(`save group ${this.getUserInfo} ${JSON.stringify(this.groupItem)}`);
                let res;
                if (this.editGroup === true) { // 儲存
                    res = await this.updateGroup({
                        token: this.getUserInfo.token,
                        group: {
                            groupId: this.groupItem.groupId,
                            name: this.groupItem.name,
                            users: this.groupItem.users,
                        }
                    });
                } else { //新增
                    res = await this.createGroup({
                        token: this.getUserInfo.token,
                        group: {
                            name: this.groupItem.name,
                            users: this.groupItem.users,
                        }
                    });
                }

                this.saveGroupLoading = false;
                console.log(JSON.stringify(res.data));
                if (res && res.data){
                    this.errorMessage = res.data.message;
                    this.resetGroupUser();
                    this.back();
                } else {
                    this.errorMessage = res.data ? res.data.message : 'Save Error';
                }
            },
            // changeSelect(){
            //     if (this.search.results.length > 0){
            //         this.selectUser = this.search.results.find(user=>{
            //             return user.userId === this.search.select;
            //         });
            //     }
            // },
            addUserEvent(){
                const exist = this.groupItem.users.find(user=>{
                    return user.userId === this.selectUser.userId;
                });
                if (!exist){
                    this.groupItem.users.push({
                        userId: this.selectUser.userId,
                        account: this.selectUser.account
                    });
                    console.log(`group ${JSON.stringify(this.groupItem)}`);
                }
            },
            removeUser(item) {
              console.log(item);
              this.groupItem.users = this.groupItem.users.filter(user => user.userId !== item.userId);
            },
            resetGroupUser(){
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
              this.selectUser = item;
              this.searchResult.results = [];
            }
        }
    }
</script>

<style scoped src="../assets/css/all-admin.css">

</style>
<style scoped src="../assets/css/users.css">

</style>
