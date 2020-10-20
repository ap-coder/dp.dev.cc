<template>
    <div class="sdksDiv">
        <div class="functionBar">
            <div class="searchBar">
                <input placeholder="" class="textInput" v-model="searchValue">
                <a :href="`#${currentPath}`" class="deleteBtn" @click.prevent="resetSearch"></a>
                <a :href="`#${currentPath}`" class="searchBtn" @click.prevent="search"></a>
            </div><!--searchBar-->
            <a href="#" class="blueBtn" v-if="showEdit" @click.prevent="addData">Add New</a>
            <div class="clear"></div>

        </div><!--functionBar-->
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
import {CACHE_USER_KEY, DELIVERY_FILE_TYPE, ROLE_ID} from "@/utils/Constant";
import * as Tools from '@/utils/tools';
import Notification from "@/utils/notice_manager";
import common from '@M/common';

export default {
    name: "SDKView",
    mixins: [common],
    components: {
        TableView
    },
    data() {
        return {
            filter: -1,
            searchValue: '',
            pageIndex: 1,
            limit: 20,
            sortBy: '',
            sortByValue: 'desc',
            loading: false,
            list: [],
            header: {},
            messageDialog: {
                title: '',
                content: '',
                confirm: () => {},
                cancel: () => {},
                visible: false
            }
        }
    },
    created() {
        this.loadData();

      Notification.addObserver('sku_refresh' ,()=>{
        this.loadData();
      });
    },
    computed:{
        ...mapGetters(['getUserInfo','getUserPermission']),
        getCurrentPermission(){
            return Tools.getUserPermission('SKUs');
        },
        showEdit(){
            if (this.getCurrentPermission && this.getCurrentPermission.subItems.length){
                return this.getCurrentPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
            }
            return false;
        },
        fileTypeList() {
            return DELIVERY_FILE_TYPE.filter(item => item.key > -1);
        },
        columnKeys() {
            let list = [
                { value: 'displayName', text: 'SKU Name', sortable: true, required: false, role: [
                    ROLE_ID.LEGAL_ROLE_ID,
                    ROLE_ID.PRODUCT_ROLE_ID,
                    ROLE_ID.ADMIN_ROLE_ID,
                    ROLE_ID.SALES_ROLE_ID,
                    ROLE_ID.OPERATIONS_ROLE_ID,
                    ROLE_ID.SUPPORT_ROLE_ID
                ] },
                { value: 'type', text: 'Type', sortable: true, required: true, isSelectText:true, options:
                       this.fileTypeList, role: [
                    ROLE_ID.LEGAL_ROLE_ID,
                    ROLE_ID.PRODUCT_ROLE_ID,
                    ROLE_ID.ADMIN_ROLE_ID,
                    ROLE_ID.SALES_ROLE_ID,
                    ROLE_ID.OPERATIONS_ROLE_ID,
                    ROLE_ID.SUPPORT_ROLE_ID
                ] },
                { value: 'note', text: 'Description', sortable: true, required: true },
                { value: 'version', text: 'Version', sortable: true, required: true, role: [
                    ROLE_ID.LEGAL_ROLE_ID,
                    ROLE_ID.PRODUCT_ROLE_ID,
                    ROLE_ID.ADMIN_ROLE_ID,
                    ROLE_ID.SALES_ROLE_ID,
                    ROLE_ID.OPERATIONS_ROLE_ID,
                    ROLE_ID.SUPPORT_ROLE_ID
                ] },
                { value: 'updatedDate', text: 'Updated Date', isDate: true, sortable: true, required: false, role: [
                    ROLE_ID.LEGAL_ROLE_ID,
                    ROLE_ID.PRODUCT_ROLE_ID,
                    ROLE_ID.ADMIN_ROLE_ID,
                    ROLE_ID.SALES_ROLE_ID,
                    ROLE_ID.OPERATIONS_ROLE_ID,
                    ROLE_ID.SUPPORT_ROLE_ID
                ] },
                // { value: 'ownerName', text: 'Author', sortable: true, required: true },
                { value: 'function', text: '', sortable: false, required: false ,isEvent:true }
            ];

            return list.filter((item) => {
                if (item.text === 'Function') {
                    return true;
                }
                return item.role && item.role.indexOf(this.getUserInfo.role) > -1;
            });
        }
    },
    methods: {
        ...mapActions([
            'getSDKList',
            'deleteSDK',
            'showAlert',
            'hideAlert'
        ]),
        async loadData(){
            if (this.$router.currentRoute.path.indexOf('sdk') === -1) {
                return;
            }
            console.log(`=== getSDKList ===`, this.getUserInfo);
            const token = localStorage.getItem(CACHE_USER_KEY);
            this.loading = true;
            const res = await this.getSDKList({
                token: (this.getUserInfo && this.getUserInfo.token) ? this.getUserInfo.token: token,
                searchValue: this.searchValue,
                filter: this.filter === -1 ? '' : this.filter,
                pageIndex: this.pageIndex,
                limit: this.limit,
                sortBy: this.sortBy,
                sortByValue: this.sortByValue
            });

            if (res){
                const results = res.data.data;
                this.list = results.list;
                this.header = results.header;
            }
            this.loading = false;
        },
        addData(){
            Notification.notifyObservers('pushSubPath', {label: 'Add New', path:'/home/skuDetail'});
            this.$router.push({ path:'/home/skuDetail', query: {id: ''} });
        },
        cellEvent(edit){
            if (edit.key === 'download'){
                const link = document.createElement('a');
                link.href = edit.item.originURL;
                link.download = edit.item.fileName;
                link.click();
            } else if (edit.key === 'delete'){
                this.showAlert({
                    content: 'Are you sure delete this sku?',
                    confirmEvent: async () => {
                        await this.deleteFileEvent(edit);
                        this.hideAlert();
                    }
                });
            }
            else {
                this.toTop();
                this.showDialog({
                    visible: true,
                    component: 'SDKDetailView',
                    id: edit.item.fileId
                });
            }
        },
        async deleteFileEvent(edit){
            const token = localStorage.getItem(CACHE_USER_KEY);
            const res = await this.deleteSDK({
                token: this.getUserInfo ? this.getUserInfo.token : token,
                fileId: edit.item.fileId,
            });
            if (res) {
                const results = res.data;
                if (results.statusCode === 0) {
                    this.loadData();
                }
            }
        },
        search() {
            this.loadData();
        },
        resetSearch(){
          this.searchValue = '';
          this.loadData();
        },
        changeStatus(){
            this.loadData();
        },
        changePage(pagination) {
            this.limit = pagination.limit;
            this.pageIndex = pagination.page;
            this.sortBy = pagination.sortBy;
            this.sortByValue = pagination.sortByValue;
            this.loadData();
        }
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
