<template>
  <div class="functionBar">
    <div class="form">
      <div class="rowDiv" v-if="showRadioButton && !isDisabled">
        <v-radio-group v-model="radioGroup" row @change="changeRadio">
          <v-radio label="All" color="#ad1f25" v-if="enableShareAll === true"
                   value="-1"
          ></v-radio>
          <v-radio label="Customer" color="#ad1f25"
                   value="0"
          ></v-radio>
          <v-radio label="Group" color="#ad1f25"
                   value="1"
          ></v-radio>
        </v-radio-group>
      </div>
      <div class="rowDiv" v-if="radioGroup !== '-1'">
        <div class="searchBar">
          <input placeholder="email/name/company" class="textInput" :style="{ width: getInputWidth }" @keyup="keyUpEvent" v-model="selectUserName"
                 :disabled="isDisabled">
          <a v-if="showClearButton" href="#" class="deleteBtn" @click.prevent="resetGroupUser"> </a>
          <a v-if="showSearchButton" :href="`#`" class="searchBtn"></a>

          <ul v-if="radioGroup === '0' && filterList.length" :style="{ width: getInputWidth }">
            <li v-for="item in filterList"
                :key="item.userId"
                @click.prevent="selectedSearchResult(item)">
              <a href="#">{{ getFileUserInfo(item) }}</a>
            </li>
          </ul>
          <ul v-else-if="radioGroup === '1' && filterList.length" :style="{ width: getInputWidth }">
            <li
                v-for="item in filterList"
                :key="item.groupId"
                @click.prevent="selectedSearchResult(item)">
              <a href="#">{{ item.name }}</a>
            </li>
          </ul>
        </div><!--searchBar-->
      </div>
      <div class="rowDiv mt-4" v-if="radioGroup === '0' && selectUser.groupName && selectUser.groupName !==''">
        <div class="checkBox">
          <input type="checkbox" v-model="shareToGroupUser" id="c1" name="cc"/>
          <label for="c1">
            <span class="labelGray"></span>
            <span class="labelRed"></span>
            Share to the users in the same group - Group name: {{getGroupName}}
          </label>
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowDiv mt-4" v-if="enableMultiSelect && radioGroup === '0'">
        <table-view
            :column-keys="columnKeys"
            :loading="loading"
            :items="selectItems"
            :header="header"
            :hiddenPagination="true"
            @changePage="changePage"
            @cellEvent="cellEvent"></table-view>
      </div>
      <div class="rowDiv" v-if="message !==''">
        <span class="red--text">{{ message }}</span>
      </div>
      <div class="clear mt-2"></div>
      <div class="rowBtn" v-if="showSaveButton">
        <a href="#" class="redBtn" @click.prevent="saveGroup">
          <v-progress-circular color="#ffffff" indeterminate :size="28"
                               :width="2"
                               v-if="saveLoading" :value="20"></v-progress-circular>
          <span v-else>Save</span>
        </a>
        <!--                <a href="#" class="grayBtn" @click.prevent="cancel()">Back</a>-->
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {CACHE_USER_KEY} from "@/utils/Constant";
import TableView from '@C/TableView';
import common from "@M/common";

