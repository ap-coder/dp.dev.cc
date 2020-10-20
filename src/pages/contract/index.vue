<template>
    <div class="contractDiv">
        <div class="functionBar">
            <div class="searchBar">
                <input placeholder="File Name" class="textInput" v-model="searchValue"
                        @keyup.enter="searchEvent">
                <a href="#" @click.prevent="reset" class="deleteBtn"></a>
                <a href="#" @click.prevent="searchEvent" class="searchBtn"></a>
            </div><!--searchBar-->
            <a href="#" @click.prevent="addData" v-if="showEdit" class="blueBtn">Add Contract</a>
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
    import * as Tools from '@/utils/tools';
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
                sortBy: 'createdDate',
                sortByValue: 'desc',
                filter: 8,
                searchValue:'',
                header: {}
            };
        },
        created() {
            this.loadData();

            Notification.addObserver('refresh_contract',()=>{
              this.loadData();
            });
        },
        computed: {
            ...mapGetters(['getUserInfo']),
            getCurrentPermission(){
                return Tools.getUserPermission('Contracts');
            },
            showEdit(){
                if (this.getCurrentPermission && this.getCurrentPermission.subItems.length){
                    return this.getCurrentPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
                }
                return false;
            },
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
                    { value: 'updatedDate', text: 'Updated Date', isDate:true, sortable: true, required: false, role: [
                        ROLE_ID.PRODUCT_ROLE_ID,
                        ROLE_ID.SALES_ROLE_ID,
                        ROLE_ID.OPERATIONS_ROLE_ID,
                        ROLE_ID.SUPPORT_ROLE_ID,
                        ROLE_ID.ADMIN_ROLE_ID,
                        ROLE_ID.LEGAL_ROLE_ID,
                        ROLE_ID.CUSTOMER_ROLE_ID
                    ] },
                    { value: 'accept', text: 'Accept Status', sortable: false, required: false, isSelectText:true, options: [
                        { key:0 , text:'Not Accepted', class: 'txtRed'},
                        { key:1 , text:'Accepted', class: 'txtGray'},
                    ],role: [
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
                    return this.showEdit === false || item.role.indexOf(this.getUserInfo.role) > -1;
                  } else if (item.value === 'function') {
                    if (this.showEdit){
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
                'deleteContractInfo',
                'getContractList',
                'getUserContractList',
                'acceptContractInfo',
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
                res = await this.getContractList({
                    token: token ? token : this.getUserInfo.token,
                    searchValue: this.searchValue,
                    filter: this.filter === -1 ? '' : this.filter,
                    pageIndex: this.pageIndex, limit: this.limit,
                    sortBy: this.sortBy,
                    sortByValue: this.sortByValue
                });
                console.log(`=== getContractList === `, res.data);
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
                component: 'ContractInfoView',
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
                    // if (this.isCustomer){
                    //     Notification.notifyObservers('pushSubPath', { label: 'Contract Detail', path: '/home/contractAccept' });
                    //     this.$router.push({ path: '/home/contractAccept' , query:{ id: edit.item.fileId }});
                    // } else {
                    //     Notification.notifyObservers('pushSubPath', { label: 'Contract Detail', path: '/home/contractInfo' });
                    //     this.$router.push({ path: '/home/contractInfo' , query:{ id: edit.item.fileId }});
                    // }
                    this.showDialog({
                      visible: true,
                      component: 'ContractInfoView',
                      id: edit.item.fileId
                    });
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
                const res = await this.deleteContractInfo({
                    token: this.getUserInfo.token,
                    info: {
                        fileId: edit.item.fileId,
                        userId: edit.item.shareGroup
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
                this.filter = 8;
                this.searchValue = '';
                this.loadData();
            },
        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
