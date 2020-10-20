<template>
    <div>
        <table-view
            :column-keys="columnKeys"
            :loading="loading"
            :items="list"
            :header="header"
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
    import {mapActions, mapGetters} from 'vuex';
    import TableView from '@C/TableView';
    // import FlatTableView from "@/components/FlatTableView";
    // import AlertView from '../../components/tools/AlertView';
    import Notification from "@/utils/notice_manager";
    import {CACHE_PLATFORM, CACHE_USER_KEY} from "@/utils/Constant";
    export default {
        name: "DocumentView",
        components: {
            TableView,
            // FlatTableView,
            // AlertView
        },
        data(){
            return {
                list:[],
                loading: false,
                pageIndex: 1,
                limit: 10,
                item: null,
                searchValue:'',
                filter: -1,
                header: {},
                // messageDialog: {
                //     title: '',
                //     content: '',
                //     visible: false,
                //     showCancelButton: false,
                //     confirm: () => {
                //     },
                //     cancel: () => {
                //     },
                // },
            }
        },
        created(){
            this.loadData();
        },
        computed:{
            ...mapGetters([
                'getUserInfo',
                'getPlatformList',
                'showAlert',
                'hideAlert'
            ]),
            platformList(){
                const cache = localStorage.getItem(CACHE_PLATFORM);
                const data = JSON.parse(cache) ? JSON.parse(cache) :
                    this.getPlatformList;
                let list = [];
                data.forEach(option=>{
                    list.push({key: option.id, text: option.title});
                });
                console.log(`cache list ${JSON.stringify(list)}`);
                return list;
            },
            columnKeys() {
                return [
                    { value: 'name', text: 'File Name', sortable: true, required: false },
                    { value: 'platform', text: 'Platform', sortable: false, required: false, isSelect:true , options:
                           this.platformList
                    },
                    { value: 'contentType', text: 'Category', sortable: true, required: true, isSelect:true , options:
                        this.getContentTypeList },
                    { value: 'updatedDate', text: 'Update Date', sortable: false, required: true },
                    { value: 'delete', text: 'Delete', sortable: true, required: true ,isEvent: true},
                ];
            },
            getContentTypeList(){
                return [
                    { key: 0 , text: 'Getting Start' },
                    { key: 1 , text: 'Sample Project' },
                    { key: 2 , text: 'FAQ' },
                    { key: 3 , text: 'API Document' },
                ];
            }
        },
        methods:{
            ...mapActions(['getDocList','deleteDocInfo']),
            changePage(page){
                this.pageIndex = page.page;
                this.limit = page.limit;
            },
            cellEvent(edit){
                console.log(`cell event ${JSON.stringify(edit)}`);
                if (edit.key === 'delete'){
                    this.showMessageDialog('Tip', 'Are you sure delete this sdk?' , true,
                        async ()=>{
                            await this.removeEvent(edit.item);
                            // this.messageDialog.visible = false;
                            this.hideAlert();
                        });
                } else {
                    Notification.notifyObservers('pushSubPath', {label: 'Edit Document'});
                    this.$router.push({ path: 'docDetail', query: { id: edit.item.contentId }});
                }
            },
            async removeEvent(item){
                const token = localStorage.getItem(CACHE_USER_KEY);
                const res = await this.deleteDocInfo({ token: token ? token: this.getUserInfo.token
                    , info: item});
                const result = res.data;
                if (result.statusCode === 0){
                    this.loadData();
                } else {
                    this.message = result.message;
                }
            },
            async loadData(){
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                console.log(`load group1 ${token}  ${this.getUserInfo.token}`);
                const res = await this.getDocList({
                    token: token ? token :  this.getUserInfo.token,
                    searchValue: this.searchValue,
                    filter: this.filter === -1 ? '' : this.filter,
                    pageIndex: this.pageIndex, limit: this.limit,
                });
                if (res && res.data){
                    console.log(res.data.data);
                    if (res.data.statusCode === 0){
                        const result = res.data.data;
                        this.list = result.list;
                        this.header = result.header;
                    }
                    console.log(`this.list ${JSON.stringify(this.list)}`);
                }
                this.loading = false;
            },
            searchEvent(){
                this.loadData();
            },
            reset(){
                this.searchValue = '';
                this.filter = -1;
                this.loadData();
            },
            addData(){
                Notification.notifyObservers('pushSubPath', {label: 'New Document'});
                this.$router.push({ path: 'docDetail', query: { id:'' }});
            },
            confirmEvent(){
                this.messageDialog.visible = false;
            },
            showMessageDialog(title, text, visible, confirmEvent) {
                this.showAlert({
                    content: text,
                    confirmEvent
                });
                // this.messageDialog.title = title;
                // this.messageDialog.content = text;
                // this.messageDialog.visible = visible;
                // const self = this;
                // this.messageDialog.confirm = () => {
                //     self.messageDialog.visible = false;
                //     if (confirmEvent) {
                //         confirmEvent();
                //     }
                // };
                //
                // this.messageDialog.cancel = () => {
                //     self.messageDialog.visible = false;
                //     if (cancelEvent) {
                //         cancelEvent();
                //     }
                // };
            },
        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