export default {
  name: "ShareGroupView",
  mixins: [common],
  props: {
    message: String,
    enableShareAll: Boolean,
    showSaveButton: Boolean,
    showRadioButton: Boolean,
    showClearButton: Boolean,
    showSearchButton: Boolean,
    showNotice: Boolean,
    enableMultiSelect: Boolean,
    reset: Boolean,
    isFile: Boolean,
  },
  components: {
    TableView,
  },
  data() {
    return {
      selectUserName: '',
      shareToGroupUser: false,
      radioGroup: '0',
      selectUser: {},
      selectItems: [],
      header: {
        totalCount: 0,
        pageIndex: 1,
        limit: 10,
      },
      searchResult: {
        item: null,
        loading: false,
        results: [],
      },
      search: '',
      saveLoading: false,
      loading: false,
      filterList: [],
    }
  },
  watch: {
    selectUserName(val){
      if (!val || val === ''){
        this.selectUser.groupName = '';
      }
    },
    async search(val) {
      console.log(`search ${this.radioGroup} / ${val}`);
      if (!val) {
        return;
      }
      this.selectMessage = '';
      // Items have already been loaded
      console.log(`searchResult ${JSON.stringify(this.searchResult)}`);
      if (this.searchResult.results.length === 0) return;

      this.filterList = this.searchResult.results.filter(item => {
        if (this.radioGroup === '0') {
          const text = `${item.email}${item.firstName}${item.lastName}${item.company}`.toLowerCase();
          return text.indexOf(val.toLowerCase()) > -1
        }
        if (this.radioGroup === '1') {
          return `${item.name}`.indexOf(val) > -1
        }
        return false;
      });
      console.log(`filterList === ${this.filterList.length}`);
    },
    reset(value) {
      console.log(`reset == ${value}`);
      if (value === true) {
        this.search = '';
        this.selectUserName = '';
        this.selectItems = [];
        this.filterList = [];
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.loadUserDetail();
    } else {
      this.loadData();
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    getInputWidth(){
      return this.isMobile ? '100%' : '600px';
    },
    getGroupName(){
      if (this.selectUser.groupName){
        return  this.selectUser.groupName;
      }
      return '--';
    },
    columnKeys() {
      return [
        {value: 'email', text: 'Email', sortable: true, required: false},
        {value: 'delete', text: 'Delete', sortable: true, required: true, isEvent: true},
      ];
    },
    isDisabled() {
      console.log(`id == ${this.dialogInfo.id}`);
      if (this.dialogInfo.id === ''){
        return false;
      } else {

        return this.$route.query.id !== '';
      }
    }
  },
  methods: {
    ...mapActions(['getCustomerList', 'getGroupList', 'getUserDetail']),
    getFileUserInfo(item){
      console.log(`getFileUserInfo ${JSON.stringify(item)}`);
      return `${item.email} - ${item.firstName} ${item.lastName}, ${!item.company || item.company === '' ? '--':item.company}`;
    },
    async loadData() {
      this.searchResult.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      let results;
      if (this.radioGroup === '0') {
        results = await this.getCustomerList({
          token: token ? token : this.getUserInfo.token,
          query: {
            searchValue: '',
            sortBy: 'registeredDate',
            sortValue: 'DESC',
            pageIndex: 1, limit: 1000
          }
        });
        console.log(`getCustomerList ${JSON.stringify(results)}`);
      } else {
        results = await this.getGroupList({
          token: token ? token : this.getUserInfo.token,
          searchValue: '',
          pageIndex: 1, limit: 10
        });
        console.log(`getGroupList ${JSON.stringify(results)}`);
      }

      const res = results.data;
      if (res) {
        console.log(`searchResult ${JSON.stringify(res.data)}`);
        this.searchResult.results = res.data.list;
      }
      this.searchResult.loading = false;
    },
    async loadUserDetail() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      const userId = this.$route.query.id;
      if (userId && userId !== '') {
        const res = await this.getUserDetail({
          token: token ? token : this.getUserInfo.token,
          user: {
            userId
          }
        });
        if (res.data) {
          // this.itemDetail = res.data.data;
          const userDetail = res.data.data;
          this.selectedSearchResult(userDetail);
          // if (!this.itemDetail.groupId){
          // this.itemDetail.groupId = '';
          // this.$set(this.itemDetail, 'groupId', '');
          // }
          // await this.loadUserFiles();
        } else {
          console.log(`error ${JSON.stringify(res.data)}`);
        }
      } else {
        // this.itemDetail = Object.assign({}, this.defaultItem);
        // this.itemDetail.parentId = this.getUserInfo.userId;
      }
    },
    changePage(page) {
      this.header.pageIndex = page.page;
      this.header.limit = page.limit;
    },
    cellEvent(edit) {
      console.log(`cell event ${JSON.stringify(edit)}`);
      if (edit.key === 'delete') {
        // this.selectItems.splice()
        let i = 0;
        this.selectItems.forEach((user, index) => {
          if (user === edit.item.userId) {
            i = index;
          }
        });
        this.selectItems.splice(i, 1);
      }
    },
    keyUpEvent() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // this.search = this.selectUser.account;
        this.search = this.selectUserName;
      }, 0.5 * 1000);
    },
    selectedSearchResult(item) {
      console.log(`selectedSearchResult == ${JSON.stringify(item)}`);
      this.selectUser = item;

      if (this.radioGroup === '0') {
        this.selectUserName = this.getFileUserInfo(item);
      } else if (this.radioGroup === '1') {
        this.selectUserName = item.name;
      }

      this.selectItems.push(item);
      this.header.totalCount = this.selectItems.length;

      this.filterList = [];
      // this.searchResult.results = [];
      this.saveItem();
    },
    resetGroupUser() {
      this.selectUserName = '';
      this.search = '';
      this.selectUser = {};
      // this.searchResult.results = [];
      this.searchResult.item = '';
      // this.selectItems = [];
      this.filterList = [];
      this.$emit('clear');
    },
    saveGroup() {
      this.saveItem();
    },
    saveItem() {
      if (this.radioGroup === '0') {
        this.$emit('save', {
          isGroup: false,
          items: this.selectItems,
          shareToGroupUser: this.shareToGroupUser,
        });
      } else if (this.radioGroup === '1') {
        this.$emit('save', {
          isGroup: true,
          group: this.selectUser
        });
      }
    },
    changeRadio() {
      this.$emit('changeRadio', this.radioGroup);
      this.loadData();
    },
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
