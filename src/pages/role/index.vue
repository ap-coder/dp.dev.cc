<template>
    <div class="usersDiv">
        <table-view
            layoutClass="usersContent"
            :column-keys="columnKeys"
            :header="header"
            :items="list"
            :loading="loading"
            :canEdit="showEdit"
            @changePage="changePage"
            @cellEvent="cellEvent"></table-view>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Notification from "@/utils/notice_manager";
import common from '@M/common';
import TableView from '@C/TableView';
import {CACHE_USER_KEY} from "@/utils/Constant";
import * as Tools from "@/utils/tools";

export default {
    mixins: [common],
    components: {
        TableView
    },
    data() {
        return {
            loading: false,
            list: [],
            pageIndex: 1,
            limit : 5,
            sortBy: '',
            sortByValue: 'desc',
            itemDetail: {},
            header: {}
        }
    },
    computed: {
        ...mapGetters(['getUserInfo']),
        columnKeys() {
            return [
                { value: 'name', text: 'Role Name', sortable: true, required: false, isTextEvent:false},
                // { value: 'authorName', text: 'Author', sortable: true, required: false, isTextEvent:false},
                { value: 'updatedDate', text: 'Updated Date', isDate: true, sortable: true, required: false, isTextEvent:false},
            ];
        },
        getCurrentPermission(){
            return Tools.getUserPermission('Groups & Permissions');
        },
        showEdit(){
            if (this.getCurrentPermission && this.getCurrentPermission.subItems.length){
                const edit = this.getCurrentPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
                console.log(`canEdit == ${edit}`);
                return edit;
            }
            return false;
        },
    },
    created() {
        this.loading = true;
        Notification.addObserver('refresh_user', () => {
            this.loadMenu();
            this.loadData();
        });

        Notification.notifyObservers('checkUserStatus');
    },
    methods: {
        ...mapActions(['loadRoleList','saveRoleInfo','loadRoleMenuList','getRoleInfo']),
        changePage(page){
            this.pageIndex = page.page;
            this.limit = page.limit;
            this.sortBy = page.sortBy;
            this.sortByValue = page.sortByValue;
            this.loadData();
        },
        async loadMenu(){
            if (this.$router.currentRoute.path.indexOf('role') === -1) {
                return;
            }
            const token = localStorage.getItem(CACHE_USER_KEY);
            const res = await this.loadRoleMenuList({
                token : this.getUserInfo.token ? this.getUserInfo.token: token,
                userId: this.getUserInfo.userId
            });
            if (res && res.data.statusCode === 0){
                this.itemDetail.permissions = [];
                const menus = res.data.data;
                menus.forEach(permission=>{
                    permission.enable = false;
                    this.itemDetail.permissions.push(permission);
                })
            }
        },
        async loadData() {
            if (this.$router.currentRoute.path.indexOf('role') === -1) {
                return;
            }

            // this.loading = true;
            const results = await this.loadRoleList({ token: this.getUserInfo.token,
                query: {
                    searchValue:this.searchValue,
                    agentId: '',
                    pageIndex: this.pageIndex,
                    limit: this.limit,
                    sortBy: this.sortBy,
                    sortByValue: this.sortByValue
                }
            });
            const result = results.data;

            this.list = result.data.list;
            this.header = result.data.header;
            this.loading = false;
        },
        refreshData(){
            this.loadData();
        },
        cellEvent(event){
            Notification.notifyObservers('pushSubPath', {label: 'Role Detail', path:'/home/roleDetail'});
            this.$router.push({ path:'/home/roleDetail', query: {id: event.item.roleId }});
        },
    }
}
</script>
<style scoped src="../../assets/css/all-admin.css"></style>
