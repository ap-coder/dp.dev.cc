<template>
    <div class="deliveryAddDiv">
        <div class="rowTop">
            <share-group-view
                    :message="saveMessage"
                    :show-radio-button="true"
                    :show-notice="true"
                    :show-save-button="true"
                    @save="handleShareGroup"
                    @clear="handleShareClear"></share-group-view>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import ShareGroupView from "@/components/view/ShareGroupView";
    import {CACHE_USER_KEY} from "@/utils/Constant";
    export default {
        name: "ShareFileView",
        components:{
            ShareGroupView
        },
        data(){
            return {
                saveMessage:'',
                radioGroup: '0',
                selectGroup: null,
                groupList: [],
                searchLoading: false,
            }
        },
        watch: {
            radioGroup(val){
                console.log(`radioGroup ${val}`);
                this.groupList = [];
            },
            async search(val) {
                console.log(`search ${val}`);
                this.selectMessage = '';
                // Items have already been loaded
                if (this.groupList && this.groupList.length > 0) return;

                // Items have already been requested
                if (this.searchLoading) return;

                this.searchLoading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                if (this.radioGroup === '0'){
                    const results = await this.getCustomerList({ token: token ? token :this.getUserInfo.token,
                        query: {
                            searchValue:this.searchValue,
                            filter: this.filter
                            // , agentId: this.getUserInfo.userId
                            , pageIndex: this.pageIndex, limit: this.limit
                        }});
                    const res = results.data;
                    if (res){
                        this.groupList = res.data.list;
                    }
                } else {
                    const results = await this.getGroupList({ token: token ? token : this.getUserInfo.token,
                        searchValue: val,
                        pageIndex: 1, limit: 10,
                    });
                    const res = results.data;
                    if (res){
                        this.groupList = res.data;
                    }
                }
                this.searchLoading = false;
            },
        },
        created(){
            this.loadData();
        },
        computed:{
          ...mapGetters(['getUserInfo']),
        },
        methods:{
            ...mapActions(['getCustomerList', 'getGroupList']),
            async loadData(){
                const category = this.$route.query.category;
                const id = this.$route.query.id;
                const token = localStorage.getItem(CACHE_USER_KEY);
                if (category === '0'){
                    const results = await this.getCustomerList({ token: token ? token :this.getUserInfo.token,
                        query: {
                            searchValue:'',
                            sortBy: 'registeredDate',
                            sortValue: 'DESC',
                            pageIndex: 1, limit: 1000
                        }});
                    const res = results.data;
                    if (res){
                        this.groupList = res.data.list;
                    }

                    const find = this.groupList.find(user=>user.userId === id);
                    console.log(`find === ${JSON.stringify(find)}`);
                } else {
                    const results = await this.getGroupList({ token: token ? token : this.getUserInfo.token,
                        searchValue: '',
                        pageIndex: 1, limit: 10,
                    });
                    const res = results.data;
                    if (res){
                        this.groupList = res.data;
                    }
                    const find = this.groupList.find(user=>user.groupId === id);
                    console.log(`find === ${JSON.stringify(find)}`);
                }
            },
            cancel(){
                this.$router.back();
            },
            handleShareClear(){
                this.saveMessage = '';
            },
            async handleShareGroup(user){
                console.log(`handleShareGroup == ${JSON.stringify(user)}`);
                if (user.userId){
                    this.selectGroup = user.userId;
                }
                if (user.groupId){
                    this.selectGroup = user.groupId;
                }
                console.log(`shareGroup == ${this.selectGroup}`);
            },
        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css">
</style>
