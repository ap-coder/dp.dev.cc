<template>
    <div class="messageAddDiv">

        <div class="shareBox">
        <h4>Share</h4>
        <div class="con">
            <div class="radioBox">
                <input type="radio" id="all" name="msg" v-model="shareRadio" :value="-1">
                <label for="all">
                <span class="labelGray"></span>
                <span class="labelRed"></span>
                All
                </label>
                <input type="radio" id="customer" name="msg" v-model="shareRadio" :value="0">
                <label for="customer">
                <span class="labelGray"></span>
                <span class="labelRed"></span>
                Customer
                </label>
                <input type="radio" id="Group" name="msg" v-model="shareRadio" :value="1">
                <label for="Group">
                <span class="labelGray"></span>
                <span class="labelRed"></span>
                Group
                </label>
            </div>
            <!--
            上方radiobtn選all時同時隱藏div customerBar & groupBar ;
            上方radiobtn選costomer時則顯示customerbar、隱藏groupBar
            上方radiobtn選group時則顯示groupBar、隱藏customerBar ;
            -->
            <!--for customer start-->
            <div class="customerBar" v-if="shareRadio === 0">
                <div class="searchBar">
                    <input placeholder="Account" class="textInput" v-model="selectUserName" @keyup="keyUpEvent">
                    <a target="_self"  class="deleteBtn" @click="reset"></a>
                    <a target="_self"  class="blueBtn" @click="addSelect">Add</a>
                    <ul v-if="filterList.length">
                        <li
                            v-for="(item, i) in filterList"
                            :key="i"
                            @click.prevent="selectedSearchResult(item)"><a href="#">{{item.displayName}}</a></li>
                    </ul>
                </div><!--searchBar-->
                <div class="tableBox">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th></th>
                      </tr>
                      <tr>
                        <th colspan="2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectItems" :key="item.userId">
                        <td><span>{{item.displayName}}</span></td>
                        <td><a class="deleteTxtBtn" @click="deleteUser(item)">Delete</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div><!--tableBox-->
                <div class="clear"></div>
<!--                <div class="pageBar">-->
<!--                    <div>-->
<!--                      <span>1-5&nbsp;of&nbsp;26</span>-->
<!--                      <select class="select">-->
<!--                        <option>5</option>-->
<!--                      </select>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                      <button class="preBtn"></button>-->
<!--                      <button class="nextBtn"></button>-->
<!--                    </div>-->
<!--                </div>&lt;!&ndash;pageBar&ndash;&gt;-->
                <span class="msg" v-if="customerMessage">{{customerMessage}}</span>
            </div><!--customerBar-->


            <!--for customer end-->
            <!-- for group start-->

            <div class="searchBar groupBar" v-if="shareRadio === 1">
                <input placeholder="" class="textInput" v-model="selectUserName" @keyup="keyUpEvent">
                <span class="msg" v-if="groupMessage">{{groupMessage}}</span>
                <ul v-if="searchResult.results.length">
                    <li
                        v-for="(item, i) in searchResult.results"
                        :key="i"
                        @click.prevent="selectedSearchResult(item)"><a href="#">{{item.name}}</a></li>
                </ul>
            </div>

            <!--for group end-->
        </div><!--con-->
        <div class="clear"></div>
        </div><!--shareBox-->
        <div class="messageBox">
            <h4>Message</h4>
            <div class="tit">title</div>
            <div class="con">
            <input placeholder="Title" class="textInput" v-model="item.title">
            <span class="msg" v-if="titleMessage">{{titleMessage}}</span>
            </div><!--con-->
            <div class="clear"></div>
            <div class="tit">Content</div>
            <div class="con">
            <div class="rowDiv inputDiv" style="height:335px;">
            <!--html編輯器可放於此-->
                <quill-editor
                    ref="QuillEditor"
                    v-model="item.content"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"/>

            </div>
            </div><!--con-->
            <span class="msg" v-if="contentMessage">{{contentMessage}}</span>
            <div class="clear"></div>
        </div><!--messageBox-->
        <div class="clear"></div>
        <div class="rowBtn">
            <a class="redBtn" @click.prevent="save">
                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                    :width="2"
                                    v-if="saveLoading" :value="20"></v-progress-circular>
                <span v-else>Save</span>
            </a>
            <a class="grayBtn" @click.prevent="cancel">Back</a>
        </div>
    </div><!--messageAddDiv-->
</template>

<script>
import { mapActions } from 'vuex';
import common from '@M/common';
import { quillEditor } from 'vue-quill-editor';
import Notification from "@/utils/notice_manager";
import {CACHE_USER_KEY} from "../../utils/Constant";

