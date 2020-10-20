<template>
    <div class="messageDiv">
        <div class="functionBar">
            <a href="#" class="blueBtn" v-if="showEdit" @click.prevent="addData">Add New</a>
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

        <!-- <alert-view :visible="messageDialog.visible"
                    :title="messageDialog.title"
                    :content="messageDialog.content"
                    :show-cancel="true"
                    @confirmEvent="messageDialog.confirm"
                    @cancelEvent="messageDialog.cancel"></alert-view> -->
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import TableView from '@C/TableView';
    import * as Tools from "@/utils/tools";
    import {CACHE_USER_KEY, FILE_TYPE} from "@/utils/Constant";
    import Notification from "@/utils/notice_manager";
    import common from '@M/common';

    export default {
        mixins: [common],
        components: {
            TableView,
        },
        data() {
            return {
                filter: -1,
                searchValue: '',
                pageIndex: 1,
                limit: 20,
                loading: false,
                list: [],
                header: {},
                totalItems: 0
            }
        },
        created() {
            this.loadData();
        },
        computed:{
            ...mapGetters(['getUserInfo','getUserPermission']),
            getCurrentPermission(){
                return Tools.getUserPermission('Messages');
            },
            showEdit(){
                if (this.getCurrentPermission && this.getCurrentPermission.subItems.length){
                    return this.getCurrentPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
                }
                return false;
            },
            fileTypeList() {
                return FILE_TYPE.filter(item => item.key > -1);
            },
            columnKeys() {
                let list = [
                    { value: 'title', text: 'Message', sortable: true, required: false },
                    { value: 'status', text: 'Status', sortable: false, required: false
                      , options: [{ key: 0, text: 'Unread'},{ key: 1, text: 'read'}]},
                    { value: 'createdDate', text: 'Date', sortable: true, required: false, isDate: true},
                    // { value: 'delete', text: 'Delete', sortable: false, required: false ,isEvent:true },
                    { value: 'delete', text: '', sortable: false, required: false ,isEvent:true }
                ];
                if (this.isCustomer){
                    return list.filter(menu=>menu.value !== 'delete');
                }
                return list;
            }
        },
        methods: {
            ...mapActions([
                'getMessageList',
                'deleteMessageInfo',
                'showAlert',
                'hideAlert'
            ]),
            async loadData(){
                console.log(`=== getMessageList ===`, this.getUserInfo);
                const token = localStorage.getItem(CACHE_USER_KEY);
                this.loading = true;
                const res = await this.getMessageList({
                    token: token ? token : this.getUserInfo.token,
                    searchValue: this.searchValue,
                    filter: this.filter === -1 ? '' : this.filter,
                    pageIndex: this.pageIndex,
                    limit: this.limit,
                });

                if (res){
                    const results = res.data.data;
                    this.list = results.list;
                    this.totalItems = res.data.totalCount;
                    this.header = results.header;
                }
                this.loading = false;
                Notification.notifyObservers('refreshUnReadCount');
            },
            addData(){
                Notification.notifyObservers('pushSubPath', {label: 'Add New'});
                this.$router.push({ path:'/home/messageAdd' });
            },
            cellEvent(edit){
                console.log(` cellEvent == ${JSON.stringify(edit)}`);
                if (edit.key === 'delete'){
                    this.showAlert({
                        content: 'Are you sure delete this message?',
                        confirmEvent: async () => {
                            await this.deleteFileEvent(edit);
                            this.hideAlert();
                        }
                    });
                }
                else {
                    Notification.notifyObservers('pushSubPath', {label: 'Message Detail'});
                    this.$router.push({ path: '/home/messageDetail' , query:{ id: edit.item.messageId }});
                }
            },
            search() {
                this.loadData();
            },
            changeStatus(){
                this.loadData();
            },
            changePage(pagination) {
                this.limit = pagination.limit;
                this.pageIndex = pagination.page;
                this.loadData();
            },
            async deleteFileEvent(edit){
                const token = localStorage.getItem(CACHE_USER_KEY);
                const res = await this.deleteMessageInfo({
                    token: token ? token : this.getUserInfo.token,
                    info: {
                        messageId: edit.item.messageId,
                    },
                });
                if (res) {
                    const results = res.data;
                    if (results.statusCode === 0) {
                        this.loadData();
                    }
                }
            },
        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
