<template>
    <div class="messageDetailDiv">
        <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="detailBox">
        <h4>{{item.title}}</h4>
<!--        <span class="date">{{item.createdDate}}</span>-->
        <div class="messageContent" v-html="item.content"></div>
        </div><!--detailBox-->
        <div class="rowBtn">
        <a class="grayBtn" @click.prevent="cancel">Back</a>
        </div>
    </div><!--messageDetailDiv-->
</template>
<script>
import { mapActions } from 'vuex';
import {CACHE_USER_KEY} from "../../utils/Constant";
import Notification from "@/utils/notice_manager";
import common from '@M/common';

export default {
    name: "MessageDetailView",
    mixins: [common],
    data() {
        return {
            item: null,
            defaultItem: {
                title: '',
                content:'',
                shareType: '0',
            },
            loading: false
        }
    },
    created() {
        this.item = Object.assign({} , this.defaultItem);
        this.loadData();
    },
    methods: {
        ...mapActions([
            'getMessageInfo',
        ]),
        async loadData() {
            const messageId = this.$route.query.id;

            this.loading = true;
            const token = localStorage.getItem(CACHE_USER_KEY);
            const res = await this.getMessageInfo({
                token: this.getUserInfo.token ? this.getUserInfo.token : token ,
                messageId: messageId,
            });
            const result = res.data;
            this.loading = false;

            if (result && result.data){
                if (result.statusCode === 0){
                    this.item = result.data;
                    console.log(`get message ==`, this.item);
                    Notification.notifyObservers('refreshUnReadCount');
                }
            }
        },
        cancel(){
            Notification.notifyObservers('popSubPath');
            this.$router.back();
        }
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