export default {
    components:{
        quillEditor
    },
    mixins: [common],
    data() {
        return {
            shareRadio: 0,
            timer: null,
            selectUserName: '',
            selectUser: {},
            search: null,
            selectItems: [],
            header: {},
            loading: false,
            saveLoading: false,
            searchResult:{
                item: null,
                loading: false,
                results: [],
            },
            item: null,
            defaultItem: {
                title: '',
                content: '',
                shareType: '0'
            },
            editorOption: {},
            customerMessage: '',
            groupMessage: '',
            titleMessage: '',
            contentMessage: '',
            filterList: [],
        }
    },
    created() {
        this.item = Object.assign({} , this.defaultItem);
    },
    computed: {
        columnKeys() {
            let list = [
                { value: 'account', text: 'Account', sortable: true, required: false },
                { value: 'delete', text: 'Delete', sortable: false, required: false ,isEvent:true },
            ];
            return list;
        },
        editor() {
            return this.$refs.QuillEditor.quill
        }
    },
    watch: {
        async search(val) {
            console.log(`search ${val}`);
            if (!val){
                return ;
            }

            if (this.searchResult.results.length === 0){
                if (this.shareRadio === 0){
                    const results = await this.getCustomerList({ token: this.getUserInfo.token,
                        query: {
                            searchValue:'',
                            sortBy: 'registeredDate',
                            sortValue: 'DESC',
                            pageIndex: 1, limit: 1000
                        }});
                    const res = results.data.data;
                    this.$set(this.searchResult, 'results', res.list);
                }

                if (this.shareRadio === 1) {
                    const results = await this.getGroupList({ token: this.getUserInfo.token,
                        searchValue: val,
                        pageIndex: 1, limit: 10,
                    });
                    const res = results.data.data;
                    console.log(res.list);

                    this.$set(this.searchResult, 'results', res.list);
                }
            }
            this.filterList = this.searchResult.results.filter(item=>{
                if (this.shareRadio === 0){
                    return `${item.account}`.indexOf(val)> -1
                }
                if (this.shareRadio === 1){
                    return `${item.name}`.indexOf(val)> -1
                }
                return false;
            });
        }
    },
    methods: {
        ...mapActions([
            'getCustomerList',
            'getGroupList',
            'createMessageInfo'
        ]),
        keyUpEvent() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                // this.search = this.selectUser.account;
                this.search = this.selectUserName;
            }, 0.5 * 1000);
        },
        selectedSearchResult(item) {
            this.selectUser = item;

            if (this.shareRadio === 0){
                this.selectUserName = item.displayName;
            } else if (this.shareRadio === 1){
                this.selectUserName = item.name;
                this.selectItems.push(item);
            }

            this.searchResult.results = [];
            this.filterList = [];
        },
        addSelect(){
          console.log(`add select ${JSON.stringify(this.selectUser)}`);
          if (this.selectUser.userId){
            const exist = this.selectItems.find(user => {
              return user.userId === this.selectUser.userId;
            });
            if (!exist) {
              this.selectItems.push(this.selectUser);
              this.reset();
            }
          }
        },
        reset() {
            this.selectUser = {};
            this.selectUserName = '';
            this.search = null;
            this.searchResult.results = [];
            this.searchResult.item = '';
            this.filterList = [];
        },
        deleteUser(item) {
            const { userId } = item;
            this.selectItems = this.selectItems.filter((selectItem) => {
                return selectItem.userId !== userId;
            })
        },
        changePage() {},
        cellEvent() {},
        checkUpload(){
            let hasError = false;
            if (this.item.title === '') {
                hasError = true;
                this.titleMessage = 'Title is required';
            } else if (this.item.content === '') {
                hasError = true;
                this.contentMessage = 'Content is required';
            } else if (this.shareRadio !== -1 && this.selectItems.length === 0) {
                hasError = true;
                this.customerMessage = 'Share Users is required';
            }

            console.log(`失敗 ${hasError} / ${this.shareRadio} ${this.selectItems.length}`);
            if (hasError){
                return false;
            }
            return  true;
        },
        async save() {
            if (!this.checkUpload()){
                return;
            }
            this.saveLoading = true;
            this.item.owner = this.getUserInfo.userId;
            this.item.shareUsers = this.selectItems;
            this.item.shareType = this.shareRadio;
            const token = localStorage.getItem(CACHE_USER_KEY);
            let res = await this.createMessageInfo({
                token: token ? token: this.getUserInfo.token,
                info : this.item});

            this.saveLoading = false;
            const result = res.data;

            if (result.statusCode === 0) {
                console.log('上傳成功');
            }
            this.reset();
            this.cancel();
        },
        onEditorBlur(quill) {
            console.log('editor blur!', quill)
        },
        onEditorFocus(quill) {
            console.log('editor focus!', quill)
        },
        onEditorReady(quill) {
            console.log('editor ready!', quill);
            this.editor.container.style.height = '240px';
        },
        cancel(){
            Notification.notifyObservers('popSubPath');
            this.$router.back();
        }
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
