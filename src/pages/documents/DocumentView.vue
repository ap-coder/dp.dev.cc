<template>
    <div class="docDiv">

        <div class="rowPer">
            <div class="perBox" v-for="(item, i) in platFormList"
                 :key="item.key">
                <h4 @click.prevent="showDoc(item.key)">
                    <span :class="`icon ${getIcons[i]}`" ></span>{{ item.text }}</h4>
                <div class="perCon">
                    <ul>
                        <li v-for="type in getContentTypeList" :key="type.key">
                            <a href="#" class="txtBtn" @click.prevent="showDocTab(item.key , type.key)">
                            {{type.text}}</a></li>
                    </ul>
                </div><!--perCon-->
            </div><!--perBox-->
        </div>
        <div class="clear"></div>
    </div>
<!--   <div class="permissionsEditDiv">-->
<!--       <div class="rowRole">-->
<!--           <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>-->
<!--           <div class="clear"></div>-->
<!--           <div class="perBox"-->
<!--                v-for="item in platFormList"-->
<!--                :key="item.key">-->
<!--               <h4 @click.prevent="showDoc(item.key)"><span class="icon"></span>{{ item.text }}</h4>-->

<!--&lt;!&ndash;               <div class="perCon mb-2">&ndash;&gt;-->
<!--&lt;!&ndash;                   <div v-for="type in getContentTypeList" :key="type.key">&ndash;&gt;-->
<!--&lt;!&ndash;                       <a href="#" @click.prevent="showDoc(item.key , type.key)">{{type.text}}</a>&ndash;&gt;-->
<!--&lt;!&ndash;                   </div>&ndash;&gt;-->
<!--&lt;!&ndash;               </div>&ndash;&gt;-->
<!--               <div class="clear"></div>-->
<!--           </div>-->
<!--           <div class="clear"></div>-->

<!--&lt;!&ndash;           <div class="rowDiv ml-2 mr-2" v-if="item && item.content !==''">&ndash;&gt;-->
<!--&lt;!&ndash;               <div v-html="item.content"></div>&ndash;&gt;-->
<!--&lt;!&ndash;           </div>&ndash;&gt;-->
<!--       </div>-->
<!--   </div>-->
</template>

<script>
    import * as Constants from '../../utils/Constant';
    import {mapActions, mapGetters} from "vuex";
    import {CACHE_USER_KEY} from "../../utils/Constant";
    import Notification from "../../utils/notice_manager";
    export default {
        name: "DocumentView",
        data(){
          return {
              loading: false,
              list : [],
              item: null,
          }
        },
        created(){
          this.loadData();
        },
        computed: {
            ...mapGetters(['getUserInfo']),
            platFormList() {
                return Constants.FILE_TYPE.filter(m=>m.key !== -1);
            },
            getContentTypeList(){
                return [
                    { key: 0 , text: 'Getting Start' },
                    { key: 1 , text: 'Sample Project' },
                    { key: 2 , text: 'FAQ' },
                    { key: 3 , text: 'API Document' },
                ];
            },
            getIcons() {
                return ['icon-android', 'icon-ios', 'icon-windows', 'icon-linux', 'icon-xamarin', 'icon-web'];
            },
        },
        methods:{
            ...mapActions(['getDocList','getDocInfo']),
            async loadData(){
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                console.log(`load group1 ${token}  ${this.getUserInfo.token}`);
                const results = await this.getDocList({
                    token: token ? token :  this.getUserInfo.token,
                    searchValue: '',
                    filter: this.filter === -1 ? '' : this.filter,
                    pageIndex: 1,
                    limit: 10,
                });
                if (results && results.data){
                    console.log(results.data.data);
                    if (results.data.statusCode === 0){
                        this.list = results.data.data.list;
                    }
                    console.log(`this.list ${JSON.stringify(this.list)}`);
                }
                this.loading = false;
            },
            async loadDocInfoData(type, id){
                if (id === ''){
                    return;
                }
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                const results = await this.getDocInfo({
                    token: token ? token :  this.getUserInfo.token,
                    contentId: id,
                    contentType: type,
                });
                console.log(results.data);
                if (results && results.data){

                    if (results.data.statusCode === 0){
                        this.item = results.data.data;
                    }
                    console.log(`this.item ${JSON.stringify(this.item)}`);
                }
                this.loading = false;
            },
            showDoc(type) {
                // const find = this.list.find(doc=>doc.platform === type && doc.contentType === id);
                // console.log(`find doc ${JSON.stringify(find)}`);
                // if (find){
                //     this.loadDocInfoData(id, find.contentId);
                // }

                Notification.notifyObservers('pushSubPath', {label: 'Doc Detail', path:'/home/docDetail'});
                this.$router.push({ path:'/home/docDetail', query: {id: type+1 ,type: 0 }});
            },
            showDocTab(id, type) {
                // const find = this.list.find(doc=>doc.platform === type && doc.contentType === id);
                console.log(`find doc ${id} / ${type}`);
                // if (find){
                //     this.loadDocInfoData(id, find.contentId);
                // }

                Notification.notifyObservers('pushSubPath', {label: 'Doc Detail', path:'/home/docDetail'});
                this.$router.push({ path:'/home/docDetail', query: {id: id+1 ,type: type }});
            }
        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
